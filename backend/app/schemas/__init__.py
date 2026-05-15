from .auth import (
    UserResponse,
    UserRegisterRequest,
    UserLoginRequest,
    ForgotPasswordRequest,
    ChangePasswordRequest,
    AuthRegisterResponse,
    AuthLoginResponse,
    MessageResponse,
)

from .user import (
    UserResponse as UserProfile,
    UserUpdateRequest,
    AccountDeleteResponse,
    ProfilePhotoUpdate,
)

from .upload import (
    FileUploadResponse,
    PhotoUploadRequest,
    FileInfoResponse,
)

from .generate import (
    GenerateRequest,
    GenerateResponse,
    AIConfiguration,
)

from .history import (
    HistoryItemResponse,
    HistoryCreateRequest,
    HistoryUpdateRequest,
    HistoryPaginationResponse,
    HistoryClearResponse,
    SearchFilter,
)

__all__ = [
    # Auth
    "UserResponse",
    "UserRegisterRequest",
    "UserLoginRequest",
    "ForgotPasswordRequest",
    "ChangePasswordRequest",
    "AuthRegisterResponse",
    "AuthLoginResponse",
    "MessageResponse",
    # User
    "UserProfile",
    "UserUpdateRequest",
    "AccountDeleteResponse",
    "ProfilePhotoUpdate",
    # Upload
    "FileUploadResponse",
    "PhotoUploadRequest",
    "FileInfoResponse",
    # Generate
    "GenerateRequest",
    "GenerateResponse",
    "AIConfiguration",
    # History
    "HistoryItemResponse",
    "HistoryCreateRequest",
    "HistoryUpdateRequest",
    "HistoryPaginationResponse",
    "HistoryClearResponse",
    "SearchFilter",
]
