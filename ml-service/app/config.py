from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "I2D ML Service"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    yolo_model_path: str = "yolov8n.pt"
    yolo_confidence: float = 0.4
    yolo_iou: float = 0.5
    crop_padding: int = 20

    lm_studio_url: str = "http://127.0.0.1:1234/v1"
    lm_studio_api_key: str = "lm-studio"
    lm_studio_model: str = "qwen/qwen3.5-9b"
    llm_temperature: float = 0.4
    llm_top_p: float = 0.9
    llm_max_tokens: int = 2000

    model_config = {
        "env_file": ".env",
        "extra": "ignore",
    }


@lru_cache
def get_settings() -> Settings:
    return Settings()
