from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import get_current_user_dependency
from app.schemas.generate import (
    GenerateRequest,
    GenerateResponse,
)
from app.db.models.user import UserRepository  # Будет использоваться позже
from app.api.v1.generate.service import AIService

router = APIRouter(prefix="/generate", tags=["Генерация описаний (AI)"])


@router.post(
    "/generate",
    response_model=GenerateResponse,
    summary="Сгенерировать заголовок и описание по фото",
    responses={
        200: {"description": "Генерация успешна"},
        401: {"description": "Отсутствует авторизация"}
    }
)
async def generate_description(
    request: GenerateRequest,
    current_user = Depends(get_current_user_dependency),
):
    """
    Сгенерировать заголовок и описание товара на основе загруженного фото.
    
    - Требуется авторизация (JWT токен в Authorization header)
    - image_url должен указывать на существующее изображение в хранилище
    - Возвращает title и description на выбранном языке (по умолчанию русский)
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Требуется авторизация"
        )
    
    # В реальном приложении будет использоваться сессия БД для сохранения результата в историю
    result = await AIService.generate_title_description(
        session=None,  # Будет передана через Depends(get_db)
        image_url=request.image_url,
    )
    
    return GenerateResponse(
        title=result.title,
        description=result.description,
    )
