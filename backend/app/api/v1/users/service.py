from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.user import User
from app.db.repositories.user import UserRepository


class UserService:
    @classmethod
    async def update_profile(
        cls,
        session: AsyncSession,
        user: User,
        account_name: Optional[str] = None,
        email: Optional[str] = None,
        profile_photo_url: Optional[str] = None,
    ) -> User:
        if account_name is not None:
            account_name = account_name.strip()
            existing = await UserRepository.get_by_account_name(session, account_name)
            if existing and existing.id != user.id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Account name is already taken",
                )
            user.account_name = account_name

        if email is not None:
            email = email.lower()
            existing = await UserRepository.get_by_email(session, email)
            if existing and existing.id != user.id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="User with this email already exists",
                )
            user.email = email

        if profile_photo_url is not None:
            user.profile_photo_url = profile_photo_url

        user.updated_at = datetime.now(timezone.utc)

        try:
            await session.flush()
        except IntegrityError as exc:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this email or account name already exists",
            ) from exc

        return user

    @classmethod
    async def delete_account(cls, session: AsyncSession, user: User) -> dict:
        now = datetime.now(timezone.utc)
        user.is_active = False
        user.deleted_at = now
        user.updated_at = now
        await session.flush()
        return {"message": "Account deleted successfully"}
