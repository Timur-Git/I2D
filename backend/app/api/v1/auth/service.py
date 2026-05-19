from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    hash_password,
    verify_password,
)
from app.db.models.user import User
from app.db.repositories.user import UserRepository


class AuthService:
    MIN_PASSWORD_LENGTH = 8
    MAX_BCRYPT_PASSWORD_BYTES = 72

    @classmethod
    def _validate_password(cls, password: str) -> None:
        if len(password) < cls.MIN_PASSWORD_LENGTH:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Password must contain at least {cls.MIN_PASSWORD_LENGTH} characters",
            )
        if len(password.encode("utf-8")) > cls.MAX_BCRYPT_PASSWORD_BYTES:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Password is too long for bcrypt hashing",
            )

    @staticmethod
    def _token_subject(user: User) -> dict:
        return {"sub": str(user.id), "email": user.email}

    @classmethod
    def create_token_pair(cls, user: User) -> dict:
        payload = cls._token_subject(user)
        return {
            "access_token": create_access_token(payload),
            "refresh_token": create_refresh_token(payload),
            "token_type": "bearer",
            "expires_in": settings.access_token_expire_minutes * 60,
        }

    @classmethod
    async def register(
        cls,
        session: AsyncSession,
        email: str,
        account_name: str,
        password: str,
    ) -> tuple[User, dict]:
        email = email.lower()
        account_name = account_name.strip()
        cls._validate_password(password)

        if await UserRepository.get_by_email(session, email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this email already exists",
            )
        if await UserRepository.get_by_account_name(session, account_name):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Account name is already taken",
            )

        user = User(
            email=email,
            account_name=account_name,
            hashed_password=hash_password(password),
            is_active=True,
        )
        session.add(user)

        try:
            await session.flush()
        except IntegrityError as exc:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this email or account name already exists",
            ) from exc

        return user, cls.create_token_pair(user)

    @classmethod
    async def login(cls, session: AsyncSession, email: str, password: str) -> tuple[User, dict]:
        user = await UserRepository.get_active_by_email(session, email.lower())
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user, cls.create_token_pair(user)

    @classmethod
    async def refresh(cls, session: AsyncSession, refresh_token: str) -> tuple[User, dict]:
        payload = decode_refresh_token(refresh_token)
        if not payload or not payload.get("sub"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user = await UserRepository.get_by_token_data(session, payload)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User is inactive or no longer exists",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user, cls.create_token_pair(user)

    @classmethod
    async def change_password(
        cls,
        session: AsyncSession,
        user: User,
        current_password: str,
        new_password: str,
    ) -> None:
        cls._validate_password(new_password)

        if not verify_password(current_password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect",
            )

        user.hashed_password = hash_password(new_password)
        await session.flush()

    @classmethod
    async def forgot_password(cls, session: AsyncSession, email: str) -> dict:
        # Keep the response generic to avoid email enumeration. A real mailer/reset
        # token flow can be added when the product flow is ready.
        await UserRepository.get_by_email(session, email.lower())
        return {"message": "If this email exists, password reset instructions will be sent"}
