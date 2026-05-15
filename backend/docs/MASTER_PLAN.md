# 📘 I2D Backend — Master Development Plan

## 📋 Обзор проекта

**Image to Description (I2D) Backend** — сервис для генерации описаний товаров из фотографий с использованием AI/LLM.

---

## 🏗️ Архитектура проекта (Clean Architecture)

```
app/
├── core/                    # Ядро приложения (независимое от фреймворка)
│   ├── database.py          # Async DB engine, Base metadata
│   ├── security.py          # JWT токены, bcrypt хеширование
│   └── base_exceptions.py   # Кастомные исключения
│
├── db/                      # ORM слой (SQLAlchemy + asyncpg)
│   ├── models/             # SQLAlchemy модели данных
│   │   ├── user.py         # User модель
│   │   ├── upload.py       # FileUpload модель
│   │   └── history.py      # GenerationHistory модель
│   ├── repositories/       # Repository pattern (абстракция БД)
│   │   └── user.py         # UserRepository методы
│   └── session.py          # Async session management + dependency
│
├── storage/                 # Объектное хранилище MinIO
│   ├── client.py           # MinIO client (boto3)
│   └── service.py          # UploadService для работы с файлами
│
├── ai/                      # AI сервис (будущий)
│   └── service.py          # Интеграция с внешним LLM API
│
├── schemas/                 # Pydantic валидация (input/output модели)
│   ├── auth.py             # Аутентификация
│   ├── user.py             # Управление профилем
│   ├── upload.py           # Загрузка изображений
│   ├── generate.py         # AI генерация
│   └── history.py          # История с пагинацией
│
├── api/                     # API слой (FastAPI routes)
│   ├── v1/                  # Версия 1 API
│   │   ├── router.py       # Главный роутер v1
│   │   ├── health.py       # Health check endpoint
│   │   ├── deps.py         # Dependency injection (токены, БД)
│   │   └── exceptions.py   # Глобальный обработчик ошибок
│   │
│   ├── auth/               # Аутентификация модуль
│   │   ├── router.py       # POST /register, /login, /forgot-password
│   │   ├── service.py      # Бизнес-логика аутентификации
│   │   └── schemas.py      # Pydantic схемы (автоимпорт)
│   │
│   ├── users/              # Управление пользователями
│   │   ├── router.py       # GET/PUT/DELETE /me
│   │   ├── service.py      # Бизнес-логика пользователей
│   │   └── schemas.py      # Pydantic схемы
│   │
│   ├── uploads/            # Загрузка изображений
│   │   ├── router.py       # POST/upload, DELETE/{id}, GET/{id}
│   │   ├── service.py      # Бизнес-логика загрузки
│   │   └── schemas.py      # Pydantic схемы
│   │
│   ├── generate/           # AI генерация контента
│   │   ├── router.py       # POST /generate
│   │   ├── service.py      # LLM интеграция + бизнес-логика
│   │   └── schemas.py      # Pydantic схемы
│   │
│   └── history/            # История генераций
│       ├── router.py       # CRUD /history/* с пагинацией
│       ├── service.py      # Бизнес-логика истории
│       └── schemas.py      # Pydantic схемы
│
├── __init__.py             # Экспорт приложения
└── main.py                 # Точка входа в приложение
```

---

## 📊 Модели данных (Database Models)

### User (`app/db/models/user.py`)

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | Первичный ключ |
| email | str(255) | Уникальный email (index) |
| account_name | str(50) | Уникальное имя аккаунта (index) |
| hashed_password | str(255) | Бcrypt хеш пароля |
| profile_photo_url | Optional[str] | URL аватара |
| is_active | bool | Статус активности |
| created_at | datetime | Timestamp создания |
| updated_at | datetime | Timestamp последнего обновления |
| deleted_at | Optional[datetime] | Soft delete timestamp |

**Индексы:** email, account_name, created_at, soft_delete

---

