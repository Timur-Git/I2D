# I2D Backend — Примеры использования API и моделей

## 📊 Database Models

### Пользователь (User)
```python
from app.db.models import User, UserRepository

# Создание
async def create_user(session, email: str, password: str):
    user = User(
        email=email,
        account_name="newuser",
        hashed_password=hash_password(password),
    )
    session.add(user)
    return user

# Получение
async def get_user_by_email(session, email: str) -> User | None:
    result = await session.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()
```

### Загрузка файлов (FileUpload)
```python
from app.db.models import FileUpload

async def create_upload_record(session, image_url: str, file_data: dict):
    user = await get_current_user()  # из токена
    
    upload = FileUpload(
        user_id=user.id,
        original_filename="product.jpg",
        file_url=image_url,
        file_size=file_data['size'],
        file_type='jpg',
        mime_type='image/jpeg',
    )
    session.add(upload)
    return upload
```

### История генераций (GenerationHistory)
```python
from app.db.models import GenerationHistory

async def save_generation_result(session, url: str, title: str, description: str):
    user = await get_current_user()
    
    history = GenerationHistory(
        user_id=user.id,
        image_url=url,
        title=title,
        description=description,
    )
    session.add(history)
    return history
```

---

## 🗄️ Repository Pattern

### UserRepository примеры

```python
from app.db.repositories.user import UserRepository

# Регистрация нового пользователя
async def register_user(email: str, password: str):
    async with get_db() as session:
        # Проверка на дубликаты
        existing_email = await UserRepository.get_by_email(session, email)
        if existing_email:
            raise UserExistsError("Email уже зарегистрирован")
        
        existing_name = await UserRepository.get_by_account_name(session, account_name)
        if existing_name:
            raise UserExistsError("Имя аккаунта занято")
        
        # Хэширование пароля
        hashed = hash_password(password)
        
        # Создание пользователя
        user = await session.execute(
            insert(User).values({
                "email": email,
                "account_name": account_name, 
                "hashed_password": hashed
            })
        ).returning(User)
        
        return user.scalar_one()

# Входящий вход
async def authenticate_user(email: str, password: str):
    async with get_db() as session:
        user = await UserRepository.get_by_email(session, email)
        if not user or not verify_password(password, user.hashed_password):
            raise AuthenticationError("Неверный email или пароль")
        
        # Создание JWT токена
        token = create_access_token(
            data={"sub": str(user.id), "email": user.email}
        )
        return {"token": token, "user": user}
```

---

## 📦 MinIO Storage Service

### Загрузка фото товара

```python
from app.storage.service import UploadService
from app.db.models.user import UserRepository

async def upload_product_photo(file_content: bytes, content_type: str):
    async with get_db() as session:
        user = await get_current_user(session)  # из Authorization header
        
        service = UploadService(db=UserRepository())
        result = await service.upload_photo(
            file_content=file_content,
            content_type=content_type,
            user_id=str(user.id)
        )
        
        return result
```

### Удаление файла

```python
from app.storage.client import MinioClient

async def delete_uploaded_file(file_url: str):
    storage = MinioClient()
    success = await storage.delete_file(file_url)
    # Также нужно удалить запись из БД через UserRepository
```

---

## 🔐 Security & Auth

### Регистрация (register endpoint)

```python
from app.schemas.auth import UserRegisterRequest
from app.db.models.user import UserRepository

@router.post("/auth/register", response_model=AuthRegisterResponse)
async def register(request: UserRegisterRequest):
    async with get_db() as session:
        # Валидация email и имени аккаунта
        existing = await UserRepository.get_by_email(session, request.email)
        if existing:
            raise ValidationError("Email уже занят")
        
        hashed_password = hash_password(request.password)
        
        user = User(
            email=request.email,
            account_name=request.account_name,
            hashed_password=hashed_password,
        )
        session.add(user)
        await session.commit()
        
        # Создание JWT токена
        token = create_access_token(data={"sub": str(user.id), "email": user.email})
        
        return AuthRegisterResponse(
            id=user.id,
            token=token,
            user=UserResponse(
                id=user.id,
                email=user.email,
                account_name=user.account_name,
            )
        )
```

