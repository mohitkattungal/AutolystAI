"""Dataset endpoints — upload, list, get, delete."""

import json
import uuid
from pathlib import Path

import aiofiles
import pandas as pd
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.models.dataset import Dataset
from app.models.user import User
from app.schemas.dataset import DatasetResponse, DatasetUploadResponse

router = APIRouter(prefix="/datasets", tags=["datasets"])


@router.post("/upload", response_model=DatasetUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_dataset(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Validate extension
    allowed = {".csv", ".xlsx", ".xls", ".json"}
    ext = Path(file.filename or "").suffix.lower()
    if ext not in allowed:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext}")

    # Validate size
    max_bytes = settings.max_upload_mb * 1024 * 1024
    content = await file.read()
    if len(content) > max_bytes:
        raise HTTPException(status_code=400, detail=f"File exceeds {settings.max_upload_mb}MB limit")

    # Save to disk
    upload_dir = settings.upload_dir / str(current_user.id)
    upload_dir.mkdir(parents=True, exist_ok=True)
    file_id = str(uuid.uuid4())
    file_path = upload_dir / f"{file_id}{ext}"
    async with aiofiles.open(file_path, "wb") as f:
        await f.write(content)

    # Parse basic metadata
    row_count = None
    col_count = None
    columns_json = None
    try:
        if ext == ".csv":
            df = pd.read_csv(file_path)
        elif ext in (".xlsx", ".xls"):
            df = pd.read_excel(file_path)
        elif ext == ".json":
            df = pd.read_json(file_path)
        else:
            df = None

        if df is not None:
            row_count = len(df)
            col_count = len(df.columns)
            columns_json = json.dumps(
                [{"name": c, "dtype": str(df[c].dtype)} for c in df.columns]
            )
    except Exception:
        pass  # metadata extraction is best-effort

    # Create DB record
    dataset = Dataset(
        owner_id=current_user.id,
        name=Path(file.filename or "dataset").stem,
        original_filename=file.filename or "unknown",
        file_path=str(file_path),
        file_size_bytes=len(content),
        mime_type=file.content_type or "application/octet-stream",
        row_count=row_count,
        column_count=col_count,
        columns_json=columns_json,
        status="ready" if row_count else "uploaded",
    )
    db.add(dataset)
    await db.commit()
    await db.refresh(dataset)

    return DatasetUploadResponse(id=str(dataset.id), name=dataset.name, status=dataset.status)


@router.get("/", response_model=list[DatasetResponse])
async def list_datasets(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Dataset).where(Dataset.owner_id == current_user.id).order_by(Dataset.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{dataset_id}", response_model=DatasetResponse)
async def get_dataset(
    dataset_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Dataset).where(Dataset.id == dataset_id, Dataset.owner_id == current_user.id)
    )
    dataset = result.scalar_one_or_none()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset


@router.delete("/{dataset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_dataset(
    dataset_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Dataset).where(Dataset.id == dataset_id, Dataset.owner_id == current_user.id)
    )
    dataset = result.scalar_one_or_none()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    # Delete file from disk
    file_path = Path(dataset.file_path)
    if file_path.exists():
        file_path.unlink()

    await db.delete(dataset)
    await db.commit()
