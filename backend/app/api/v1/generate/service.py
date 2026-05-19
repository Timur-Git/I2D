from io import BytesIO
from typing import Dict, List
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.history.service import HistoryService
from app.clients.ml import MLImage, MLServiceClient
from app.config import settings
from app.db.models.upload import FileUpload
from app.db.models.user import User
from app.schemas.generate import AIConfiguration, GenerateResponse
from app.storage.client import MinioClient


class AIService:
    DEFAULT_CONFIG = AIConfiguration()

    @classmethod
    async def generate_title_description(
        cls,
        session: AsyncSession,
        user: User,
        upload_ids: List[UUID],
        config: AIConfiguration | None = None,
    ) -> GenerateResponse:
        uploads = await cls._get_user_uploads(session, user, upload_ids)
        config = config or cls.DEFAULT_CONFIG

        result = await cls._generate_with_ml_or_placeholder(uploads, config)
        history_item = await HistoryService.create_item(
            session,
            user,
            image_url=uploads[0].file_url,
            title=result["title"],
            description=result["description"],
        )

        return GenerateResponse(
            title=history_item.title,
            description=history_item.description,
            history_id=history_item.id,
            image_url=history_item.image_url,
            images_processed=len(uploads),
        )

    @classmethod
    async def _get_user_uploads(
        cls,
        session: AsyncSession,
        user: User,
        upload_ids: List[UUID],
    ) -> List[FileUpload]:
        unique_ids = list(dict.fromkeys(upload_ids))
        result = await session.execute(
            select(FileUpload).where(
                FileUpload.id.in_(unique_ids),
                FileUpload.user_id == user.id,
            )
        )
        uploads_by_id = {upload.id: upload for upload in result.scalars().all()}
        missing_ids = [str(upload_id) for upload_id in unique_ids if upload_id not in uploads_by_id]
        if missing_ids:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"message": "Some uploads were not found", "upload_ids": missing_ids},
            )

        return [uploads_by_id[upload_id] for upload_id in unique_ids]

    @classmethod
    async def _generate_with_ml_or_placeholder(
        cls,
        uploads: List[FileUpload],
        config: AIConfiguration,
    ) -> Dict[str, str]:
        if not settings.ml_service_url:
            return cls._placeholder_generation(config)

        images = await cls._prepare_ml_images(uploads)
        result = await MLServiceClient().generate(images, config)
        return {"title": result.title, "description": result.description}

    @classmethod
    async def _prepare_ml_images(cls, uploads: List[FileUpload]) -> List[MLImage]:
        storage = MinioClient()
        images: List[MLImage] = []

        for upload in uploads:
            raw_content = await storage.download_file(upload.file_url)

            if upload.mime_type == "image/jpeg":
                images.append(
                    MLImage(
                        filename=f"{upload.id}.jpg",
                        content=raw_content,
                        content_type="image/jpeg",
                    )
                )
                continue

            if upload.mime_type != "image/png":
                raise HTTPException(
                    status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                    detail="Only JPG, JPEG and PNG images can be sent to ML service",
                )

            jpeg_content = cls._convert_png_to_jpeg(raw_content)
            images.append(
                MLImage(
                    filename=f"{upload.id}.jpg",
                    content=jpeg_content,
                    content_type="image/jpeg",
                )
            )

        return images

    @staticmethod
    def _convert_png_to_jpeg(file_content: bytes) -> bytes:
        from PIL import Image, UnidentifiedImageError

        try:
            with Image.open(BytesIO(file_content)) as image:
                image = image.convert("RGBA")
                background = Image.new("RGBA", image.size, (255, 255, 255, 255))
                background.alpha_composite(image)
                output = BytesIO()
                background.convert("RGB").save(output, format="JPEG", quality=95, optimize=True)
                return output.getvalue()
        except UnidentifiedImageError as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not convert PNG image to JPEG",
            ) from exc

    @staticmethod
    def _placeholder_generation(config: AIConfiguration) -> Dict[str, str]:
        language = config.language
        if language == "en":
            return {
                "title": "Product from photo",
                "description": (
                    "A draft marketplace product description generated from the uploaded photo. "
                    "Connect the ML service to replace this placeholder with YOLO and LLM output."
                ),
            }

        return {
            "title": "Product from photo",
            "description": (
                "Draft marketplace product description generated from the uploaded photo. "
                "Connect the ML service to replace this placeholder with YOLO and LLM output."
            ),
        }
