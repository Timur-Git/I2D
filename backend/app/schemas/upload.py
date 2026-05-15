from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class FileUploadResponse(BaseModel):
    id: UUID
    url: str
    size: int
    type: str

    class Config:
        from_attributes = True


class PhotoUploadRequest(BaseModel):
    file: bytes  # Multipart form-data will provide this as bytes


class FileInfoResponse(BaseModel):
    id: UUID
    url: str
    size: int
    type: str
    original_filename: str
    mime_type: str
    uploaded_at: datetime

    class Config:
        from_attributes = True
