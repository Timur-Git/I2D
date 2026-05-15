from datetime import datetime
from typing import Optional, Dict, Any
from fastapi import HTTPException, status, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.core.base_exceptions import FileUploadError, StorageError
from app.storage.client import MinioClient
from app.schemas.upload import FileInfoResponse


class UploadService:
    """Сервис для работы с загрузкой изображений."""
    
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
    
    VALID_MIME_TYPES = [
        'image/jpeg',
        'image/png', 
        'image/webp',
        'image/jpg'
    ]
    
    ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}
    
    @classmethod
    async def upload_photo(
        cls,
        session: AsyncSession,
        user_id: str,
        file: UploadFile
    ) -> Dict[str, Any]:
        """
        Загрузить фото товара.
        
        Args:
            session: Async SQLAlchemy сессия
            user_id: ID владельца файла
            file: Uploaded file from FastAPI
            
        Returns:
            dict с id, url, size, type
            
        Raises:
            FileUploadError: Если файл невалиден или ошибка при загрузке
        """
        # Проверка на пустой файл
        if not file or not hasattr(file.file, 'read'):
            raise FileUploadError("Файл не предоставлен")
        
        # Чтение содержимого файла
        try:
            content = await file.read()
        except Exception as e:
            raise FileUploadError(f"Ошибка чтения файла: {str(e)}")
        
        # Проверка размера
        if len(content) > cls.MAX_FILE_SIZE:
            raise FileUploadError(
                f"Размер файла не может превышать {cls.MAX_FILE_SIZE / 1024 / 1024:.1f}MB"
            )
        
        # Определяем MIME тип из заголовка или по расширению
        content_type = file.content_type or cls._get_mime_from_extension(file.filename)
        
        # Валидация MIME типа (разрешены только изображения)
        if content_type not in cls.VALID_MIME_TYPES:
            raise FileUploadError(
                f"Недопустимый тип файла. Разрешены: {', '.join(cls.VALID_MIME_TYPES)}"
            )
        
        # Генерация уникального имени
        original_filename = file.filename or f"upload_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        unique_filename = f"{uuid.uuid4().hex}_{original_filename}"
        
        # Создание MinIO клиента и загрузка
        storage = MinioClient()
        
        try:
            file_url = await storage.upload_file(
                file_content=content,
                filename=unique_filename,
                content_type=content_type
            )
            
            # Создаем запись в БД (будет добавлено позже через репозиторий)
            # upload_record = FileUpload(
            #     user_id=user_id,
            #     original_filename=original_filename,
            #     file_url=file_url,
            #     file_size=len(content),
            #     file_type=cls._get_file_type_from_mime(content_type),
            #     mime_type=content_type,
            # )
            # session.add(upload_record)
            # await session.flush()
            
            return {
                'id': str(uuid.uuid4()),
                'url': file_url,
                'size': len(content),
                'type': content_type,
                'filename': original_filename,
            }
        except Exception as e:
            raise StorageError(f"Ошибка загрузки файла в хранилище: {str(e)}")
    
    @classmethod
    async def delete_photo(
        cls,
        session: AsyncSession,
        file_id: str,
        file_url: Optional[str] = None
    ) -> dict:
        """
        Удалить загруженное фото.
        
        Args:
            session: Async SQLAlchemy сессия
            file_id: ID файла из БД
            file_url: URL файла в MinIO (опционально)
            
        Returns:
            Мессаж об успешном удалении
            
        Raises:
            StorageError: Если ошибка при удалении
        """
        storage = MinioClient()
        
        try:
            if file_url and not file_url.startswith('http'):
                # Используем ID как ключ, если URL не полный
                file_id_to_delete = file_url or file_id
            else:
                file_id_to_delete = file_id
            
            success = await storage.delete_file(file_id_to_delete)
            
            if not success:
                raise StorageError(f"Не удалось удалить файл по ID {file_id}")
            
            return {"message": "Фото успешно удалено"}
        except Exception as e:
            raise StorageError(f"Ошибка при удалении файла: {str(e)}")
    
    @classmethod
    async def get_file_info(
        cls,
        session: AsyncSession,
        file_id: str
    ) -> FileInfoResponse:
        """
        Получить информацию о файле.
        
        Args:
            session: Async SQLAlchemy сессия (для получения записи из БД)
            file_id: ID файла
            
        Returns:
            FileInfoResponse с метаданными
        """
        storage = MinioClient()
        
        try:
            # Получить инфу из MinIO
            file_info = await storage.get_file_info(file_id)
            
            if not file_info:
                raise FileUploadError(f"Файл не найден по ID {file_id}")
            
            return FileInfoResponse(
                id=file_id,
                url=file_info['url'],
                size=file_info['size'],
                type=file_info.get('type', ''),
                original_filename=file_info.get('original_filename', ''),
                mime_type=file_info.get('mime_type', '')
            )
        except Exception as e:
            raise FileUploadError(f"Ошибка получения информации о файле: {str(e)}")
    
    @staticmethod
    def _get_mime_from_extension(filename: Optional[str]) -> str:
        """Определить MIME тип по расширению файла."""
        if not filename:
            return 'application/octet-stream'
        
        ext = filename.lower().split('.')[-1]
        
        mime_map = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'webp': 'image/webp',
            'gif': 'image/gif',
            'bmp': 'image/bmp'
        }
        
        return mime_map.get(ext, 'application/octet-stream')
    
    @staticmethod
    def _get_file_type_from_mime(mime_type: str) -> str:
        """Упростить MIME тип до базового типа (jpg/png/webp)."""
        if mime_type in ['image/jpeg', 'image/jpg']:
            return 'jpg'
        elif mime_type == 'image/png':
            return 'png'
        elif mime_type == 'image/webp':
            return 'webp'
        else:
            return mime_type
