from typing import Annotated, List
from uuid import UUID

from fastapi import APIRouter, Depends, File, UploadFile

from app.api.v1.deps import DbSession, get_current_user
from app.api.v1.uploads.service import UploadService
from app.db.models.user import User
from app.schemas.upload import FileInfoResponse, FileUploadBatchResponse, FileUploadResponse


router = APIRouter(prefix="/uploads", tags=["uploads"])


@router.post("/photo", response_model=FileUploadResponse)
async def upload_photo(
    db: DbSession,
    current_user: Annotated[User, Depends(get_current_user)],
    file: UploadFile = File(...),
):
    return await UploadService.upload_photo(db, current_user, file)


@router.post("/photos", response_model=FileUploadBatchResponse)
async def upload_photos(
    db: DbSession,
    current_user: Annotated[User, Depends(get_current_user)],
    files: List[UploadFile] = File(...),
):
    uploaded = await UploadService.upload_photos(db, current_user, files)
    return FileUploadBatchResponse(files=uploaded)


@router.get("/{file_id}", response_model=FileInfoResponse)
async def get_file_info(
    file_id: UUID,
    db: DbSession,
    current_user: Annotated[User, Depends(get_current_user)],
):
    return await UploadService.get_file_info(db, current_user, file_id)


@router.delete("/{file_id}")
async def delete_photo(
    file_id: UUID,
    db: DbSession,
    current_user: Annotated[User, Depends(get_current_user)],
):
    return await UploadService.delete_photo(db, current_user, file_id)
