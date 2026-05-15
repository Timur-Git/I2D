# I2D Backend — API Документация и Архитектура

## 🏗️ Архитектурная структура

```
app/
├── core/                    # Ядро приложения
│   ├── database.py          # Async DB engine, Base metadata
│   ├── security.py          # JWT токены, bcrypt хеширование
│   └── exceptions.py        # Кастомные исключения
│
├── db/                      # ORM слой (SQLAlchemy + asyncpg)
│   ├── models/             # SQLAlchemy модели
│   │   ├── user.py         # User модель
│   │   ├── upload.py       # FileUpload модель
│   │   └── history.py      # GenerationHistory модель
│   ├── repositories/       # Repository pattern
│   │   └── user.py         # UserRepository методы
│   └── session.py          # Async session management
│
├── storage/                 # Объектное хранилище MinIO
│   ├── client.py           # MinIO client (boto3)
│   └── service.py          # UploadService для работы с файлами
│
├── schemas/                 # Pydantic валидация
│   ├── auth.py             # Аутентификация запросы/ответы
│   ├── user.py             # Пользовательские операции
│   ├── upload.py           # Загрузка изображений
│   ├── generate.py         # AI генерация
│   └── history.py          # История с пагинацией
│
├── ai/                      # AI сервис
│   └── service.py          # Интеграция с LLM
│
├── api/v1/                  # API v1 маршруты
│   ├── auth/               # Аутентификация endpoints
│   │   ├── router.py       # POST /register, /login, /forgot-password
│   │   └── service.py      # Бизнес-логика аутенфикации
│   ├── users/              # Управление профилем
│   │   ├── router.py       # GET/PUT/DELETE /me
│   │   └── service.py
│   ├── uploads/            # Загрузка файлов
│   │   ├── router.py       # POST/upload, DELETE/{id}, GET/{id}
│   │   └── service.py
│   ├── generate/           # AI генерация
│   │   ├── router.py       # POST /generate
│   │   └── service.py
│   └── history/            # История генераций
│       ├── router.py       # CRUD /history/*
│       └── service.py
│
├── deps.py                  # Dependency injection для токенов
```

---

## 📊 Модели данных (Database Models)

### User (`app/db/models/user.py`)

```python
class User(Base):
    id: UUID              # Первичный ключ
    email: str            # Уникальный email
    account_name: str     # Уникальное имя аккаунта
    hashed_password: str  # Бcrypt хеш пароля
    profile_photo_url: Optional[str]
    is_active: bool       # Статус аккаунта
    created_at: datetime  # Timestamp создания
    updated_at: datetime  # Timestamp последнего обновления
    deleted_at: Optional[datetime]  # Soft delete
```

### FileUpload (`app/db/models/upload.py`)

```python
class FileUpload(Base):
    id: UUID               # Первичный ключ
    user_id: UUID          # FK → users.id (CASCADE)
    original_filename: str # Имя файла
    file_url: str          # URL в MinIO
    file_size: int         # Размер в байтах
    file_type: str         # jpg/png/webp
    mime_type: str         # MIME тип
    uploaded_at: datetime  # Timestamp загрузки
```

### GenerationHistory (`app/db/models/history.py`)

```python
class GenerationHistory(Base):
    id: UUID               # Первичный ключ
    user_id: UUID          # FK → users.id (CASCADE)
    image_url: str         # URL сгенерированного изображения
    title: str             # Сгенерированный заголовок
    description: str       # Описание (TEXT)
    is_edited: bool        # Была ли запись отредактирована
    created_at: datetime   # Timestamp создания
    modified_at: datetime  # Timestamp последнего редактирования
```

---

## 🔐 Безопасность и Аутентификация

### JWT Токены

**Создание токена:**
```python
from app.core.security import create_access_token

token = create_access_token(
    data={"sub": user_id, "email": user_email}
)
```

**Декodирование и валидация:**
```python
from app.api.v1.deps import validate_token

# В dependency:
async def get_current_user(token_data: dict = Depends(validate_token)):
    # token_data содержит payload JWT
    pass
```

### Хеширование паролей

```python
from app.core.security import hash_password, verify_password

# Хеширование при регистрации:
hashed = hash_password("user_password")

# Проверка при входе:
is_valid = verify_password("user_password", hashed)
```

---

