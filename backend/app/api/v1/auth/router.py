from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.api.v1.deps import DbSession, get_current_user
from app.api.v1.auth.service import AuthService
from app.db.models.user import User
from app.schemas.auth import (
    AuthLoginResponse,
    AuthRegisterResponse,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    MessageResponse,
    RefreshTokenRequest,
    TokenPairResponse,
    UserLoginRequest,
    UserRegisterRequest,
)


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=AuthRegisterResponse)
async def register_user(request: UserRegisterRequest, db: DbSession):
    user, tokens = await AuthService.register(
        db,
        email=str(request.email),
        account_name=request.username,
        password=request.password,
    )
    return AuthRegisterResponse(id=user.id, user=user, **tokens)


@router.post("/login", response_model=AuthLoginResponse)
async def login_user(request: UserLoginRequest, db: DbSession):
    user, tokens = await AuthService.login(db, email=str(request.username), password=request.password)
    return AuthLoginResponse(user=user, **tokens)


@router.post("/refresh", response_model=TokenPairResponse)
async def refresh_token(request: RefreshTokenRequest, db: DbSession):
    _user, tokens = await AuthService.refresh(db, request.refresh_token)
    return TokenPairResponse(**tokens)


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(request: ForgotPasswordRequest, db: DbSession):
    return await AuthService.forgot_password(db, str(request.email))


@router.put("/change-password", response_model=MessageResponse)
async def change_password(
    request: ChangePasswordRequest,
    db: DbSession,
    current_user: Annotated[User, Depends(get_current_user)],
):
    await AuthService.change_password(
        db,
        user=current_user,
        current_password=request.current_password,
        new_password=request.new_password,
    )
    return MessageResponse(message="Password changed successfully")
