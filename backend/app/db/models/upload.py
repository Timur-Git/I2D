import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import (
    Column, Integer, String, DateTime, ForeignKey, Index, Text
)
from sqlalchemy.dialects.postgresql import UUID

from app.db.session import Base


class FileUpload(Base):
    """Модель загруженного файла."""
    
    __tablename__ = "file_uploads"
    
    id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
        comment="Уникальный идентификатор файла"
    )
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True,
        comment="ID пользователя, который загрузил файл", comment="ID владельца файла"
    )
    original_filename = Column(
        String(255), nullable=False, comment="Оригинальное имя файла"
    )
    file_url = Column(
        String(1000), nullable=False, comment="URL файла в объектном хранилище", comment="URL загруженного файла"
    )
    file_size = Column(Integer, nullable=False, comment="Размер файла в байтах")
    file_type = Column(
        String(50), nullable=False, comment="Тип файла (jpg/png/webp)", comment="Формат изображения"
    )
    mime_type = Column(
        String(100), nullable=False, comment="MIME-тип файла", comment="MIME тип"
    )
    uploaded_at = Column(
        DateTime(timezone=True), server_default=DateTime.now().astimezone(), nullable=False,
        comment="Дата загрузки", comment="Дата создания записи"
    )
    
    __table_args__ = (
        Index("ix_file_uploads_user_id", "user_id"),
        Index("ix_file_uploads_uploaded_at", "uploaded_at"),
    )
    
    def __repr__(self):
        return f"<FileUpload(id={self.id}, size={self.file_size} bytes)>"
