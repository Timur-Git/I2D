from functools import cached_property
from typing import Any, List
from urllib.parse import quote_plus

from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "I2D Backend"
    debug: bool = False
    port: int = 8000
    host: str = "127.0.0.1"
    api_v1_prefix: str = "/api/v1"

    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str = "i2d_db"
    db_user: str = "postgres"
    db_password: str = "postgres"

    minio_endpoint: str = "localhost:9000"
    minio_access_key: str = "minioadmin"
    minio_secret_key: str = "minioadmin"
    minio_bucket: str = "uploads"
    minio_secure: bool = False
    minio_public_endpoint: str = ""

    secret_key: str = "your-secret-key-change-in-production-must-be-very-long-and-secure"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 30

    # Empty URL keeps generation in local placeholder mode until the ML
    # service is implemented and wired in this repository.
    ml_service_url: str = ""
    ml_service_timeout_seconds: float = 120.0

    allow_origins: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    allow_methods: List[str] = ["*"]
    allow_headers: List[str] = ["*"]

    @field_validator("allow_origins", "allow_methods", "allow_headers", mode="before")
    @classmethod
    def parse_csv_list(cls, value: Any) -> Any:
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value

    @cached_property
    def database_url(self) -> str:
        password = quote_plus(self.db_password)
        return (
            f"postgresql+asyncpg://{self.db_user}:{password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )

    model_config = {
        "env_file": ".env",
        "extra": "ignore",
    }


settings = Settings()
