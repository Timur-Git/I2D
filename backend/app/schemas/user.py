from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field


class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    account_name: str
    profile_photo_url: Optional[str] = None
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserUpdateRequest(BaseModel):
    account_name: Optional[str] = Field(None, min_length=1, max_length=50)
    email: Optional[EmailStr] = None
    profile_photo: Optional[str] = None  # URL или base64-encoded image


class AccountDeleteResponse(BaseModel):
    message: str


class ProfilePhotoUpdate(BaseModel):
    url: str
