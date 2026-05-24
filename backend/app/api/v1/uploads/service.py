import re
import uuid
from pathlib import Path
from typing import Iterable, List
from uuid import UUID

from fastapi import HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.upload import FileUpload
from app.db.models.user import User
from app.schemas.upload import FileInfoResponse, FileUploadResponse
from app.storage.client import MinioClient


class UploadService:
    MAX_FILE_SIZE = 5 * 1024 * 1024
    MAX_FILES_PER_REQUEST = 5
    ALLOWED_MIME_TYPES = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
    }

    @classmethod
    async def upload_photo(
        cls,
        session: AsyncSession,
        user: User,
        file: UploadFile,
    ) -> FileUploadResponse:
        content = await cls._read_and_validate_file(file)
        mime_type = cls._validated_mime_type(file, content)
        extension = cls.ALLOWED_MIME_TYPES[mime_type]
        original_filename = cls._safe_original_filename(file.filename, extension)
        object_name = f"users/{user.id}/uploads/{uuid.uuid4().hex}.{extension}"

        storage = MinioClient()
        file_url = await storage.upload_file(
            file_content=content,
            filename=object_name,
            content_type=mime_type,
        )

        upload = FileUpload(
            user_id=user.id,
            original_filename=original_filename,
            file_url=file_url,
            file_size=len(content),
            file_type=extension,
            mime_type=mime_type,
        )
        session.add(upload)
        await session.flush()

        return cls._to_upload_response(upload)

    @classmethod
    async def upload_photos(
        cls,
        session: AsyncSession,
        user: User,
        files: Iterable[UploadFile],
    ) -> List[FileUploadResponse]:
        files = list(files)
        if not files:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="At least one file is required")
        if len(files) > cls.MAX_FILES_PER_REQUEST:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Maximum {cls.MAX_FILES_PER_REQUEST} files are allowed",
            )

        return [await cls.upload_photo(session, user, file) for file in files]

    @classmethod
    async def get_file_info(
        cls,
        session: AsyncSession,
        user: User,
        file_id: UUID,
    ) -> FileInfoResponse:
        upload = await cls._get_user_upload(session, user, file_id)
        return FileInfoResponse(
            id=upload.id,
            url=upload.file_url,
            size=upload.file_size,
            type=upload.file_type,
            original_filename=upload.original_filename,
            mime_type=upload.mime_type,
            uploaded_at=upload.uploaded_at,
        )
    
    @classmethod
    async def get_file_presigned_url(
        cls,
        session: AsyncSession,
        user: User,
        file_id: UUID,
        expires: int = 3600,  # 1 час
    ) -> str:
        upload = await cls._get_user_upload(session, user, file_id)
        storage = MinioClient()
        return await storage.get_presigned_url(upload.file_url, expires)

    @classmethod
    async def delete_photo(
        cls,
        session: AsyncSession,
        user: User,
        file_id: UUID,
    ) -> dict:
        upload = await cls._get_user_upload(session, user, file_id)
        storage = MinioClient()
        deleted = await storage.delete_file(upload.file_url)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Could not delete file from object storage",
            )

        await session.delete(upload)
        await session.flush()
        return {"message": "Photo successfully deleted"}

    @classmethod
    async def _get_user_upload(
        cls,
        session: AsyncSession,
        user: User,
        file_id: UUID,
    ) -> FileUpload:
        result = await session.execute(
            select(FileUpload).where(FileUpload.id == file_id, FileUpload.user_id == user.id)
        )
        upload = result.scalar_one_or_none()
        if not upload:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
        return upload

    @classmethod
    async def _read_and_validate_file(cls, file: UploadFile) -> bytes:
        if not file:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File is required")

        content = await file.read()
        if not content:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File is empty")
        if len(content) > cls.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File size must not exceed {cls.MAX_FILE_SIZE // (1024 * 1024)}MB",
            )
        return content

    @classmethod
    def _validated_mime_type(cls, file: UploadFile, content: bytes) -> str:
        declared = (file.content_type or "").lower()
        detected = cls._detect_image_mime(content)

        if declared not in cls.ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail="Only JPG, JPEG, PNG and WEBP images are allowed",
            )
        if detected != declared:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail="File content does not match its declared image type",
            )
        return declared

    @staticmethod
    def _detect_image_mime(content: bytes) -> str | None:
        if content.startswith(b"\xff\xd8\xff"):
            return "image/jpeg"
        if content.startswith(b"\x89PNG\r\n\x1a\n"):
            return "image/png"
        if len(content) >= 12 and content.startswith(b"RIFF") and content[8:12] == b"WEBP":
            return "image/webp"
        return None

    @staticmethod
    def _safe_original_filename(filename: str | None, extension: str) -> str:
        name = Path(filename or f"upload.{extension}").name
        name = re.sub(r"[^A-Za-z0-9._-]+", "_", name).strip("._")
        return name or f"upload.{extension}"

    @staticmethod
    def _to_upload_response(upload: FileUpload) -> FileUploadResponse:
        return FileUploadResponse(
            id=upload.id,
            url=upload.file_url,
            size=upload.file_size,
            type=upload.file_type,
            original_filename=upload.original_filename,
        )
