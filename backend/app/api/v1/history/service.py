from datetime import date, datetime, timedelta
from typing import List, Optional, Literal, Tuple
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, and_
from sqlalchemy.dialects.postgresql import JSON

from app.core.base_exceptions import ItemNotFoundError
from app.db.models.history import GenerationHistory


class HistoryService:
    """Сервис для управления историей генераций."""
    
    @classmethod
    async def get_history(
        cls,
        session: AsyncSession,
        user_id: str,
        page: int = 1,
        limit: int = 20,
        search_query: Optional[str] = None,
        selected_date: Optional[date] = None,
        sort_by_date: Literal["asc", "desc"] = "desc"
    ) -> Tuple[List[GenerationHistory], int]:
        """
        Получить страницу истории пользователя.
        
        Args:
            session: Async SQLAlchemy сессия
            user_id: ID владельца истории
            page: Номер страницы (1-based)
            limit: Количество записей на странице
            search_query: Строка поиска по title/description
            selected_date: Дата фильтрации (полный день)
            sort_by_date: Порядок сортировки (asc/desc)
            
        Returns:
            Кортеж (список HistoryItem, общее_количество)
        """
        # Базовый запрос
        query = select(GenerationHistory).where(GenerationHistory.user_id == user_id)
        
        # Поиск по названию или описанию
        if search_query:
            search_pattern = f"%{search_query}%"
            query = query.where(
                or_(
                    GenerationHistory.title.ilike(search_pattern),
                    GenerationHistory.description.ilike(search_pattern)
                )
            )
        
        # Фильтрация по дате
        if selected_date:
            start_of_day = datetime.combine(selected_date, datetime.min.time())
            end_of_day = start_of_day + timedelta(days=1)
            
            query = query.where(
                and_(
                    GenerationHistory.created_at >= start_of_day,
                    GenerationHistory.created_at < end_of_day
                )
            )
        
        # Получить общее количество
        total_query = select(func.count()).select_from(query.subquery())
        total_result = await session.execute(total_query)
        total = total_result.scalar() or 0
        
        # Пагинация
        offset = (page - 1) * limit
        
        if sort_by_date == "desc":
            query = query.order_by(GenerationHistory.created_at.desc())
        else:
            query = query.order_by(GenerationHistory.created_at.asc())
        
        result = await session.execute(query.offset(offset).limit(limit))
        items = result.scalars().all()
        
        return list(items), total
    
    @classmethod
    async def create_or_update_item(
        cls,
        session: AsyncSession,
        user_id: str,
        image_url: str,
        title: str,
        description: str,
        is_edited: Optional[bool] = None
    ) -> GenerationHistory:
        """
        Создать новую запись или обновить существующую.
        
        Args:
            session: Async SQLAlchemy сессия
            user_id: ID владельца
            image_url: URL изображения
            title: Заголовок
            description: Описание
            is_edited: Флаг редактирования (опционально)
            
        Returns:
            Созданная или обновленная запись
            
        Raises:
            HTTPException: Если данные невалидны
        """
        if not title or len(title.strip()) == 0:
            raise HTTPException(status_code=400, detail="Заголовок обязателен")
        
        if not description or len(description.strip()) == 0:
            raise HTTPException(status_code=400, detail="Описание обязателен")
        
        now = datetime.now(datetime.UTC)
        
        # Проверка на существование существующей записи
        existing_result = await session.execute(
            select(GenerationHistory).where(
                and_(
                    GenerationHistory.user_id == user_id,
                    GenerationHistory.image_url == image_url
                )
            )
        )
        existing_item = existing_result.scalar_one_or_none()
        
        if existing_item:
            # Обновление существующей записи
            existing_item.title = title
            existing_item.description = description
            existing_item.modified_at = now
            
            if is_edited is not None:
                existing_item.is_edited = is_edited
            
            await session.flush()
            return existing_item
        
        # Создание новой записи
        new_item = GenerationHistory(
            user_id=user_id,
            image_url=image_url,
            title=title,
            description=description,
            created_at=now,
            modified_at=now,
            is_edited=is_edited if is_edited is not None else False,
        )
        
        session.add(new_item)
        await session.flush()
        
        return new_item
    
    @classmethod
    async def get_item(
        cls,
        session: AsyncSession,
        item_id: str
    ) -> Optional[GenerationHistory]:
        """Получить запись истории по ID."""
        result = await session.execute(select(GenerationHistory).where(GenerationHistory.id == item_id))
        return result.scalar_one_or_none()
    
    @classmethod
    async def delete_item(
        cls,
        session: AsyncSession,
        user_id: str,
        item_id: str
    ) -> bool:
        """Удалить запись из истории (soft delete)."""
        result = await session.execute(select(GenerationHistory).where(
            and_(
                GenerationHistory.id == item_id,
                GenerationHistory.user_id == user_id
            )
        ))
        item = result.scalar_one_or_none()
        
        if not item:
            raise ItemNotFoundError(f"Запись {item_id} не найдена")
        
        # Soft delete - помечаем как отредактированную
        item.is_edited = True
        item.modified_at = datetime.now(datetime.UTC)
        await session.flush()
        
        return True
    
    @classmethod
    async def update_item(
        cls,
        session: AsyncSession,
        user_id: str,
        item_id: str,
        title: Optional[str] = None,
        description: Optional[str] = None
    ) -> GenerationHistory:
        """Редактировать сохраненную запись."""
        result = await session.execute(select(GenerationHistory).where(
            and_(
                GenerationHistory.id == item_id,
                GenerationHistory.user_id == user_id
            )
        ))
        item = result.scalar_one_or_none()
        
        if not item:
            raise ItemNotFoundError(f"Запись {item_id} не найдена")
        
        now = datetime.now(datetime.UTC)
        
        if title is not None:
            item.title = title
        
        if description is not None:
            item.description = description
        
        item.is_edited = True
        item.modified_at = now
        
        await session.flush()
        return item
    
    @classmethod
    async def clear_all_history(
        cls,
        session: AsyncSession,
        user_id: str
    ) -> dict:
        """Очистить всю историю пользователя (soft delete)."""
        # Soft delete всех записей
        await session.execute(
            update(GenerationHistory)
            .where(GenerationHistory.user_id == user_id)
            .values(
                is_edited=True,
                modified_at=datetime.now(datetime.UTC)
            )
        )
        
        await session.flush()
        
        return {"message": "История успешно очищена"}
