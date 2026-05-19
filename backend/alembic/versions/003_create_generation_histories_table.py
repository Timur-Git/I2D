"""Create generation_histories table.

Revision ID: 003_create_generation_histories_table
Revises: 002_create_file_uploads_table
Create Date: 2026-05-15
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "003_create_generation_histories_table"
down_revision: Union[str, None] = "002_create_file_uploads_table"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "generation_histories",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("image_url", sa.String(length=1000), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("is_edited", sa.Boolean(), server_default=sa.text("false"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("modified_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_gen_history_user_id", "generation_histories", ["user_id"])
    op.create_index("ix_gen_history_created_at", "generation_histories", ["created_at"])
    op.create_index("ix_gen_history_modified_at", "generation_histories", ["modified_at"])


def downgrade() -> None:
    op.drop_index("ix_gen_history_modified_at", table_name="generation_histories")
    op.drop_index("ix_gen_history_created_at", table_name="generation_histories")
    op.drop_index("ix_gen_history_user_id", table_name="generation_histories")
    op.drop_table("generation_histories")
