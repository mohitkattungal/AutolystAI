"""Team model — workspace for collaborative users."""

import uuid

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class Team(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "teams"

    name: Mapped[str] = mapped_column(String(255))  # workspace name
    company_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    industry: Mapped[str | None] = mapped_column(String(100), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    # The user who created this team
    owner_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE")
    )

    # ── Relationships ──
    owner: Mapped["User"] = relationship(  # type: ignore[name-defined]
        "User", back_populates="owned_teams", foreign_keys=[owner_id]
    )
    members: Mapped[list["User"]] = relationship(  # type: ignore[name-defined]
        "User", back_populates="team", foreign_keys="User.team_id", lazy="selectin"
    )
    invitations: Mapped[list["TeamInvitation"]] = relationship(
        back_populates="team", lazy="selectin"
    )


class TeamInvitation(UUIDMixin, TimestampMixin, Base):
    """Pending invitations to join a team."""

    __tablename__ = "team_invitations"

    team_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("teams.id", ondelete="CASCADE")
    )
    email: Mapped[str] = mapped_column(String(255), index=True)
    role: Mapped[str] = mapped_column(String(20), default="analyst")  # admin | analyst | viewer
    status: Mapped[str] = mapped_column(String(20), default="pending")  # pending | accepted | declined
    invited_by: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE")
    )

    # ── Relationships ──
    team: Mapped["Team"] = relationship(back_populates="invitations")
