from fastapi import APIRouter
from app.api.v1 import health
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.uploads import router as uploads_router
from app.api.v1.generate import router as generate_router
from app.api.v1.history import router as history_router

# Основной роутер v1 API
router = APIRouter(prefix="/v1")


@router.get("/health")
def read_root():
    return health.get_health()


# Включение под-роутеров для каждого функционального блока
router.include_router(auth_router)
router.include_router(users_router)
router.include_router(uploads_router)
router.include_router(generate_router)
router.include_router(history_router)
