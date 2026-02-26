"""Dataset model — tracks uploaded files and their metadata."""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class Dataset(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "datasets"

    owner_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(255))
    original_filename: Mapped[str] = mapped_column(String(500))
    file_path: Mapped[str] = mapped_column(Text)
    file_size_bytes: Mapped[int] = mapped_column(Integer)
    mime_type: Mapped[str] = mapped_column(String(100))
    row_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    column_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    columns_json: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON string of column metadata
    status: Mapped[str] = mapped_column(String(30), default="uploaded")  # uploaded | processing | ready | error
    industry_hint: Mapped[str | None] = mapped_column(String(100), nullable=True)
    ai_summary: Mapped[str | None] = mapped_column(Text, nullable=True)

    # relationships
    owner: Mapped["User"] = relationship(back_populates="datasets")  # type: ignore[name-defined]
    analyses: Mapped[list["Analysis"]] = relationship(back_populates="dataset", lazy="selectin")  # type: ignore[name-defined]
