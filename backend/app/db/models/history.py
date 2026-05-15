import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, ForeignKey, Index, Text
)
from sqlalchemy.dialects.postgresql import UUID

from app.db.session import Base


class GenerationHistory(Base):
    """Модель истории генераций."""
    
    __tablename__ = "generation_histories"
    
    id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
        comment="Уникальный идентификатор записи в истории"
    )
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True,
        comment="ID пользователя, чья это история", comment="ID владельца записи"
    )
    image_url = Column(
        String(1000), nullable=False, comment="URL сгенерированного изображения", comment="URL сгенерированного фото"
    )
    title = Column(String(200), nullable=False, comment="Сгенерированный заголовок")
    description = Column(Text, nullable=False, comment="Сгенерированное описание")
    is_edited = Column(Boolean, default=False, nullable=False, comment="Была ли запись отредактирована")
    
    # Timestamps (created_at и modified_at)
    created_at = Column(
        DateTime(timezone=True), server_default=DateTime.now().astimezone(), nullable=False,
        comment="Дата создания записи"
    )
    modified_at = Column(
        DateTime(timezone=True), onupdate=DateTime.now().astimezone(), nullable=False,
        comment="Дата последнего редактирования"
    )
    
    __table_args__ = (
        Index("ix_gen_history_user_id", "user_id"),
        Index("ix_gen_history_created_at", "created_at"),
        Index("ix_gen_history_modified_at", "modified_at"),
        Index(
            "ix_gen_history_search", 
            "title" where title.is_not(None) + " " + description where description.is_not(None),
            postgresql_using="gin"
        ),
    )
    
    def __repr__(self):
        return f"<GenerationHistory(id={self.id}, title='{self.title[:30]}...')>"
