import uuid

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Index, String, Text, func
from sqlalchemy.dialects.postgresql import UUID

from app.db.session import Base


class GenerationHistory(Base):
    __tablename__ = "generation_histories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    image_url = Column(String(1000), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    is_edited = Column(Boolean, default=False, server_default="false", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    modified_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    __table_args__ = (
        Index("ix_gen_history_created_at", "created_at"),
        Index("ix_gen_history_modified_at", "modified_at"),
    )

    def __repr__(self) -> str:
        return f"<GenerationHistory(id={self.id}, title={self.title[:30]!r})>"
