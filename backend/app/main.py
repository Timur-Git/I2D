from fastapi import FastAPI

from app.api.v1.router import router as v1_router
from app.config import settings


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        debug=settings.debug,
    )

    app.include_router(v1_router)

    return app


app = create_app()
