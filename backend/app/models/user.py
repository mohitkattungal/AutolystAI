"""User model."""

import uuid

from sqlalchemy import Boolean, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class User(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str] = mapped_column(String(255), default="")
    avatar_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    account_type: Mapped[str] = mapped_column(String(20), default="individual")  # individual | team

    # Role within team: "owner" | "admin" | "analyst" | "viewer"
    # Individual accounts default to "owner"
    role: Mapped[str] = mapped_column(String(20), default="owner")

    industry: Mapped[str | None] = mapped_column(String(100), nullable=True)
    job_title: Mapped[str | None] = mapped_column(String(100), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    onboarding_completed: Mapped[bool] = mapped_column(Boolean, default=False)

    # Team FK — NULL for individual users; set when user belongs to a team
    team_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("teams.id", ondelete="SET NULL"), nullable=True
    )

    # ── Relationships ──
    team: Mapped["Team"] = relationship(  # type: ignore[name-defined]
        "Team", back_populates="members", foreign_keys=[team_id]
    )
    owned_teams: Mapped[list["Team"]] = relationship(  # type: ignore[name-defined]
        "Team", back_populates="owner", foreign_keys="Team.owner_id", lazy="selectin"
    )
    datasets: Mapped[list["Dataset"]] = relationship(back_populates="owner", lazy="selectin")  # type: ignore[name-defined]
    analyses: Mapped[list["Analysis"]] = relationship(back_populates="owner", lazy="selectin")  # type: ignore[name-defined]
