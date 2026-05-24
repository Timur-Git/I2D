FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /

# Копируем зависимости
COPY requirements.txt .

# Устанавливаем зависимости (это может занять время из-за torch и yolov8)
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь проект
COPY . .

# Создаем директорию для моделей YOLO
RUN mkdir -p /root/.cache/ultralytics

# Открываем порт
EXPOSE 8001

# Запускаем ML сервис
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]