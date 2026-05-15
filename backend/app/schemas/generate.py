from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
    image_url: str = Field(..., description="URL загруженного изображения")


class GenerateResponse(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=1000)


class AIConfiguration(BaseModel):
    language: str = "ru"  # ru/en/uk
    style: Optional[str] = None  # sales/marketing/technical
    tone: Optional[str] = None   # formal/casual/professional
