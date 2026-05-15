from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.base_exceptions import (
    I2DException,
    AuthenticationError,
    AuthorizationError,
    TokenExpiredError,
    ValidationError,
    ItemNotFoundError,
)


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Глобальный обработчик исключений."""
    
    # Handle Starlette HTTP exceptions
    if isinstance(exc, StarletteHTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.detail},
        )
    
    # Handle our custom exceptions
    if isinstance(exc, I2DException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": str(exc.message)}
        )
    
    # Handle JWT errors specifically
    if hasattr(exc, 'reason'):
        reason = exc.reason.lower()
        if 'expired' in reason or 'exp' in reason:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"error": "Токен истёк"}
            )
        elif 'invalid' in reason or ' Signature' in str(exc):
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"error": "Неверный токен"}
            )
    
    # Handle asyncpg errors (database connection issues)
    if hasattr(exc, 'original_exception'):
        orig = exc.original_exception
        if hasattr(orig, 'diagnostics'):
            print(f"Database error: {orig}")
    
    # Log and return 500 for unknown errors
    import logging
    logger = logging.getLogger("uvicorn")
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "Внутренняя ошибка сервера"}
    )
