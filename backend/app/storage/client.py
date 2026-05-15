import boto3
from botocore.config import Config
from typing import Optional
from app.config import settings


class MinioClient:
    """Клиент для работы с MinIO/S3 объектным хранилищем."""
    
    def __init__(self):
        self.endpoint_url = f"http://{settings.minio_endpoint}"
        
        # Create S3 client with config for better connection handling
        self.client = boto3.client(
            's3',
            endpoint_url=self.endpoint_url,
            aws_access_key_id=settings.minio_access_key,
            aws_secret_access_key=settings.minio_secret_key,
            region_name='us-east-1',  # Default region for MinIO
            config=Config(signature_version='s3v4'),
        )
        
        self.bucket = settings.minio_bucket
    
    async def bucket_exists(self) -> bool:
        """Проверка существования бакета."""
        try:
            await self.client.head_bucket(Bucket=self.bucket)
            return True
        except Exception as e:
            print(f"Bucket not found or error: {e}")
            return False
    
    async def create_bucket_if_not_exists(self):
        """Создать бакет если его нет."""
        exists = await self.bucket_exists()
        if not exists:
            await self.client.create_bucket(
                Bucket=self.bucket,
                CreateBucketConfiguration={'LocationConstraint': 'us-east-1'} if settings.minio_endpoint.startswith('localhost') else None
            )
    
    async def upload_file(self, file_content: bytes, filename: str, content_type: str = '') -> str:
        """Загрузить файл в MinIO."""
        await self.create_bucket_if_not_exists()
        
        # Generate unique filename to avoid collisions
        import uuid
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        
        url = f"{self.endpoint_url}/{self.bucket}/{unique_filename}"
        
        await self.client.put_object(
            Bucket=self.bucket,
            Key=unique_filename,
            Body=file_content,
            ContentType=content_type or 'application/octet-stream',
        )
        
        return url
    
    async def delete_file(self, file_id: str) -> bool:
        """Удалить файл по ID."""
        import os
        from urllib.parse import urlparse
        
        # Extract filename from URL or use ID as key
        if file_id.startswith(self.endpoint_url):
            path = file_id.replace(self.endpoint_url + '/', '')
        else:
            path = file_id
        
        try:
            await self.client.delete_object(Bucket=self.bucket, Key=path)
            return True
        except Exception:
            return False
    
    async def get_file_info(self, file_id: str) -> dict:
        """Получить информацию о файле."""
        import os
        from urllib.parse import urlparse
        
        if file_id.startswith(self.endpoint_url):
            path = file_id.replace(self.endpoint_url + '/', '')
        else:
            path = file_id
        
        try:
            response = await self.client.head_object(Bucket=self.bucket, Key=path)
            return {
                'url': file_id,
                'size': response['ContentLength'],
                'type': response.get('ContentType', ''),
                'original_filename': os.path.basename(path),
                'mime_type': response.get('ContentType', ''),
            }
        except Exception:
            return {}
