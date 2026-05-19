"""Create file_uploads table.

Revision ID: 002_create_file_uploads_table
Revises: 001_create_users_table
Create Date: 2026-05-15
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "002_create_file_uploads_table"
down_revision: Union[str, None] = "001_create_users_table"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "file_uploads",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("original_filename", sa.String(length=255), nullable=False),
        sa.Column("file_url", sa.String(length=1000), nullable=False),
        sa.Column("file_size", sa.Integer(), nullable=False),
        sa.Column("file_type", sa.String(length=50), nullable=False),
        sa.Column("mime_type", sa.String(length=100), nullable=False),
        sa.Column("uploaded_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_file_uploads_user_id", "file_uploads", ["user_id"])
    op.create_index("ix_file_uploads_uploaded_at", "file_uploads", ["uploaded_at"])


def downgrade() -> None:
    op.drop_index("ix_file_uploads_uploaded_at", table_name="file_uploads")
    op.drop_index("ix_file_uploads_user_id", table_name="file_uploads")
    op.drop_table("file_uploads")
