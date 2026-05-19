from datetime import date, datetime, timedelta, timezone
from typing import List, Literal, Optional, Tuple
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import and_, delete, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.history import GenerationHistory
from app.db.models.user import User


class HistoryService:
    @classmethod
    async def get_history(
        cls,
        session: AsyncSession,
        user: User,
        page: int = 1,
        limit: int = 20,
        search_query: Optional[str] = None,
        selected_date: Optional[date] = None,
        sort_by_date: Literal["asc", "desc"] = "desc",
    ) -> Tuple[List[GenerationHistory], int]:
        query = select(GenerationHistory).where(GenerationHistory.user_id == user.id)

        if search_query:
            search_pattern = f"%{search_query}%"
            query = query.where(
                or_(
                    GenerationHistory.title.ilike(search_pattern),
                    GenerationHistory.description.ilike(search_pattern),
                )
            )

        if selected_date:
            start_of_day = datetime.combine(selected_date, datetime.min.time(), tzinfo=timezone.utc)
            end_of_day = start_of_day + timedelta(days=1)
            query = query.where(
                and_(
                    GenerationHistory.created_at >= start_of_day,
                    GenerationHistory.created_at < end_of_day,
                )
            )

        total_result = await session.execute(select(func.count()).select_from(query.subquery()))
        total = total_result.scalar_one()

        order_column = GenerationHistory.created_at.desc()
        if sort_by_date == "asc":
            order_column = GenerationHistory.created_at.asc()

        offset = (page - 1) * limit
        result = await session.execute(query.order_by(order_column).offset(offset).limit(limit))
        return list(result.scalars().all()), total

    @classmethod
    async def create_item(
        cls,
        session: AsyncSession,
        user: User,
        image_url: str,
        title: str,
        description: str,
        is_edited: bool = False,
    ) -> GenerationHistory:
        item = GenerationHistory(
            user_id=user.id,
            image_url=image_url,
            title=title.strip(),
            description=description.strip(),
            is_edited=is_edited,
        )
        session.add(item)
        await session.flush()
        return item

    @classmethod
    async def get_item(
        cls,
        session: AsyncSession,
        user: User,
        item_id: UUID,
    ) -> GenerationHistory:
        result = await session.execute(
            select(GenerationHistory).where(
                GenerationHistory.id == item_id,
                GenerationHistory.user_id == user.id,
            )
        )
        item = result.scalar_one_or_none()
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="History item not found")
        return item

    @classmethod
    async def update_item(
        cls,
        session: AsyncSession,
        user: User,
        item_id: UUID,
        title: Optional[str] = None,
        description: Optional[str] = None,
    ) -> GenerationHistory:
        item = await cls.get_item(session, user, item_id)
        if title is not None:
            item.title = title.strip()
        if description is not None:
            item.description = description.strip()

        item.is_edited = True
        item.modified_at = datetime.now(timezone.utc)
        await session.flush()
        return item

    @classmethod
    async def delete_item(cls, session: AsyncSession, user: User, item_id: UUID) -> dict:
        item = await cls.get_item(session, user, item_id)
        await session.delete(item)
        await session.flush()
        return {"message": "Item deleted"}

    @classmethod
    async def clear_all_history(cls, session: AsyncSession, user: User) -> dict:
        await session.execute(delete(GenerationHistory).where(GenerationHistory.user_id == user.id))
        await session.flush()
        return {"message": "History cleared"}
