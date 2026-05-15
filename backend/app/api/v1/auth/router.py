from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(prefix="/v1", tags=["auth"])


@router.post("/auth/register", status_code=status.HTTP_201_CREATED, response_model=dict)
async def register_user(request: dict):
    return {"id": "user-id", "token": "jwt-token", "user": {"email": "test@test.com"}}


@router.post("/auth/login", response_model=dict)
async def login_user(request: dict):
    return {"token": "jwt-token", "user": {"email": "test@test.com"}}


@router.post("/auth/forgot-password", response_model=dict)
async def forgot_password(request: dict):
    return {"message": "Password reset email sent"}
