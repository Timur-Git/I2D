import uuid
from datetime import datetime
from typing import Optional

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
        comment="Email адрес пользователя", comment="Email адрес пользователя"
    )
    account_name = Column(
        String(50), unique=True, nullable=False, index=True,
        comment="Имя аккаунта/никнейм", comment="Имя аккаунта пользователя"
    )
    hashed_password = Column(
        String(255), nullable=False,
        comment="Хешированный пароль (bcrypt)", comment="Хешированный пароль пользователя"
    )
    profile_photo_url = Column(
        String(1000), nullable=True,
        comment="URL аватара/профильного фото", comment="URL профиля фото пользователя"
    )
    is_active = Column(
        Boolean, default=True, nullable=False,
        comment="Статус активности аккаунта", comment="Активен ли аккаунт"
    )
    created_at = Column(
        DateTime(timezone=True), server_default=DateTime.now().astimezone(), nullable=False,
        comment="Дата регистрации", comment="Дата создания записи"
    )
    updated_at = Column(
        DateTime(timezone=True), onupdate=DateTime.now().astimezone(), nullable=False,
        comment="Дата последнего обновления", comment="Дата последнего обновления записи"
    )
    deleted_at = Column(
        DateTime(timezone=True), nullable=True,
        comment="Soft delete timestamp", comment="Временная метка мягкого удаления"
    )
    
    __table_args__ = (
        Index("ix_users_email", "email"),
        Index("ix_users_account_name", "account_name"),
        Index("ix_users_created_at", "created_at"),
        Index(
            "ix_users_soft_delete", 
            "deleted_at" where deleted_at.is_not_null(), 
            postgresql_include=["id"]
        ),
    )
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"
