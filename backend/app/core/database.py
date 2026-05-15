from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

from app.config import settings

# Асинхронный Engine для PostgreSQL
DATABASE_URL = f"postgresql+asyncpg://postgres:{settings.db_password}@{settings.db_host}:{settings.db_port}/{settings.db_name}"
engine = create_async_engine(
    DATABASE_URL,
    echo=settings.debug,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

# Базовый класс для ORM моделей
Base = declarative_base()
metadata = Base.metadata


def get_url():
    """Возвращает строковое представление URL базы данных."""
    return DATABASE_URL


async def init_db():
    """Инициализирует метаданные в базе данных (создаст таблицы)."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db():
    """Закрывает соединение с базой данных."""
    await engine.dispose()
