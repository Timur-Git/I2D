# I2D Backend API

Backend сервис для генерации описаний товаров из фотографий.

## Запуск сервиса

### 1. Установите зависимости

```bash
pip install -r requirements.txt
```

### 2. Поднимите PostgreSQL и MinIO (если не подняты)

Запустите docker-compose:
```bash
docker-compose up -d
```

Или подключитесь вручную к локальным контейнерам PostgreSQL (5432) и MinIO (9000).

### 3. Настройте переменные окружения

Создайте файл `.env` в корне проекта:
```bash
cp .env.example .env
```

Отредактируйте `.env` под ваши настройки БД и хранилища.

## Запуск сервиса

### 4. Запустите сервер

Запустите приложение в виртуальном окружении:

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Сервис будет доступен по адресу: `http://127.0.0.1:8000`

### Проверка запуска

Откройте в браузере:
- Swagger UI: http://localhost:8000/docs
- API docs: http://localhost:8000/redoc

или выполните тестовый запрос:
```bash
curl http://localhost:8000/api/v1/health
```

## Остановка сервиса

Нажмите `Ctrl+C` в терминале где запущен uvicorn.

---

## API Endpoints

Сервис предоставляет API endpoints на порту 8000:

**Аутентификация:**
- `POST /v1/auth/register` - Регистрация нового пользователя
- `POST /v1/auth/login` - Вход в систему  
- `POST /v1/auth/forgot-password` - Запрос сброса пароля

**Управление пользователями:**
- `GET /v1/users/me` - Получить профиль текущего пользователя
- `PUT /v1/users/me` - Обновить профиль
- `DELETE /v1/users/me` - Удалить аккаунт

**Загрузка изображений:**
- `POST /v1/uploads/photo` - Загрузить фото товара
- `GET /v1/uploads/{id}` - Получить информацию о файле
- `DELETE /v1/uploads/{id}` - Удалить файл

**AI Генерация:**
- `POST /v1/generate` - Сгенерировать описание по фото

**История:**
- `GET /v1/history` - Получить историю с пагинацией
- `POST /v1/history` - Сохранить результат генерации
- `PUT /v1/history/{id}/edit` - Редактировать запись
- `DELETE /v1/history/{id}` - Удалить из истории
- `DELETE /v1/history/clear` - Очистить всю историю

**Документация:** http://localhost:8000/docs (Swagger UI)
