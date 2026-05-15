from http import HTTPStatus
from typing import Optional


class I2DException(Exception):
    """Базовое исключение для приложения."""
    
    def __init__(self, message: str, status_code: int = HTTPStatus.INTERNAL_SERVER_ERROR):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class AuthenticationError(I2DException):
    """Ошибка аутентификации."""
    def __init__(self, message: str = "Неверные данные для авторизации"):
        super().__init__(message, HTTPStatus.UNAUTHORIZED)


class AuthorizationError(I2DException):
    """Ошибка авторизации (пользователь не имеет доступа)."""
    def __init__(self, message: str = "У вас нет прав для выполнения этого действия"):
        super().__init__(message, HTTPStatus.FORBIDDEN)


class TokenExpiredError(I2DException):
    """Токен истёк."""
    def __init__(self, message: str = "Токен доступа истёк. Пожалуйста, войдите снова"):
        super().__init__(message, HTTPStatus.UNAUTHORIZED)


class ValidationError(I2DException):
    """Ошибка валидации данных."""
    def __init__(self, message: str = "Некорректные входные данные"):
        super().__init__(message, HTTPStatus.BAD_REQUEST)


class ItemNotFoundError(I2DException):
    """Предмет не найден."""
    def __init__(self, item_name: Optional[str] = None, message: str = "Искомый элемент не найден"):
        self.item_name = item_name
        super().__init__(message, HTTPStatus.NOT_FOUND)


class UserNotFoundError(I2DException):
    """Пользователь не найден."""
    def __init__(self, email: str = None, user_id: str = None):
        if email:
            super().__init__(f"Пользователь с email {email} не найден", HTTPStatus.NOT_FOUND)
        elif user_id:
            super().__init__(f"Пользователь с ID {user_id} не найден", HTTPStatus.NOT_FOUND)


class FileUploadError(I2DException):
    """Ошибка загрузки файла."""
    def __init__(self, message: str = "Не удалось загрузить файл"):
        super().__init__(message, HTTPStatus.BAD_REQUEST)


class StorageError(I2DException):
    """Ошибка работы со хранилищем."""
    def __init__(self, message: str = "Ошибка при работе с объектным хранилищем"):
        super().__init__(message, HTTPStatus.INTERNAL_SERVER_ERROR)


class AIGenerationError(I2DException):
    """Ошибка генерации AI."""
    def __init__(self, message: str = "Не удалось сгенерировать описание"):
        super().__init__(message, HTTPStatus.BAD_REQUEST)
