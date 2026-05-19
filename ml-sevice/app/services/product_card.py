import base64
import json
import re
from dataclasses import dataclass
from io import BytesIO
from typing import List

from fastapi import HTTPException, status
from PIL import Image, UnidentifiedImageError

from app.config import Settings
from app.schemas import DetectedObject, GenerateResponse, GenerationConfig


NON_PRODUCT_CLASSES = {
    "person",
    "people",
    "man",
    "woman",
    "child",
    "face",
    "hand",
    "finger",
    "body",
}


@dataclass
class DetectionResult:
    object_name: str
    confidence: float
    image: Image.Image


class ProductCardService:
    def __init__(self, settings: Settings):
        self.settings = settings
        self._det_model = None
        self._llm_client = None

    @property
    def det_model(self):
        if self._det_model is None:
            from ultralytics import YOLO

            self._det_model = YOLO(self.settings.yolo_model_path)
        return self._det_model

    @property
    def llm_client(self):
        if self._llm_client is None:
            from openai import OpenAI

            self._llm_client = OpenAI(
                base_url=self.settings.lm_studio_url,
                api_key=self.settings.lm_studio_api_key,
            )
        return self._llm_client

    async def generate(self, files: List[bytes], config: GenerationConfig) -> GenerateResponse:
        if not files:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="At least one image is required")
        if len(files) > 5:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Maximum 5 images are allowed")

        detections = [self.detect_and_crop(content) for content in files]
        selected = max(detections, key=lambda item: item.confidence)
        card = self.generate_description(selected.image, selected.object_name, config)

        return GenerateResponse(
            title=card["title"],
            description=card["description"],
            detected_object=DetectedObject(name=selected.object_name, confidence=selected.confidence),
            processed_images=len(files),
        )

    def detect_and_crop(self, image_content: bytes) -> DetectionResult:
        image = self._open_jpeg(image_content)
        results = self.det_model(image, conf=self.settings.yolo_confidence, iou=self.settings.yolo_iou)
        boxes = results[0].boxes

        if len(boxes) == 0:
            return DetectionResult(object_name="unknown object", confidence=0.0, image=image)

        sorted_boxes = sorted(boxes, key=lambda box: float(box.conf[0]), reverse=True)
        chosen = None
        for box in sorted_boxes:
            class_name = self.det_model.names[int(box.cls[0])]
            if class_name.lower() not in NON_PRODUCT_CLASSES:
                chosen = box
                break

        chosen = chosen or sorted_boxes[0]
        x1, y1, x2, y2 = map(int, chosen.xyxy[0])
        class_id = int(chosen.cls[0])
        confidence = float(chosen.conf[0])
        object_name = self.det_model.names[class_id]

        width, height = image.size
        padding = self.settings.crop_padding
        x1 = max(0, x1 - padding)
        y1 = max(0, y1 - padding)
        x2 = min(width, x2 + padding)
        y2 = min(height, y2 + padding)

        cropped = image.crop((x1, y1, x2, y2))
        return DetectionResult(object_name=object_name, confidence=confidence, image=cropped)

    def generate_description(
        self,
        image: Image.Image,
        object_name: str,
        config: GenerationConfig,
    ) -> dict:
        prompt = self._build_prompt(object_name, config)
        image_b64 = self._encode_image(image)

        try:
            response = self.llm_client.chat.completions.create(
                model=self.settings.lm_studio_model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a marketplace copywriter. Respond only with valid JSON. "
                            "Write product content in Russian unless another language is requested."
                        ),
                    },
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"},
                            },
                        ],
                    },
                ],
                temperature=self.settings.llm_temperature,
                max_tokens=self.settings.llm_max_tokens,
                top_p=self.settings.llm_top_p,
                extra_body={"chat_template_kwargs": {"thinking": False}},
            )
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"LM Studio generation failed: {exc}",
            ) from exc

        raw_text = self._strip_think_blocks(response.choices[0].message.content or "")
        return self._parse_llm_response(raw_text, object_name)

    def _build_prompt(self, object_name: str, config: GenerationConfig) -> str:
        language = config.language or "ru"
        style = config.style or "marketplace"
        tone = config.tone or "professional"
        return (
            "/no_think\n"
            f"Detected object class: {object_name}.\n"
            f"Language: {language}. Style: {style}. Tone: {tone}.\n"
            "Create a product card for a marketplace.\n"
            "Return strict JSON with exactly two string fields: title and description.\n"
            "The title must be short, clear and sale-oriented.\n"
            "The description must include main characteristics, benefits, possible use cases and package contents.\n"
            "Do not include markdown, explanations, chain-of-thought, or text outside JSON."
        )

    @staticmethod
    def _open_jpeg(image_content: bytes) -> Image.Image:
        if not image_content.startswith(b"\xff\xd8\xff"):
            raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail="Only JPEG images are accepted")

        try:
            image = Image.open(BytesIO(image_content))
            return image.convert("RGB")
        except UnidentifiedImageError as exc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid JPEG image") from exc

    @staticmethod
    def _encode_image(image: Image.Image) -> str:
        buffer = BytesIO()
        image.convert("RGB").save(buffer, format="JPEG", quality=85)
        return base64.b64encode(buffer.getvalue()).decode("utf-8")

    @staticmethod
    def _strip_think_blocks(text: str) -> str:
        text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL)
        return text.strip()

    @staticmethod
    def _parse_llm_response(raw_text: str, fallback_object_name: str) -> dict:
        json_text = raw_text.strip()
        fenced = re.search(r"```(?:json)?\s*(.*?)```", json_text, flags=re.DOTALL)
        if fenced:
            json_text = fenced.group(1).strip()

        try:
            data = json.loads(json_text)
        except json.JSONDecodeError:
            return {
                "title": fallback_object_name.title(),
                "description": raw_text,
            }

        title = str(data.get("title") or fallback_object_name.title()).strip()
        description = str(data.get("description") or raw_text).strip()
        return {
            "title": title[:200],
            "description": description,
        }
