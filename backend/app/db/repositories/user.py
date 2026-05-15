from typing import Optional, List
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.user import User


class UserRepository:
    """Репозиторий для работы с пользователями."""
    
    @staticmethod
    async def get_by_id(session: AsyncSession, user_id: str) -> Optional[User]:
        """Получить пользователя по ID."""
        result = await session.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_by_email(session: AsyncSession, email: str) -> Optional[User]:
        """Получить пользователя по email."""
        result = await session.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_by_account_name(session: AsyncSession, account_name: str) -> Optional[User]:
        """Получить пользователя по имени аккаунта."""
        result = await session.execute(select(User).where(User.account_name == account_name))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_by_id_or_email(session: AsyncSession, user_identifier: str) -> Optional[User]:
        """Получить пользователя по ID или email."""
        result = await session.execute(
            select(User).where(
                (User.id == user_identifier) | (User.email == user_identifier)
            )
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_by_token_data(session: AsyncSession, token_data: dict) -> Optional[User]:
        """Получить пользователя по данным из токена."""
        return await session.execute(
            select(User).where(
                User.id == token_data.get("sub")
            )
        ).scalar_one_or_none()
