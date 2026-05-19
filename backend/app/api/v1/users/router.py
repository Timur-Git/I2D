from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.v1.deps import DbSession, get_current_user
from app.api.v1.users.service import UserService
from app.db.models.user import User
from app.schemas.user import AccountDeleteResponse, UserResponse, UserUpdateRequest


router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: Annotated[User, Depends(get_current_user)]
):
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_user(
    request: UserUpdateRequest,
    db: DbSession,
    current_user: Annotated[User, Depends(get_current_user)],
):
    return await UserService.update_profile(
        db,
        current_user,
        account_name=request.account_name,
        email=str(request.email) if request.email else None,
        profile_photo_url=request.profile_photo_url,
    )


@router.delete("/me", response_model=AccountDeleteResponse)
async def delete_user(
    db: DbSession,
    current_user: Annotated[User, Depends(get_current_user)],
):
    return await UserService.delete_account(db, current_user)
