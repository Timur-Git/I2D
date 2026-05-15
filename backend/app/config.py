from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Application settings
    app_name: str = "I2D Backend"
    debug: bool = False
    port: int = 8000
    host: str = "127.0.0.1"

    # PostgreSQL settings
    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str = "i2d_db"
    db_user: str = "postgres"
    db_password: str = "postgres"

    # MinIO object storage settings
    minio_endpoint: str = "localhost:9000"
    minio_access_key: str = "minioadmin"
    minio_secret_key: str = "minioadmin"
    minio_bucket: str = "uploads"
    
    minio_secure: bool = False  # Set to True if using HTTPS

    # JWT settings
    secret_key: str = "your-secret-key-change-in-production-must-be-very-long-and-secure"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # CORS settings
    allow_origins: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    allow_methods: List[str] = ["*"]
    allow_headers: List[str] = ["*"]

    model_config = {
        "env_file": ".env",
        "extra": "ignore",
    }


settings = Settings()
