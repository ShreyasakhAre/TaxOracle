from __future__ import annotations

from datetime import datetime
from pathlib import Path
from uuid import uuid4

from app.utils.env_config import settings


def save_upload(file_name: str, file_bytes: bytes) -> tuple[str, str]:
    """
    Saves uploaded bytes to local storage and returns (task_id, file_path).
    """
    task_id = uuid4().hex
    safe_name = Path(file_name).name or "document.bin"
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    upload_dir = Path(settings.storage_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)

    target = upload_dir / f"{timestamp}_{task_id}_{safe_name}"
    target.write_bytes(file_bytes)
    return task_id, str(target)
