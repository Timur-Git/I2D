from fastapi import APIRouter, Depends, status, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.api.v1.deps import get_current_user_dependency
from app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    ForgotPasswordRequest,
    AuthRegisterResponse,
    AuthLoginResponse,
    MessageResponse,
)
from app.db.repositories.user import UserRepository  # Будет использоваться позже
from app.api.v1.auth.service import AuthService

router = APIRouter(prefix="/auth", tags=["Аутентификация"])


@router.post(
    "/register",
    response_model=AuthRegisterResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Регистрация нового пользователя"
)
async def register_user(
    request: UserRegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Регистрация нового пользователя.
    
    - Email должен быть уникальным
    - Имя аккаунта не может использоваться другим пользователем
    - Пароль должен содержать минимум 8 символов
    """
    user, token = await AuthService.register(
        session=db,
        email=request.email,
        account_name=request.account_name,
        password=request.password,
    )
    
    return AuthRegisterResponse(
        id=user.id,
        token=token,
        user={
            "id": str(user.id),
            "email": user.email,
            "account_name": user.account_name,
            "profile_photo_url": user.profile_photo_url,
        }
    )


@router.post(
    "/login",
    response_model=AuthLoginResponse,
    summary="Вход в аккаунт"
)
async def login_user(
    request: UserLoginRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Вход в систему.
    
    После успешного входа возвращается JWT токен и информация о пользователе.
    """
    user, token = await AuthService.login(
        session=db,
        email=request.email,
        password=request.password,
    )
    
    return AuthLoginResponse(
        token=token,
        user={
            "id": str(user.id),
            "email": user.email,
            "account_name": user.account_name,
            "profile_photo_url": user.profile_photo_url,
        }
    )


@router.post(
    "/forgot-password",
    response_model=MessageResponse,
    summary="Запрос восстановления пароля"
)
async def forgot_password(
    request: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Запрос сброса пароля.
    
    Если email существует, будет отправлено письмо с инструкциями по восстановлению.
    """
    await AuthService.forgot_password(session=db, email=request.email)
    
    return MessageResponse(
        message="Если такой email существует, на него будет отправлено письмо"
    )
