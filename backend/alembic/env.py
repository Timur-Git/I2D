from alembic import context
from sqlalchemy import engine_from_config, pool

from app.config import settings
from app.core.database import Base
import sys

config = context.config

# Set config file through environment variable or use default
if 'ALEMBIC_CONFIG' in sys.environ:
    config.set_main_option("script_location", sys.environ['ALEMBIC_CONFIG'])

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.

# add your model's MetaData object here for 'autogenerate' support
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def get_url():
    return f"postgresql+asyncpg://postgres:{settings.db_password}@{settings.db_host}:{settings.db_port}/{settings.db_name}"


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = get_url()
    connectable = engine_from_config(
        {"sqlalchemy.url": url},
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata,
            literal_binds=True, dialect_opts={"paramstyle": "named"},
        )

        with context.begin_transaction():
            context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    url = get_url()
    connectable = engine_from_config(
        {"sqlalchemy.url": url},
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
