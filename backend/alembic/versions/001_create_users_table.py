"""Initial schema for users table.

Revision ID: 001_create_users_table
Revises: 
Create Date: 2026-05-15

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001_create_users_table'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create users table."""
    op.create_table(
        'users',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('account_name', sa.String(length=50), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('profile_photo_url', sa.String(length=1000), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default='now()', nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default='now()', nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    
    # Indexes
    op.create_index('ix_users_email', 'users', ['email'])
    op.create_index('ix_users_account_name', 'users', ['account_name'])


def downgrade() -> None:
    """Drop users table."""
    op.drop_table('users')
