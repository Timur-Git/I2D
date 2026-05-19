from datetime import date, datetime
from typing import List, Literal, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class HistoryItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    image_url: str
    title: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    is_edited: bool = False
    created_at: datetime
    modified_at: datetime


class HistoryCreateRequest(BaseModel):
    image_url: str = Field(..., max_length=1000)
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=5000)


class HistoryUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1, max_length=5000)


class HistoryPaginationResponse(BaseModel):
    data: List[HistoryItemResponse]
    total: int
    page: int
    limit: int
    total_pages: int


class HistoryClearResponse(BaseModel):
    message: str


class SearchFilter(BaseModel):
    search_query: Optional[str] = Field(None, min_length=1, max_length=100)
    selected_date: Optional[date] = None
    sort_by_date: Optional[Literal["asc", "desc"]] = "desc"
