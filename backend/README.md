# I2D Backend — Image to Description Service

Backend API для сервиса генерации описаний товаров из фотографий.

## 🚀 Quick Start

### 1. Установка зависимостей

```bash
pip install -r requirements.txt
```

### 2. Настройка окружения

```bash
cp .env.example .env
# Редактируйте .env под ваши настройки PostgreSQL и MinIO
```

### 3. Запуск приложения

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Ваш API будет доступен по адресу: `http://127.0.0.1:8000`

### 4. Docker Compose (опционально)

Если вам нужны контейнеры PostgreSQL и MinIO:

```bash
docker-compose up -d
```

---

## 📦 Технологии

- **FastAPI** — асинхронный веб-фреймворк
- **SQLAlchemy 2.0** — ORM с asyncpg драйвером
- **python-jose + bcrypt** — JWT токены и пароли
- **boto3 + MinIO** — объектное хранилище
- **httpx** — асинхронный HTTP клиент для AI

---

## 📁 Структура проекта

```
app/
├── core/           # Ядро (security, database)
├── db/             # ORM модели и репозитории
├── storage/        # MinIO client + upload service
├── schemas/        # Pydantic in/out models
├── api/v1/         # API routes
│   ├── auth/       # Регистрация, вход
│   ├── users/      # Управление профилем
│   ├── uploads/    # Загрузка фото
│   ├── generate/   # AI генерация
│   └── history/    # История результатов
```

---

## 📖 Документация

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## 🔐 Безопасность

- JWT токены с 60 минутным expiration
- Пароли хешируются с bcrypt
- Soft delete для пользователей и истории
- CORS политика через конфигурацию

---

## 🧪 Тестирование

```bash
pytest tests/ -v --cov=app
```

---

## 📝 Чеклист разработки

**Что уже реализовано (Этап 7):**
- ✅ ORM модели данных
- ✅ Асинхронная работа с БД
- ✅ JWT аутентификация
- ✅ MinIO client + upload service
- ✅ Repository pattern для User
- ✅ Soft delete логика

**Что осталось:**
- ⏳ Auth routes (register, login, forgot-password)
- ⏳ User CRUD endpoints
- ⏳ Upload/Download фото API
- ⏳ AI генерация + LLM интеграция
- ⏳ History CRUD с пагинацией
- ⏳ Тесты
