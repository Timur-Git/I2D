from datetime import date
from typing import Annotated, Literal, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from app.api.v1.deps import DbSession, get_current_user
from app.api.v1.history.service import HistoryService
from app.db.models.user import User
from app.schemas.history import (
    HistoryClearResponse,
    HistoryCreateRequest,
    HistoryItemResponse,
    HistoryPaginationResponse,
    HistoryUpdateRequest,
)


router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=HistoryPaginationResponse)
async def get_history(
    db: DbSession,
    current_user: Annotated[User, Depends(get_current_user)],
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search_query: Optional[str] = Query(None, min_length=1, max_length=100),
    selected_date: Optional[date] = None,
    sort_by_date: Literal["asc", "desc"] = "desc",
):
    items, total = await HistoryService.get_history(
        db,
        current_user,
        page=page,
        limit=limit,
        search_query=search_query,
        selected_date=selected_date,
        sort_by_date=sort_by_date,
    )
    return HistoryPaginationResponse(
        data=items,
        total=total,
        page=page,
        limit=limit,
        total_pages=(total + limit - 1) // limit,
    )


@router.post("", response_model=HistoryItemResponse, status_code=status.HTTP_201_CREATED)
async def create_history_item(
    request: HistoryCreateRequest,
    db: DbSession,
    current_user: Annotated[User, Depends(get_current_user)],
):
    return await HistoryService.create_item(
        db,
        current_user,
        image_url=request.image_url,
        title=request.title,
        description=request.description,
    )


@router.delete("/clear", response_model=HistoryClearResponse)
async def clear_all_history(
    db: DbSession,
    current_user: Annotated[User, Depends(get_current_user)],
):
    return await HistoryService.clear_all_history(db, current_user)


@router.put("/{item_id}/edit", response_model=HistoryItemResponse)
async def edit_history_item(
    item_id: UUID,
    request: HistoryUpdateRequest,
    db: DbSession,
    current_user: Annotated[User, Depends(get_current_user)],
):
    return await HistoryService.update_item(
        db,
        current_user,
        item_id,
        title=request.title,
        description=request.description,
    )


@router.delete("/{item_id}")
async def delete_history_item(
    item_id: UUID,
    db: DbSession,
    current_user: Annotated[User, Depends(get_current_user)],
):
    return await HistoryService.delete_item(db, current_user, item_id)
