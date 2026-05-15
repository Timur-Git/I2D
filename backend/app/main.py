from fastapi import FastAPI
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.v1.router import router as v1_router
from app.api.v1.exceptions import global_exception_handler
from app.config import settings


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version="1.0.0",
        debug=settings.debug,
    )
    
    # Register global exception handler
    app.add_exception_handler(Exception, global_exception_handler)
    app.add_exception_handler(StarletteHTTPException, global_exception_handler)
    
    # Include v1 router
    app.include_router(v1_router)
    
    return app


app = create_app()
