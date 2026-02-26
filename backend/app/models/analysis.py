"""Analysis model — stores results of AI analysis runs."""

import uuid

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class Analysis(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "analyses"

    owner_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    dataset_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("datasets.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(500), default="Untitled Analysis")
    analysis_type: Mapped[str] = mapped_column(String(50))  # overview | segment | prediction | custom
    status: Mapped[str] = mapped_column(String(30), default="pending")  # pending | running | completed | failed
    result_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    ai_insights: Mapped[str | None] = mapped_column(Text, nullable=True)
    chart_configs: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON

    # relationships
    owner: Mapped["User"] = relationship(back_populates="analyses")  # type: ignore[name-defined]
    dataset: Mapped["Dataset"] = relationship(back_populates="analyses")  # type: ignore[name-defined]
