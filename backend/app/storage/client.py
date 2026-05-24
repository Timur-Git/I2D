import asyncio
from urllib.parse import unquote, urlparse

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError

from app.config import settings


class MinioClient:
    def __init__(self):
        scheme = "https" if settings.minio_secure else "http"
        self.endpoint_url = f"{scheme}://{settings.minio_endpoint}"
        public_endpoint = settings.minio_public_endpoint or settings.minio_endpoint
        self.public_endpoint_url = f"{scheme}://{public_endpoint}"
        self.bucket = settings.minio_bucket
        self.client = boto3.client(
            "s3",
            endpoint_url=self.endpoint_url,
            aws_access_key_id=settings.minio_access_key,
            aws_secret_access_key=settings.minio_secret_key,
            region_name="us-east-1",
            config=Config(signature_version="s3v4"),
        )

    def _public_url(self, object_name: str) -> str:
        return f"{self.public_endpoint_url}/{self.bucket}/{object_name}"

    def object_name_from_reference(self, file_reference: str) -> str:
        parsed = urlparse(file_reference)
        if parsed.scheme and parsed.netloc:
            path = unquote(parsed.path).lstrip("/")
        else:
            path = file_reference.lstrip("/")

        bucket_prefix = f"{self.bucket}/"
        if path.startswith(bucket_prefix):
            path = path[len(bucket_prefix):]

        return path

    async def bucket_exists(self) -> bool:
        try:
            await asyncio.to_thread(self.client.head_bucket, Bucket=self.bucket)
            return True
        except ClientError:
            return False

    async def create_bucket_if_not_exists(self) -> None:
        if not await self.bucket_exists():
            await asyncio.to_thread(self.client.create_bucket, Bucket=self.bucket)

    async def upload_file(self, file_content: bytes, filename: str, content_type: str = "") -> str:
        await self.create_bucket_if_not_exists()
        object_name = filename.lstrip("/")
        await asyncio.to_thread(
            self.client.put_object,
            Bucket=self.bucket,
            Key=object_name,
            Body=file_content,
            ContentType=content_type or "application/octet-stream",
        )
        return self._public_url(object_name)

    async def download_file(self, file_reference: str) -> bytes:
        object_name = self.object_name_from_reference(file_reference)
        response = await asyncio.to_thread(
            self.client.get_object,
            Bucket=self.bucket,
            Key=object_name,
        )
        try:
            return await asyncio.to_thread(response["Body"].read)
        finally:
            response["Body"].close()

    async def delete_file(self, file_reference: str) -> bool:
        object_name = self.object_name_from_reference(file_reference)
        try:
            await asyncio.to_thread(self.client.delete_object, Bucket=self.bucket, Key=object_name)
            return True
        except ClientError:
            return False
    
    async def get_presigned_url(self, file_reference: str, expires: int = 3600) -> str:
        """
        Генерация пре-подписанного URL для доступа к файлу.
        
        Args:
            file_reference: URL файла или имя объекта
            expires: Время жизни ссылки в секундах (по умолчанию: 3600 = 1 час)
        
        Returns:
            str: Пре-подписанный URL для скачивания файла
        """
        object_name = self.object_name_from_reference(file_reference)
        
        # generate_presigned_url — синхронный метод boto3, запускаем в потоке
        url = await asyncio.to_thread(
            self.client.generate_presigned_url,
            'get_object',  # Операция: получение объекта
            Params={
                'Bucket': self.bucket,
                'Key': object_name
            },
            ExpiresIn=expires,  # Время жизни ссылки
            HttpMethod='GET'
        )
        return url

    async def get_file_info(self, file_reference: str) -> dict:
        object_name = self.object_name_from_reference(file_reference)
        try:
            response = await asyncio.to_thread(
                self.client.head_object,
                Bucket=self.bucket,
                Key=object_name,
            )
        except ClientError:
            return {}

        return {
            "url": self._public_url(object_name),
            "size": response["ContentLength"],
            "type": response.get("ContentType", ""),
            "original_filename": object_name.rsplit("/", 1)[-1],
            "mime_type": response.get("ContentType", ""),
        }