### Вход (login endpoint)

```python
@router.post("/auth/login", response_model=AuthLoginResponse)
async def login(request: UserLoginRequest):
    async with get_db() as session:
        user = await UserRepository.get_by_email(session, request.email)
        
        if not user or not verify_password(request.password, user.hashed_password):
            raise AuthenticationError("Неверные данные для входа")
        
        if not user.is_active:
            raise AuthorizationError("Аккаунт заблокирован")
        
        token = create_access_token(
            data={"sub": str(user.id), "email": user.email}
        )
        
        return AuthLoginResponse(
            token=token,
            user=UserResponse(
                id=user.id,
                email=user.email,
                account_name=user.account_name,
            )
        )
```

---

## 📝 Валидация данных (Pydantic)

### Запрос на регистрацию

```python
from app.schemas.auth import UserRegisterRequest

# Пример валидации:
@router.post("/auth/register")
async def register(request: UserRegisterRequest):
    # Email: str, email validator
    # account_name: 1-50 символов
    # password: минимум 8 символов
    
    # ... business logic
```

### Запрос на изменение пароля

```python
from app.schemas.auth import ChangePasswordRequest

@router.put("/auth/change-password")
async def change_password(request: ChangePasswordRequest):
    current_password = verify_password(
        request.current_password, 
        user.hashed_password
    )
    
    if not current_password:
        raise ValidationError("Текущий пароль неверен")
    
    new_hashed = hash_password(request.new_password)
    user.hashed_password = new_hashed
```

---

## 📊 История с пагинацией

### Получение истории (GET /history)

```python
from app.schemas.history import HistoryPaginationResponse, SearchFilter

@router.get("/history", response_model=HistoryPaginationResponse)
async def get_history(
    page: int = 1,
    limit: int = 20,
    search_query: str | None = None,
    selected_date: date | None = None,
    sort_by_date: Literal["asc", "desc"] = "desc",
):
    async with get_db() as session:
        # Build query with filters
        query = select(GenerationHistory).where(GenerationHistory.user_id == current_user.id)
        
        if search_query:
            query = query.where(
                or_(
                    GenerationHistory.title.ilike(f"%{search_query}%"),
                    GenerationHistory.description.ilike(f"%{search_query}%")
                )
            )
        
        if selected_date:
            query = query.where(
                and_(
                    GenerationHistory.created_at >= date(selected_date.year, selected_date.month, 1),
                    GenerationHistory.created_at < date(selected_date.year + 1, selected_date.month, 1)
                )
            )
        
        # Pagination
        total = await session.execute(count(query))
        total_count = total.scalar()
        
        query = query.offset((page - 1) * limit).limit(limit)
        
        if sort_by_date == "asc":
            query = query.order_by(GenerationHistory.created_at.asc())
        
        result = await session.execute(query)
        items = result.scalars().all()
        
        return HistoryPaginationResponse(
            data=items,
            total=total_count,
            page=page,
            limit=limit,
            total_pages=(total_count + limit - 1) // limit
        )
```

---

## 🚀 AI Generation Example

### Сгенерировать описание по фото

```python
@router.post("/generate", response_model=GenerateResponse)
async def generate_description(request: GenerateRequest):
    # Проверка существования изображения
    storage = MinioClient()
    file_info = await storage.get_file_info(request.image_url)
    
    if not file_info:
        raise ItemNotFoundError("Изображение не найдено")
    
    # Вызов LLM API (пример)
    from app import ai_service
    
    result = await ai_service.generate_title_description(
        image_url=request.image_url,
        language="ru",
    )
    
    return GenerateResponse(
        title=result["title"],
        description=result["description"]
    )
```

---

## 📚 Дополнительные примеры см. в:
- `docs/ARCHITECTURE.md` — полная документация архитектуры
- `/api/v1/docs` — Swagger UI с интерактивными тестами
