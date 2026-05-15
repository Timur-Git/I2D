from fastapi import APIRouter, Depends, HTTPException, status, Query, Header
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated, Optional, Literal

from app.api.v1.deps import get_current_user_dependency
from app.schemas.history import (
    HistoryItemResponse,
    HistoryPaginationResponse,
    HistoryCreateRequest,
    HistoryUpdateRequest,
    SearchFilter,
    HistoryClearResponse,
)
from app.db.models.user import UserRepository
from app.api.v1.history.service import HistoryService

router = APIRouter(prefix="/history", tags=["История генераций"])


@router.get(
    response_model=HistoryPaginationResponse,
    summary="Получить историю пользователя",
    responses={
        200: {"description": "Список историй с пагинацией"}
    }
)
async def get_history(
    page: int = Query(1, ge=1, description="Номер страницы (начинается с 1)"),
    limit: int = Query(20, ge=1, le=100, description="Количество записей на странице"),
    search_query: Optional[str] = Query(None, min_length=1, max_length=100, description="Поиск по названию или описанию"),
    selected_date: Optional[Literal["current", "all"]] = Query(None, description="Фильтр по дате"),
    sort_by_date: Literal["asc", "desc"] = Query("desc", description="Порядок сортировки"),
    authorization: str | None = Header(None),
):
    """
    Получить страницу истории генераций пользователя.
    
    - Поддерживает поиск по title/description
    - Фильтрация по дате (по умолчанию текущая)
    - Пагинация с указанным limit/offset
    - Сортировка по дате создания (desc по умолчанию)
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Требуется авторизация"
        )
    
    # Фильтр по дате
    selected_date = None  # Будет реализовано через datetime
    
    items, total = await HistoryService.get_history(
        session=None,  # Будет получена через Depends(get_db)
        user_id="current-user-id",  # Из токена
        page=page,
        limit=limit,
        search_query=search_query,
        selected_date=selected_date,
        sort_by_date=sort_by_date,
    )
    
    total_pages = (total + limit - 1) // limit if total > 0 else 1
    
    return HistoryPaginationResponse(
        data=[item.__dict__ for item in items],  # TODO: использовать модели
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages,
    )


@router.post(
    response_model=HistoryItemResponse,
    summary="Сохранить/обновить результат генерации",
    status_code=status.HTTP_201_CREATED,
    responses={
        201: {"description": "Запись успешно сохранена"},
        409: {"description": "Дубликат уже существует"}
    }
)
async def create_or_update_history_item(
    request: HistoryCreateRequest,
    authorization: str | None = Header(None),
):
    """
    Сохранить или обновить результат генерации.
    
    - Если запись с таким image_url уже существует для этого пользователя, она будет обновлена
    - Иначе создаётся новая запись
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Требуется авторизация"
        )
    
    # В реальном приложении user_id будет получаться из токена
    
    item = await HistoryService.create_or_update_item(
        session=None,  # Depends(get_db)
        user_id="current-user-id",  # Из токена
        image_url=request.image_url,
        title=request.title,
        description=request.description,
    )
    
    return HistoryItemResponse(
        id=item.id,
        user_id=item.user_id,
        image_url=item.image_url,
        title=item.title,
        description=item.description,
        is_edited=item.is_edited,
        created_at=item.created_at,
        modified_at=item.modified_at,
    )


@router.delete(
    "/{item_id}",
    summary="Удалить из истории",
    responses={
        200: {"description": "Запись успешно удалена"}
    }
)
async def delete_history_item(
    item_id: str,
    authorization: str | None = Header(None),
):
    """Удалить запись из истории (soft delete)."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Требуется авторизация"
        )
    
    # В реальном user_id будет из токена
    
    await HistoryService.delete_item(
        session=None,  # Depends(get_db)
        user_id="current-user-id",
        item_id=item_id,
    )
    
    return {"message": "Запись успешно удалена"}


@router.put(
    "/{item_id}/edit",
    response_model=HistoryItemResponse,
    summary="Редактировать сохраненный результат"
)
async def edit_history_item(
    item_id: str,
    request: HistoryUpdateRequest,
    authorization: str | None = Header(None),
):
    """Редактировать title/description в сохранённой записи."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Требуется авторизация"
        )
    
    item = await HistoryService.update_item(
        session=None,  # Depends(get_db)
        user_id="current-user-id",
        item_id=item_id,
        title=request.title,
        description=request.description,
    )
    
    return HistoryItemResponse(
        id=item.id,
        user_id=item.user_id,
        image_url=item.image_url,
        title=item.title,
        description=item.description,
        is_edited=item.is_edited,
        created_at=item.created_at,
        modified_at=item.modified_at,
    )


@router.delete(
    "/clear",
    summary="Очистить всю историю",
    responses={
        200: {"description": "История успешно очищена"}
    }
)
async def clear_all_history(
    authorization: str | None = Header(None),
):
    """Очистить всю историю пользователя (soft delete)."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Требуется авторизация"
        )
    
    result = await HistoryService.clear_all_history(
        session=None,  # Depends(get_db)
        user_id="current-user-id",
    )
    
    return HistoryClearResponse(**result)
