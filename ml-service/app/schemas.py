from typing import List, Optional

from pydantic import BaseModel, Field


class DetectedObject(BaseModel):
    name: str
    confidence: float = Field(..., ge=0.0, le=1.0)


class GenerateResponse(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    detected_object: DetectedObject
    processed_images: int


class HealthResponse(BaseModel):
    status: str


class ProductCardDraft(BaseModel):
    title: str
    description: str


class GenerationConfig(BaseModel):
    language: str = "ru"
    style: Optional[str] = None
    tone: Optional[str] = None


class ImageAnalysisResult(BaseModel):
    object_name: str
    confidence: float
    index: int
