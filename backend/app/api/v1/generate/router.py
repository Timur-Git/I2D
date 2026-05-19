from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.v1.deps import DbSession, get_current_user
from app.api.v1.generate.service import AIService
from app.db.models.user import User
from app.schemas.generate import GenerateRequest, GenerateResponse


router = APIRouter(prefix="/generate", tags=["generate"])


@router.post("", response_model=GenerateResponse)
async def generate_description(
    request: GenerateRequest,
    db: DbSession,
    current_user: Annotated[User, Depends(get_current_user)],
):
    return await AIService.generate_title_description(
        db,
        current_user,
        upload_ids=request.upload_ids,
        config=request.config,
    )
