from fastapi.testclient import TestClient
from io import BytesIO

from PIL import Image

from app.api.v1.generate.service import AIService
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_access_token,
    decode_refresh_token,
    hash_password,
    verify_password,
)
from app.main import app


def test_password_hashing_roundtrip():
    password = "correct horse battery staple"
    hashed = hash_password(password)

    assert hashed != password
    assert verify_password(password, hashed)
    assert not verify_password("wrong password", hashed)


def test_access_and_refresh_tokens_have_distinct_types():
    payload = {"sub": "b978117b-5418-4c4b-9df6-3387d7d2b16f", "email": "user@example.com"}

    access_token = create_access_token(payload)
    refresh_token = create_refresh_token(payload)

    assert decode_access_token(access_token)["type"] == "access"
    assert decode_refresh_token(refresh_token)["type"] == "refresh"
    assert decode_access_token(refresh_token) is None
    assert decode_refresh_token(access_token) is None


def test_protected_route_requires_access_token():
    client = TestClient(app)
    refresh_token = create_refresh_token(
        {"sub": "b978117b-5418-4c4b-9df6-3387d7d2b16f", "email": "user@example.com"}
    )

    missing = client.get("/api/v1/users/me")
    wrong_type = client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {refresh_token}"})

    assert missing.status_code == 401
    assert wrong_type.status_code == 401


def test_protected_route_rejects_malformed_subject():
    client = TestClient(app)
    access_token = create_access_token({"sub": "not-a-uuid", "email": "user@example.com"})

    response = client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {access_token}"})

    assert response.status_code == 401


def test_png_to_jpeg_conversion_for_ml_inputs():
    png_buffer = BytesIO()
    Image.new("RGBA", (2, 2), (255, 0, 0, 128)).save(png_buffer, format="PNG")

    jpeg = AIService._convert_png_to_jpeg(png_buffer.getvalue())

    assert jpeg.startswith(b"\xff\xd8\xff")
