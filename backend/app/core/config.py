"""AutolystAI Backend — Configuration via environment variables."""

from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── App ──
    app_name: str = "AutolystAI"
    debug: bool = False

    # ── Database (Supabase Postgres) ──
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/autolyst"
    db_user: str = ""
    db_password: str = ""
    db_host: str = ""
    db_port: int = 6543
    db_name: str = "postgres"

    # ── Auth (custom JWT) ──
    secret_key: str = "change-me-in-production-use-a-long-random-string"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours

    # ── OpenAI ──
    openai_api_key: str = ""

    # ── Redis ──
    redis_url: str = "redis://localhost:6379/0"

    # ── File uploads ──
    upload_dir: Path = Path("./uploads")
    max_upload_mb: int = 50

    # ── CORS ──
    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
