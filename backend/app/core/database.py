from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import declarative_base

from app.config import settings


engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

Base = declarative_base()
metadata = Base.metadata


def get_url() -> str:
    return settings.database_url


async def init_db() -> None:
    """Create tables from metadata. Prefer Alembic outside local bootstrap."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db() -> None:
    await engine.dispose()
