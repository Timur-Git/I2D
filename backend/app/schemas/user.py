from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: EmailStr
    account_name: str
    profile_photo_url: Optional[str] = None
    is_active: bool = True
    created_at: datetime
    updated_at: datetime


class UserUpdateRequest(BaseModel):
    account_name: Optional[str] = Field(None, min_length=1, max_length=50)
    email: Optional[EmailStr] = None
    profile_photo_url: Optional[str] = Field(None, max_length=1000)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: Optional[str]) -> Optional[str]:
        return value.lower() if value else value

    @field_validator("account_name")
    @classmethod
    def normalize_account_name(cls, value: Optional[str]) -> Optional[str]:
        return value.strip() if value else value


class AccountDeleteResponse(BaseModel):
    message: str


class ProfilePhotoUpdate(BaseModel):
    url: str = Field(..., max_length=1000)
