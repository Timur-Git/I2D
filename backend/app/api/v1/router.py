from fastapi import APIRouter
from app.api.v1 import health

from app.api.v1.auth.router import router as auth_router
from app.api.v1.users.router import router as users_router
from app.api.v1.uploads.router import router as uploads_router
from app.api.v1.generate.router import router as generate_router
from app.api.v1.history.router import router as history_router

router = APIRouter(prefix="/v1")


@router.get("/health")
def read_root():
    return health.get_health()


# Include all sub-routers
router.include_router(auth_router)
router.include_router(users_router)
router.include_router(uploads_router)
router.include_router(generate_router)
router.include_router(history_router)
