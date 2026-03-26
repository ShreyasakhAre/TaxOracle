from __future__ import annotations

from celery import Celery

from app.utils.env_config import settings

# Celery wiring is optional for MVP runtime; API can still run background tasks without workers.
celery_app = Celery(
    "taxoracle",
    broker=settings.redis_url,
    backend=settings.redis_url,
)
celery_app.conf.update(task_serializer="json", result_serializer="json", accept_content=["json"])


@celery_app.task(name="taxoracle.extract_text")
def extract_text_task(file_path: str) -> str:
    return file_path


@celery_app.task(name="taxoracle.chunk_content")
def chunk_content_task(text: str) -> list[str]:
    from app.services.qa import build_chunks

    return build_chunks(text)


@celery_app.task(name="taxoracle.generate_insights")
def generate_insights_task(payload: dict) -> dict:
    return payload


@celery_app.task(name="taxoracle.update_db")
def update_db_task(task_id: str, status: str) -> dict:
    return {"task_id": task_id, "status": status}
