from datetime import datetime
from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.models.user import User


class UserService:
    """Сервис для управления профилем пользователя."""
    
    MAX_ACCOUNT_NAME_LENGTH = 50
    
    @classmethod
    async def get_current_user(
        cls, session: AsyncSession, user_id: str
    ) -> User:
        """
        Получить текущего пользователя по ID.
        
        Args:
            session: Async SQLAlchemy сессия
            user_id: ID пользователя из токена
            
        Returns:
            Пользователь или None если не найден
        """
        result = await session.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()
    
    @classmethod
    async def update_profile(
        cls, 
        session: AsyncSession, 
        user: User, 
        account_name: Optional[str] = None,
        email: Optional[str] = None,
        profile_photo_url: Optional[str] = None
    ) -> User:
        """
        Обновить профиль пользователя.
        
        Args:
            session: Async SQLAlchemy сессия
            user: Текущий пользователь
            account_name: Новое имя аккаунта (опционально)
            email: Новый email (опционально)
            profile_photo_url: URL аватара (опционально)
            
        Returns:
            Обновленный пользователь
            
        Raises:
            ValidationError: Если данные невалидны
        """
        if account_name is not None and len(account_name) > cls.MAX_ACCOUNT_NAME_LENGTH:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Имя аккаунта не может быть длиннее 50 символов"
            )
        
        # Обновляем данные
        if account_name is not None:
            user.account_name = account_name
        
        if email is not None:
            user.email = email
        
        if profile_photo_url is not None:
            user.profile_photo_url = profile_photo_url
        
        user.updated_at = datetime.now(datetime.UTC)
        
        await session.flush()
        return user
    
    @classmethod
    async def delete_account(
        cls, 
        session: AsyncSession, 
        user: User
    ) -> dict:
        """
        Удалить аккаунт (soft delete).
        
        Args:
            session: Async SQLAlchemy сессия
            user: Пользователь для удаления
            
        Returns:
            Мессаж об успешном удалении
        """
        user.is_active = False
        user.deleted_at = datetime.now(datetime.UTC)
        user.updated_at = datetime.now(datetime.UTC)
        
        await session.flush()
        
        return {"message": "Аккаунт успешно удален"}
