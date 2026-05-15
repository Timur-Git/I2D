from datetime import datetime
from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

import bcrypt
from sqlalchemy import select

from app.core.base_exceptions import ValidationError, UserNotFoundError
from app.db.models.user import User
from app.db.repositories.user import UserRepository
from app.core.security import create_access_token

# MinIO client import will be handled later when upload service is used


async def auth_service():
    """Service для аутентификации. Будет заменен на полноценный сервис."""
    pass


class AuthService:
    """Сервис для операций аутентификации и управления пользователями."""
    
    MIN_PASSWORD_LENGTH = 8
    
    @classmethod
    async def register(
        cls, session: AsyncSession, email: str, account_name: str, password: str
    ) -> tuple[User, str]:
        """
        Регистрация нового пользователя.
        
        Args:
            session: Async SQLAlchemy сессия
            email: Email пользователя
            account_name: Имя аккаунта
            password: Пароль (минимум MIN_PASSWORD_LENGTH символов)
            
        Returns:
            Кортеж (User, JWT токен)
            
        Raises:
            ValidationError: Если email или account_name уже заняты
        """
        if len(password) < cls.MIN_PASSWORD_LENGTH:
            raise ValidationError(f"Пароль должен содержать минимум {cls.MIN_PASSWORD_LENGTH} символов")
        
        # Проверка на существование email
        result = await session.execute(select(User).where(User.email == email))
        existing_user = result.scalar_one_or_none()
        if existing_user:
            raise ValidationError("Пользователь с таким email уже существует")
        
        # Проверка на существование account_name
        result = await session.execute(select(User).where(User.account_name == account_name))
        existing_name = result.scalar_one_or_none()
        if existing_name:
            raise ValidationError("Аккаунт с таким именем уже существует")
        
        # Хеширование пароля
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Создание пользователя
        user = User(
            email=email,
            account_name=account_name,
            hashed_password=hashed_password,
            is_active=True,
            created_at=datetime.now(datetime.UTC),
            updated_at=datetime.now(datetime.UTC),
        )
        
        session.add(user)
        await session.flush()
        
        # Создание JWT токена
        token = create_access_token(data={"sub": str(user.id), "email": user.email})
        
        return user, token
    
    @classmethod
    async def login(
        cls, session: AsyncSession, email: str, password: str
    ) -> tuple[User, str]:
        """
        Вход в систему.
        
        Args:
            session: Async SQLAlchemy сессия
            email: Email пользователя
            password: Пароль
            
        Returns:
            Кортеж (User, JWT токен)
            
        Raises:
            UserNotFoundError: Если пользователь не найден
        """
        # Поиск пользователя по email
        result = await session.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        
        if not user:
            raise UserNotFoundError(email=email)
        
        # Проверка хеша пароля
        password_bytes = password.encode('utf-8')
        hashed_bytes = user.hashed_password.encode('utf-8') if isinstance(user.hashed_password, bytes) else bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        is_valid = bcrypt.checkpw(password_bytes, hashed_bytes if isinstance(hashed_bytes, bytes) else hashed_bytes)
        
        if not is_valid:
            raise ValidationError("Неверный email или пароль")
        
        # Проверка активности аккаунта
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Аккаунт заблокирован или удален"
            )
        
        # Создание JWT токена
        token = create_access_token(data={"sub": str(user.id), "email": user.email})
        
        return user, token
    
    @classmethod
    async def forgot_password(
        cls, session: AsyncSession, email: str
    ) -> dict:
        """
        Запрос сброса пароля (placeholder).
        В полной версии отправляет email с ссылкой на сброс.
        
        Args:
            session: Async SQLAlchemy сессия
            email: Email пользователя
            
        Returns:
            Мессаж об успешной отправке (или что пользователь не найден)
        """
        # Поиск пользователя
        result = await session.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        
        if not user:
            return {"message": "Если такой email существует, на него будет отправлено письмо"}
        
        # В реальной реализации здесь была бы генерация reset token
        # и отправка email
        
        return {"message": f"Письмо с инструкциями по сбросу пароля отправлено на {email}"}
