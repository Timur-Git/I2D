from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/users/me", tags=["users"])


@router.get("", response_model=dict)
async def get_current_user():
    return {"id": "user-id", "email": "test@test.com"}


@router.put("", response_model=dict)
async def update_user(request: dict):
    return {"id": "user-id", "email": "updated@test.com"}


@router.delete("")
async def delete_user():
    return {"message": "deleted"}