## 🗄️ Работа с Базой Данных (Async SQLAlchemy)

### Создание сессии

```python
from app.db.session import get_db

async def create_user(db: AsyncSession = Depends(get_db), email: str):
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()
```

### Repository Pattern

```python
from app.db.repositories.user import UserRepository

async def get_user_by_email(session, email: str) -> Optional[User]:
    return await UserRepository.get_by_email(session, email)
```

---

## 📦 MinIO Объектное Хранилище

### Client API (`app/storage/client.py`)

```python
class MinioClient:
    async def upload_file(
        file_content: bytes,  # Контент файла
        filename: str,         # Имя файла
        content_type: str = '' # MIME тип
    ) -> str:                  # Возвращает полный URL
        pass
    
    async def delete_file(file_id: str) -> bool:
        pass
    
    async def get_file_info(file_id: str) -> dict:
        # Returns: {url, size, type, original_filename, mime_type}
        pass
```

### Upload Service

```python
from app.storage.service import UploadService

async def upload_photo(
    file_content: bytes,
    content_type: str,  # image/jpeg/png/webp
    user_id: str       # ID владельца
) -> Dict[str, Any]:
    # Валидация: MIME type + размер файла (max 5MB)
    # Возврат: {id, url, size, type}
    pass
```

---

## 🔄 Цикл Жизни Записей

### Soft Delete Пользователей

```python
# При удалении аккаунта:
async def delete_account(session, user_id):
    user = await session.get(User, user_id)
    if user:
        user.is_active = False
        user.deleted_at = datetime.now()
```

### Soft Delete Истории

```python
# История не удаляется физически, только помечается
async def delete_history_item(user_id, item_id):
    await session.execute(
        update(GenerationHistory)
        .where(GenerationHistory.id == item_id)
        .values(is_edited=True, modified_at=datetime.now())
    )
```

---

## 🚀 Индексация и Производительность

### Созданные индексы:

**users:**
- `ix_users_email` — быстрый поиск по email
- `ix_users_account_name` — поиск по имени
- `ix_users_soft_delete` — partial index для soft deleted

**file_uploads:**
- `ix_file_uploads_user_id` — FK индекс
- `ix_file_uploads_uploaded_at` — сортировка по времени

**generation_histories:**
- `ix_gen_history_user_id` — фильтрация по пользователю
- `ix_gen_history_created_at` — сортировка истории
- Composite search index для title + description

---

## 📝 Паттерны и Практики

### 1. Dependency Injection

```python
from fastapi import Depends

async def get_db():
    # Возвращает AsyncSession
    pass

async def get_current_user(token_data: dict, db: AsyncSession):
    # Получение текущего юзера с проверкой
    pass
```

### 2. Exception Handling

```python
from app.core.exceptions import ValidationError

try:
    await service.register(user_data)
except ValidationError as e:
    raise HTTPException(status_code=400, detail=str(e))
```

### 3. Transaction Management

```python
async def register_user(email: str, password: str):
    async with get_db() as session:
        try:
            user = await UserRepository.create(session, email, password)
        except Exception:
            await session.rollback()
            raise
        # Коммит происходит автоматически при выходе из контекста
```

---

## ⚙️ Конфигурация (.env)

```env
# Application
DEBUG=True
PORT=8000

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=i2d_db
DB_USER=postgres
DB_PASSWORD=postgres

# MinIO
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=uploads
MINIO_SECURE=False

# JWT
SECRET_KEY=change-this-to-very-long-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# CORS
ALLOW_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

---

## 📋 Следующие шаги

После создания базовой структуры (Этап 7), можно перейти к:

**A. Этап 1: Core компоненты** — завершить настройки, если что-то упущено  
**B. Этап 2: Service Layer** — реализовать бизнес-логику для auth, uploads, history  
**C. Этап 3: API Routes** — создать все маршруты с proper validation и error handling  
**D. Этап 4: AI Integration** — подключить внешний LLM сервис  
**E. Этап 5: Testing** — написать unit и integration тесты  

---

## 🛠️ Установленные зависимости

Все необходимые пакеты уже добавлены в `requirements.txt`:
- FastAPI, SQLAlchemy (async), asyncpg
- python-jose, bcrypt для auth
- boto3 для MinIO
- httpx для AI интеграции

```bash
pip install -r requirements.txt
```
