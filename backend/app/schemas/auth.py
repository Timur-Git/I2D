from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field


class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    account_name: str
    profile_photo_url: Optional[str] = None

    class Config:
        from_attributes = True


class UserRegisterRequest(BaseModel):
    email: EmailStr = Field(..., description="Уникальный email пользователя")
    account_name: str = Field(..., min_length=1, max_length=50, description="Имя аккаунта")
    password: str = Field(..., min_length=8, description="Пароль (минимум 8 символов)")


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=8)
    new_password: str = Field(..., min_length=8)


class AuthRegisterResponse(BaseModel):
    id: UUID
    token: str
    user: UserResponse

    class Config:
        from_attributes = True


class AuthLoginResponse(BaseModel):
    token: str
    user: UserResponse


class MessageResponse(BaseModel):
    message: str
