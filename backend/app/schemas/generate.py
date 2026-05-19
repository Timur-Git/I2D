from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class AIConfiguration(BaseModel):
    language: str = Field("ru", pattern="^(ru|en)$")
    style: Optional[str] = Field(None, max_length=50)
    tone: Optional[str] = Field(None, max_length=50)


class GenerateRequest(BaseModel):
    upload_ids: List[UUID] = Field(..., min_length=1, max_length=5)
    config: Optional[AIConfiguration] = None


class GenerateResponse(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=5000)
    history_id: UUID
    image_url: str
    images_processed: int
