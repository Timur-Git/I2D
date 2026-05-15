import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import func, text

from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, ForeignKey, Index, Text
)
from sqlalchemy.dialects.postgresql import UUID

from app.db.session import Base


class User(Base):
    """Модель пользователя."""
    
    __tablename__ = "users"
    
    id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
        comment="Уникальный идентификатор пользователя"
    )
    email = Column(
        String(255), unique=True, nullable=False, index=True,
        comment="Email адрес пользователя"
    )
    account_name = Column(
        String(50), unique=True, nullable=False, index=True,
        comment="Имя аккаунта/никнейм"
    )
    hashed_password = Column(
        String(255), nullable=False,
        comment="Хешированный пароль (bcrypt)"
    )
    profile_photo_url = Column(
        String(1000), nullable=True,
        comment="URL аватара/профильного фото"
    )
    is_active = Column(
        Boolean, default=True, nullable=False,
        comment="Статус активности аккаунта"
    )
    created_at = Column(
        DateTime(timezone=True), server_default=text('CURRENT_TIMESTAMP'), nullable=False,
        comment="Дата регистрации"
    )
    updated_at = Column(
        DateTime(timezone=True), onupdate=func.now(), nullable=False,
        comment="Дата последнего обновления"
    )
    deleted_at = Column(
        DateTime(timezone=True), nullable=True,
        comment="Soft delete timestamp"
    )
    
    __table_args__ = (
        Index("ix_users_email", "email"),
        Index("ix_users_account_name", "account_name"),
        Index("ix_users_created_at", "created_at"),
    )
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"
