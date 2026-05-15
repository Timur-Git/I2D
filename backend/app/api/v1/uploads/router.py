from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import get_current_user_dependency
from app.schemas.upload import (
    PhotoUploadRequest,
    FileInfoResponse,
)
from app.storage.service import UploadService
from app.db.models.user import UserRepository  # Будет использоваться позже

router = APIRouter(prefix="/uploads", tags=["Загрузка изображений"])


@router.post(
    "/photo",
    summary="Загрузить фото товара",
    response_model=FileInfoResponse,
    responses={
        201: {"description": "Файл успешно загружен"},
        400: {"description": "Ошибка валидации файла"}
    }
)
async def upload_photo(
    file: UploadFile = File(..., description="Фото товара для загрузки"),
    authorization: str | None = Header(None),
):
    """
    Загрузить фото товара в хранилище.
    
    - Поддерживаются форматы: JPG, JPEG, PNG, WebP
    - Максимальный размер файла: 5MB
    
    В реальном приложении здесь будет использоваться multipart/form-data с файлом.
    """
    # Валидация authorization (в реальном приложении)
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Требуется авторизация"
        )
    
    # В реальности нужно будет:
    # 1. Получить user_id из токена
    # 2. Использовать async сессию БД через Depends(get_db)
    # 3. Вызвать UploadService.upload_photo()
    
    return FileInfoResponse(
        id="mock-id",
        url=f"http://storage/uploads/mock_{file.filename}",
        size=0,
        type="image/jpeg",
        original_filename=file.filename or "unknown.jpg",
        mime_type=file.content_type or "image/jpeg"
    )


@router.delete(
    "/{file_id}",
    summary="Удалить загруженное фото",
    responses={
        200: {"description": "Фото успешно удалено"},
        401: {"description": "Отсутствует авторизация"}
    }
)
async def delete_photo(
    file_id: str,
    authorization: str | None = Header(None),
):
    """Удалить фото по ID."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Требуется авторизация"
        )
    
    # В реальном приложении:
    # 1. Получить user_id из токена
    # 2. Использовать сессию БД
    # 3. Вызвать UploadService.delete_photo()
    
    return {"message": "Фото успешно удалено"}


@router.get(
    "/{file_id}",
    summary="Получить информацию о файле"
)
async def get_file_info(
    file_id: str,
):
    """Получить метаданные файла из хранилища."""
    # В реальном приложении будет использовать UploadService.get_file_info()
    
    return FileInfoResponse(
        id=file_id,
        url=f"http://storage/uploads/{file_id}",
        size=0,
        type="image/jpeg",
        original_filename="example.jpg",
        mime_type="image/jpeg"
    )
