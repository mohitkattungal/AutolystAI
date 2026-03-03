"""initial schema with auth and teams

Revision ID: 0001
Revises: None
Create Date: 2026-02-28
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── Teams table (must come before users due to FK) ──
    op.create_table(
        "teams",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("company_name", sa.String(255), nullable=True),
        sa.Column("industry", sa.String(100), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("owner_id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # ── Users table ──
    op.create_table(
        "users",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("email", sa.String(255), unique=True, index=True, nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), server_default=""),
        sa.Column("avatar_url", sa.Text(), nullable=True),
        sa.Column("account_type", sa.String(20), server_default="individual"),
        sa.Column("role", sa.String(20), server_default="owner"),
        sa.Column("industry", sa.String(100), nullable=True),
        sa.Column("job_title", sa.String(100), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true")),
        sa.Column("onboarding_completed", sa.Boolean(), server_default=sa.text("false")),
        sa.Column("team_id", sa.Uuid(), sa.ForeignKey("teams.id", ondelete="SET NULL"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # ── Add FK from teams.owner_id → users.id (deferred) ──
    op.create_foreign_key(
        "fk_teams_owner_id",
        "teams",
        "users",
        ["owner_id"],
        ["id"],
        ondelete="CASCADE",
    )

    # ── Team invitations ──
    op.create_table(
        "team_invitations",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("team_id", sa.Uuid(), sa.ForeignKey("teams.id", ondelete="CASCADE"), nullable=False),
        sa.Column("email", sa.String(255), index=True, nullable=False),
        sa.Column("role", sa.String(20), server_default="analyst"),
        sa.Column("status", sa.String(20), server_default="pending"),
        sa.Column("invited_by", sa.Uuid(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # ── Datasets ──
    op.create_table(
        "datasets",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("owner_id", sa.Uuid(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("original_filename", sa.String(500), nullable=False),
        sa.Column("file_path", sa.Text(), nullable=False),
        sa.Column("file_size_bytes", sa.Integer(), nullable=False),
        sa.Column("mime_type", sa.String(100), nullable=False),
        sa.Column("row_count", sa.Integer(), nullable=True),
        sa.Column("column_count", sa.Integer(), nullable=True),
        sa.Column("columns_json", sa.Text(), nullable=True),
        sa.Column("status", sa.String(30), server_default="uploaded"),
        sa.Column("industry_hint", sa.String(100), nullable=True),
        sa.Column("ai_summary", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # ── Analyses ──
    op.create_table(
        "analyses",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("owner_id", sa.Uuid(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("dataset_id", sa.Uuid(), sa.ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False),
        sa.Column("title", sa.String(500), server_default="Untitled Analysis"),
        sa.Column("analysis_type", sa.String(50), nullable=False),
        sa.Column("status", sa.String(30), server_default="pending"),
        sa.Column("result_json", sa.Text(), nullable=True),
        sa.Column("ai_insights", sa.Text(), nullable=True),
        sa.Column("chart_configs", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # ── Conversations ──
    op.create_table(
        "conversations",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("owner_id", sa.Uuid(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("dataset_id", sa.Uuid(), sa.ForeignKey("datasets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("title", sa.String(500), server_default="New Chat"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # ── Messages ──
    op.create_table(
        "messages",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("conversation_id", sa.Uuid(), sa.ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("role", sa.String(20), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("chart_config", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("messages")
    op.drop_table("conversations")
    op.drop_table("analyses")
    op.drop_table("datasets")
    op.drop_table("team_invitations")
    op.drop_constraint("fk_teams_owner_id", "teams", type_="foreignkey")
    op.drop_table("users")
    op.drop_table("teams")