### FileUpload (`app/db/models/upload.py`)

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | Первичный ключ |
| user_id | UUID | FK → users.id (CASCADE) |
| original_filename | str(255) | Имя файла |
| file_url | str(1000) | URL в MinIO |
| file_size | int | Размер в байтах |
| file_type | str(50) | jpg/png/webp |
| mime_type | str(100) | MIME тип |
| uploaded_at | datetime | Timestamp загрузки |

**Индексы:** user_id, uploaded_at

---

### GenerationHistory (`app/db/models/history.py`)

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | Первичный ключ |
| user_id | UUID | FK → users.id (CASCADE) |
| image_url | str(1000) | URL сгенерированного изображения |
| title | str(200) | Сгенерированный заголовок |
| description | TEXT | Описание товара |
| is_edited | bool | Была ли запись отредактирована |
| created_at | datetime | Timestamp создания |
| modified_at | datetime | Timestamp последнего редактирования |

**Индексы:** user_id, created_at, modified_at, composite (title+description)

---

## 🔐 Безопасность и Аутентификация

### JWT Токены

```python
from app.core.security import create_access_token, decode_access_token

# Создание токена при регистрации/входе
token = create_access_token(data={"sub": user_id, "email": user_email})
```

**Заголовки:**
- `Authorization: Bearer <token>` для всех защищённых endpoints
- Token expiration: 60 минут (из .env)

### Парольное хеширование

```python
from app.core.security import hash_password, verify_password

# Хеширование при регистрации
hashed = hash_password("user_password")

# Проверка при входе
is_valid = verify_password("user_password", hashed)
```

---

## 🗄️ Работа с Базой Данных

### Async SQLAlchemy Session Management

```python
from app.db.session import get_db

async def create_user(
    email: str, 
    password: str,
):
    async with get_db() as session:
        # CRUD операции
        user = await UserRepository.get_by_email(session, email)
        ...
```

### Repository Pattern

```python
from app.db.repositories.user import UserRepository

async def get_user_by_email(session, email: str) -> User | None:
    return await UserRepository.get_by_email(session, email)
```

---

## 📦 MinIO Объектное Хранилище

### UploadService API

```python
from app.storage.service import UploadService

# Загрузка фото
result = await service.upload_photo(
    file_content=bytes,  # Контент файла
    content_type="image/jpeg",
    user_id="user-id"
)
# Returns: {id, url, size, type}

# Удаление
await service.delete_photo(file_url)

# Информация о файле
info = await service.get_file_info(file_id)
```

**Метаданные файла:**
- URL полный путь в MinIO
- Размер файла (bytes)
- MIME type (image/jpeg/png/webp)
- Оригинальное имя

---

## 🔄 Циклы Жизни Записей

### Soft Delete Пользователей

```python
# При удалении аккаунта:
user.is_active = False
user.deleted_at = datetime.now()
```

### Soft Delete Истории

```python
# История не удаляется физически, только помечается:
item.is_edited = True
item.modified_at = datetime.now()
```

---

## 📝 Паттерны и Практики

### 1. Dependency Injection

```python
from fastapi import Depends

async def get_db():
    # Возвращает AsyncSession из контекста менеджера
    pass

async def get_current_user(token_data: dict, db: AsyncSession):
    # Получение текущего юзера с проверкой JWT
    pass
```

### 2. Exception Handling

```python
from app.core.base_exceptions import ValidationError

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
            # Rollback происходит автоматически при ошибке
            raise
        # Commit происходит при успешном завершении контекста
```

---

## 🚀 Конфигурация (.env)

