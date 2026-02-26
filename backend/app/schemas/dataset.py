"""Dataset schemas."""

from datetime import datetime
from pydantic import BaseModel


class DatasetResponse(BaseModel):
    id: str
    name: str
    original_filename: str
    file_size_bytes: int
    row_count: int | None = None
    column_count: int | None = None
    status: str
    ai_summary: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class DatasetUploadResponse(BaseModel):
    id: str
    name: str
    status: str
