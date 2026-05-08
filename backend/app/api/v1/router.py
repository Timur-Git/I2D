from fastapi import APIRouter

from app.api.v1 import health


router = APIRouter(prefix="/v1")


@router.get("/health")
def read_root():
    return health.get_health()
