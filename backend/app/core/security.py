import secrets
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError

from app.config import settings


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Создать JWT токен."""
    to_encode = data.copy()
    
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
    to_encode.update({"exp": expire})
    
    return jwt.encode(
        to_encode, 
        settings.secret_key, 
        algorithm=settings.algorithm
    )


def decode_access_token(token: str) -> Optional[dict]:
    """Декодировать JWT токен и вернуть payload."""
    try:
        payload = jwt.decode(
            token, 
            settings.secret_key, 
            algorithms=[settings.algorithm]
        )
        return payload
    except JWTError:
        return None


def hash_password(password: str) -> str:
    """Хешировать пароль с помощью bcrypt."""
    import bcrypt
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверить пароль против хеша."""
    import bcrypt
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    
    return bcrypt.checkpw(password_bytes, hashed_bytes)


def get_password_hash(password: str) -> str:
    """Альтернативная функция для хеширования (экспонирована для удобства)."""
    return hash_password(password)
