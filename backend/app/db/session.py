from contextlib import asynccontextmanager
from typing import Generator, AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.core.database import engine, Base


async_session_maker = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False, autocommit=False, autoflush=False
)


@asynccontextmanager
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency для получения асинхронной сессии базы данных."""
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def create_db_and_tables():
    """Асинхронная функция для создания таблиц в БД."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
