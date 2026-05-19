from http import HTTPStatus
from typing import Optional


class I2DException(Exception):
    def __init__(self, message: str, status_code: int = HTTPStatus.INTERNAL_SERVER_ERROR):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class AuthenticationError(I2DException):
    def __init__(self, message: str = "Invalid authentication credentials"):
        super().__init__(message, HTTPStatus.UNAUTHORIZED)


class AuthorizationError(I2DException):
    def __init__(self, message: str = "Not enough permissions"):
        super().__init__(message, HTTPStatus.FORBIDDEN)


class TokenExpiredError(I2DException):
    def __init__(self, message: str = "Access token expired"):
        super().__init__(message, HTTPStatus.UNAUTHORIZED)


class ValidationError(I2DException):
    def __init__(self, message: str = "Invalid input data"):
        super().__init__(message, HTTPStatus.BAD_REQUEST)


class ItemNotFoundError(I2DException):
    def __init__(
        self,
        item_name: Optional[str] = None,
        message: str = "Item not found",
    ):
        self.item_name = item_name
        super().__init__(message, HTTPStatus.NOT_FOUND)


class UserNotFoundError(I2DException):
    def __init__(self, email: str | None = None, user_id: str | None = None):
        identifier = email or user_id or "unknown"
        super().__init__(f"User {identifier} not found", HTTPStatus.NOT_FOUND)


class FileUploadError(I2DException):
    def __init__(self, message: str = "Could not upload file"):
        super().__init__(message, HTTPStatus.BAD_REQUEST)


class StorageError(I2DException):
    def __init__(self, message: str = "Object storage error"):
        super().__init__(message, HTTPStatus.INTERNAL_SERVER_ERROR)


class AIGenerationError(I2DException):
    def __init__(self, message: str = "Could not generate description"):
        super().__init__(message, HTTPStatus.BAD_REQUEST)