```env
# Application Settings
DEBUG=False
PORT=8000

# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=i2d_db
DB_USER=postgres
DB_PASSWORD=postgres

# MinIO Object Storage
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=uploads
MINIO_SECURE=False

# JWT Authentication
SECRET_KEY=change-this-to-very-long-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# CORS Configuration
ALLOW_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

---

## 📋 План разработки (по этапам)

### ✅ Выполнено (Этап 7 + Этап 5)

**Database Layer:**
- [x] ORM модели данных (User, FileUpload, GenerationHistory)
- [x] Асинхронный DB engine с asyncpg
- [x] Repository pattern для User
- [x] SQLAlchemy session management
- [x] Alembic миграции (3 версии схем)

**Core Components:**
- [x] JWT токены + bcrypt пароли
- [x] Кастомные исключения
- [x] Глобальный exception handler

**Storage & MinIO:**
- [x] MinIO client (boto3)
- [x] UploadService с валидацией файлов
- [x] Загрузка/удаление/метаданные

**Pydantic Schemas:**
- [x] auth, user, upload, generate, history модели

**Service Layer (Business Logic):**
- [x] AuthService (register, login, forgot-password)
- [x] UserService (get/update/delete profile)
- [x] UploadService (upload/delete/get_info)
- [x] AIService (generate_title_description)
- [x] HistoryService (CRUD с пагинацией и поиском)

**API Routes:**
- [x] Auth endpoints (/register, /login, /forgot-password)
- [x] User CRUD (/users/me GET/PUT/DELETE)
- [x] Upload endpoints (/photo POST, /{id} DELETE/GET)
- [x] Generate endpoint (/generate POST)
- [x] History CRUD (/history/* с пагинацией и поиском)

**Infrastructure:**
- [x] Docker Compose (PostgreSQL + MinIO)
- [x] CORS configuration
- [x] .env.example шаблон
- [x] Alembic миграции для всех таблиц
- [x] README.md quick start guide

---

### ⏳ Остались

**AI Integration (Этап 8):**
- [ ] Реальная интеграция с LLM API
- [ ] Prompt engineering для генераций
- [ ] Retry logic и fallback responses
- [ ] Кэширование результатов

**Testing (Этап 9):**
- [ ] Unit tests для сервисов
- [ ] Integration tests для API endpoints
- [ ] Mock PostgreSQL для тестов
- [ ] Mock MinIO для тестов
- [ ] Test coverage > 80%

**Documentation (Этап 10):**
- [ ] Swagger/ReDoc интерактивная документация
- [ ] Postman collection
- [ ] API usage guide с примерами
- [ ] Troubleshooting guide

**Deployment:**
- [ ] Docker production image
- [ ] Health check endpoints
- [ ] Logging configuration
- [ ] Monitoring setup

---

## 🔄 Цикл разработки

```
[1] Infrastructure Setup
    ├── requirements.txt
    ├── .env.example  
    ├── docker-compose.yml
    └── alembic.ini

[2] Database Layer
    ├── models/*.py
    ├── repositories/*.py
    └── session.py

[3] Core Components
    ├── security.py
    ├── base_exceptions.py
    └── database.py

[4] Pydantic Schemas
    ├── schemas/auth.py
    ├── schemas/user.py
    ├── schemas/upload.py
    ├── schemas/generate.py
    └── schemas/history.py

[5] Service Layer (Business Logic)
    ├── auth/service.py
    ├── users/service.py
    ├── uploads/service.py
    ├── generate/service.py
    └── history/service.py

[6] API Routes
    ├── api/v1/{module}/router.py
    ├── api/deps.py
    └── api/exceptions.py

[7] Testing
    ├── tests/unit/*
    └── tests/integration/*

[8] Documentation & Deployment
    ├── README.md
    └── docker-compose.yml (prod)
```

---

## 📚 Дополнительные файлы

| Файл | Описание |
|------|----------|
| `docs/ARCHITECTURE.md` | Подробная документация архитектуры |
| `docs/EXAMPLES.md` | Примеры использования API и моделей |
| `README.md` | Quick start guide |
| `.env.example` | Шаблон переменных окружения |
| `requirements.txt` | Все зависимости проекта |

---

## 🛠️ Технологии

- **FastAPI** — асинхронный веб-фреймворк
- **SQLAlchemy 2.0 (async)** — ORM для PostgreSQL
- **asyncpg** — асинхронный драйвер БД
- **python-jose + bcrypt** — JWT токены и пароли
- **boto3 + MinIO** — объектное хранилище S3-compatible
- **httpx** — асинхронный HTTP клиент для AI
- **Alembic** — миграции БД

---

## 📞 Контакты и поддержка

**API Документация:** http://localhost:8000/docs (Swagger UI)  
**ReDoc:** http://localhost:8000/redoc
