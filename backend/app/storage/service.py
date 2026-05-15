import uuid
from datetime import datetime
from typing import Optional, Dict, Any
from io import BytesIO

from app.db.models.user import UserRepository
from app.storage.client import MinioClient


class UploadService:
    """Сервис для загрузки и управления изображениями."""
    
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
    ALLOWED_MIME_TYPES = {'image/jpeg', 'image/png', 'image/webp'}
    
    def __init__(self, db: UserRepository, storage: MinioClient):
        self.db = db
        self.storage = storage
    
    async def upload_photo(self, file_content: bytes, content_type: str, user_id: str) -> Dict[str, Any]:
        """
        Загрузить фото пользователя.
        
        Args:
            file_content: Контент файла в bytes
            content_type: MIME типа файла
            user_id: ID владельца
        
        Returns:
            dict с id, url, size, type
        """
        # Validate content type
        if content_type not in self.ALLOWED_MIME_TYPES:
            raise ValueError("Недопустимый тип файла. Разрешены: jpg, png, webp")
        
        # Validate file size
        if len(file_content) > self.MAX_FILE_SIZE:
            raise ValueError(f"Размер файла не может превышать {self.MAX_FILE_SIZE} байт")
        
        # Generate unique filename
        original_filename = f"{uuid.uuid4().hex}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        
        # Upload to MinIO
        file_url = await self.storage.upload_file(
            file_content=file_content,
            filename=original_filename,
            content_type=content_type
        )
        
        return {
            'id': str(uuid.uuid4()),
            'url': file_url,
            'size': len(file_content),
            'type': content_type,
        }
