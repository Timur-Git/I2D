from dataclasses import dataclass
from typing import List, Optional

import httpx
from fastapi import HTTPException, status
from pydantic import BaseModel, Field

from app.config import settings
from app.schemas.generate import AIConfiguration


@dataclass(frozen=True)
class MLImage:
    filename: str
    content: bytes
    content_type: str = "image/jpeg"


class MLGenerationResult(BaseModel):
    title: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)


class MLServiceClient:
    def __init__(
        self,
        service_url: Optional[str] = None,
        timeout_seconds: Optional[float] = None,
    ):
        self.service_url = service_url if service_url is not None else settings.ml_service_url
        self.timeout_seconds = timeout_seconds or settings.ml_service_timeout_seconds

    @property
    def endpoint_url(self) -> str:
        if not self.service_url:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="ML service URL is not configured",
            )

        url = self.service_url.rstrip("/")
        if url.endswith("/generate"):
            return url
        return f"{url}/api/v1/generate"

    async def generate(self, images: List[MLImage], config: AIConfiguration) -> MLGenerationResult:
        if not images:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No images to send to ML service")

        files = [
            ("files", (image.filename, image.content, image.content_type))
            for image in images
        ]
        data = {
            "language": config.language,
            "style": config.style or "",
            "tone": config.tone or "",
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
                response = await client.post(self.endpoint_url, data=data, files=files)
        except httpx.TimeoutException as exc:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="ML service request timed out",
            ) from exc
        except httpx.HTTPError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="ML service is unavailable",
            ) from exc

        if response.status_code >= 400:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail={
                    "message": "ML service returned an error",
                    "status_code": response.status_code,
                    "response": self._safe_response_detail(response),
                },
            )

        try:
            return MLGenerationResult.model_validate(response.json())
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="ML service returned an invalid response",
            ) from exc

    @staticmethod
    def _safe_response_detail(response: httpx.Response):
        try:
            return response.json()
        except ValueError:
            return response.text[:1000]
