# I2D Backend - FastAPI Skeleton

Минимальный каркас веб-приложения на FastAPI со health check endpoint.

## Структура проекта

```
I2D_backend/
├── app/
│   ├── main.py              # Точка входа (app factory)
│   ├── config.py            # Настройки приложения (Pydantic Settings)
│   └── api/
│       └── v1/
│           ├── router.py    # API v1 aggregator (с /v1 префиксом)
│           └── health.py    # Health check endpoint
├── tests/                   # Тесты
├── requirements.txt         # Python зависимости
└── .env                     # Конфигурация окружения
```

## Установка зависимостей

```bash
pip install -r requirements.txt
```

## Запуск сервера (Windows PowerShell)

### 1. Активация виртуального окружения

Откройте PowerShell и выполните:

```powershell
cd "C:\Users\Unknown\Documents\open_code_projects\I2D_backend"
.\venv\Scripts\Activate.ps1
python -m venv venv  # Если venv ещё не создан
```

### 2. Установка зависимостей

```powershell
pip install -r requirements.txt
```

### 3. Запуск сервера

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Выход из виртуального окружения

```powershell
deactivate
```

## Тестовый запрос

```bash
curl http://localhost:8000/v1/health
```

**Ответ:** `{"status":"ok","timestamp":"2026-05-04T21:00:00.000000"}`

## Тесты

```bash
python -m pytest tests/
```
