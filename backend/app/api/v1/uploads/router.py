from fastapi import APIRouter, UploadFile, File

router = APIRouter(prefix="/v1", tags=["uploads"])


@router.post("/uploads/photo", response_model=dict)
async def upload_photo(file: UploadFile = File(...)):
    return {"id": "file-id", "url": f"http://storage/uploads/{file.filename}", "size": 0, "type": "image/jpeg"}


@router.delete("/uploads/{file_id}")
async def delete_photo(file_id: str):
    return {"message": "Photo successfully deleted"}


@router.get("/uploads/{file_id}", response_model=dict)
async def get_file_info(file_id: str):
    return {"id": file_id, "url": f"http://storage/uploads/{file_id}", "size": 0, "type": "image/jpeg"}
