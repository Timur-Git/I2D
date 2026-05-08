from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "I2D Backend"
    debug: bool = True
    port: int = 8000
    host: str = "127.0.0.1"

    model_config = {
        "env_file": ".env",
        "extra": "ignore",
    }


settings = Settings()
