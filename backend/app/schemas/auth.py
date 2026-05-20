from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: EmailStr
    account_name: str
    profile_photo_url: Optional[str] = None


class UserRegisterRequest(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=1, max_length=50)
    password: str = Field(..., min_length=8, max_length=128)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.lower()

    @field_validator("username")
    @classmethod
    def normalize_account_name(cls, value: str) -> str:
        return value.strip()


class UserLoginRequest(BaseModel):
    username: EmailStr
    password: str = Field(..., min_length=1, max_length=128)

    @field_validator("username")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.lower()


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=8, max_length=128)
    new_password: str = Field(..., min_length=8, max_length=128)


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., min_length=1)


class TokenPairResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class AuthRegisterResponse(TokenPairResponse):
    id: UUID
    user: UserResponse


class AuthLoginResponse(TokenPairResponse):
    user: UserResponse


class MessageResponse(BaseModel):
    message: str
