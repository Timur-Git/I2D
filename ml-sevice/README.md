# I2D ML Service

FastAPI service for product-card generation from JPEG images.

Flow:

1. Accept up to 5 JPEG files through `POST /api/v1/generate`.
2. Detect the product-like object with YOLOv8n.
3. Crop the selected object.
4. Send the cropped JPEG to LM Studio through the OpenAI-compatible API.
5. Return `title`, `description`, detected object metadata and processed image count.

Run locally:

```bash
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```
