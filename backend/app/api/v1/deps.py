from datetime import datetime
from typing import Annotated, Optional

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.config import settings
from app.core.exceptions import TokenExpiredError


security = HTTPBearer(auto_error=False)


async def validate_token(
    credentials: Annotated[Optional[HTTPAuthorizationCredentials], Depends(security)]
) -> str:
    """Валидация JWT токена из Authorization header."""
    
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Токен не предоставлен",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.algorithm]
        )
        
        # Проверка истечения токена
        if datetime.fromtimestamp(payload.get("exp", 0)) < datetime.utcnow():
            raise TokenExpiredError()
        
        return payload
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Токен истёк. Пожалуйста, войдите снова.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный токен",
            headers={"WWW-Authenticate": "Bearer"},
        )


# Dependency для получения текущего пользователя (будет расширена в репозитории)
async def get_current_user_dependency(
    token_data: Annotated[dict, Depends(validate_token)],
    db: Annotated = None  # Будем добавлять позже
) -> dict:
    """
    Получить данные текущего пользователя из токена.
    
    Args:
        token_data: Декодированные данные токена
        
    Returns:
        dict с данными пользователя (id, email и т.д.)
    """
    return {
        "id": token_data.get("sub"),
        "email": token_data.get("email"),
    }
