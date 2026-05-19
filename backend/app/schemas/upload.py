from datetime import datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class FileUploadResponse(BaseModel):
    id: UUID
    url: str
    size: int
    type: str
    original_filename: str


class FileUploadBatchResponse(BaseModel):
    files: List[FileUploadResponse]


class FileInfoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    url: str
    size: int
    type: str
    original_filename: str
    mime_type: str
    uploaded_at: datetime
