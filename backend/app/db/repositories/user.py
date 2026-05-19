from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.user import User


def _as_uuid(value: str | UUID) -> UUID:
    return value if isinstance(value, UUID) else UUID(str(value))


class UserRepository:
    @staticmethod
    async def get_by_id(session: AsyncSession, user_id: str | UUID) -> Optional[User]:
        result = await session.execute(select(User).where(User.id == _as_uuid(user_id)))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_active_by_id(session: AsyncSession, user_id: str | UUID) -> Optional[User]:
        result = await session.execute(
            select(User).where(
                User.id == _as_uuid(user_id),
                User.is_active.is_(True),
                User.deleted_at.is_(None),
            )
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_email(session: AsyncSession, email: str) -> Optional[User]:
        result = await session.execute(select(User).where(User.email == email.lower()))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_active_by_email(session: AsyncSession, email: str) -> Optional[User]:
        result = await session.execute(
            select(User).where(
                User.email == email.lower(),
                User.is_active.is_(True),
                User.deleted_at.is_(None),
            )
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_account_name(session: AsyncSession, account_name: str) -> Optional[User]:
        result = await session.execute(select(User).where(User.account_name == account_name))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_token_data(session: AsyncSession, token_data: dict) -> Optional[User]:
        subject = token_data.get("sub")
        if not subject:
            return None
        try:
            return await UserRepository.get_active_by_id(session, subject)
        except ValueError:
            return None
