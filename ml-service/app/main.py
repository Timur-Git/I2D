from functools import lru_cache
from typing import Annotated, List, Optional

from fastapi import Depends, FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.schemas import GenerateResponse, GenerationConfig, HealthResponse
from app.services.product_card import ProductCardService


@lru_cache
def get_product_card_service() -> ProductCardService:
    return ProductCardService(get_settings())


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.app_name, debug=settings.debug, version="1.0.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get(f"{settings.api_v1_prefix}/health", response_model=HealthResponse)
    async def health() -> HealthResponse:
        return HealthResponse(status="ok")

    @app.post(f"{settings.api_v1_prefix}/generate", response_model=GenerateResponse)
    async def generate_product_card(
        service: Annotated[ProductCardService, Depends(get_product_card_service)],
        files: Annotated[List[UploadFile], File(...)],
        language: Annotated[str, Form()] = "ru",
        style: Annotated[Optional[str], Form()] = None,
        tone: Annotated[Optional[str], Form()] = None,
    ) -> GenerateResponse:
        file_contents = [await file.read() for file in files]
        config = GenerationConfig(language=language, style=style, tone=tone)
        return await service.generate(file_contents, config)

    return app


app = create_app()
