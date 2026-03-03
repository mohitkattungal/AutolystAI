"""SQLAlchemy async engine & session factory."""

from sqlalchemy import URL
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings


def _build_db_url() -> str | URL:
    """Build the database URL.

    If DB_USER is set (Supabase), construct a URL object to avoid
    special-character issues in passwords. Otherwise fall back to DATABASE_URL.
    """
    if settings.db_user:
        return URL.create(
            drivername="postgresql+asyncpg",
            username=settings.db_user,
            password=settings.db_password,
            host=settings.db_host,
            port=settings.db_port,
            database=settings.db_name,
        )
    return settings.database_url


engine = create_async_engine(
    _build_db_url(),
    echo=settings.debug,
    pool_size=10,
    max_overflow=20,
    connect_args={"statement_cache_size": 0},  # required for Supabase transaction pooler
)

async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_db() -> AsyncSession:  # type: ignore[misc]
    """Dependency — yields an async database session."""
    async with async_session() as session:
        yield session
