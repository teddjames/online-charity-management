"""Initial migration

Revision ID: 506f3252f530
Revises: 
Create Date: 2025-07-24 13:18:22.657979

"""
from alembic import op
import sqlalchemy as sa
import uuid

# revision identifiers, used by Alembic.
revision = '506f3252f530'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(36), primary_key=True, default=lambda: str(uuid.uuid4())),
        sa.Column('username', sa.String(80), unique=True, nullable=False),
        sa.Column('email', sa.String(120), unique=True, nullable=False),
        sa.Column('password_hash', sa.String(128), nullable=False),
        sa.Column('role', sa.String(20), nullable=False, default='Donor'),
        sa.Column('is_approved', sa.Boolean, default=False),
        sa.Column('two_fa_secret', sa.String(32), nullable=True),
        sa.Column('created_at', sa.DateTime, default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime, default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )

    # Create ngo_profiles table
    op.create_table(
        'ngo_profiles',
        sa.Column('id', sa.String(36), primary_key=True, default=lambda: str(uuid.uuid4())),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id'), unique=True, nullable=False),
        sa.Column('organization_name', sa.String(120), unique=True, nullable=False),
        sa.Column('registration_number', sa.String(80), unique=True, nullable=True),
        sa.Column('contact_person', sa.String(100), nullable=False),
        sa.Column('phone_number', sa.String(20), nullable=True),
        sa.Column('address', sa.String(255), nullable=True),
        sa.Column('website_url', sa.String(255), nullable=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime, default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )

    # Create donor_profiles table
    op.create_table(
        'donor_profiles',
        sa.Column('id', sa.String(36), primary_key=True, default=lambda: str(uuid.uuid4())),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id'), unique=True, nullable=False),
        sa.Column('first_name', sa.String(80), nullable=False),
        sa.Column('last_name', sa.String(80), nullable=False),
        sa.Column('created_at', sa.DateTime, default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime, default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )

    # Create categories table
    op.create_table(
        'categories',
        sa.Column('id', sa.String(36), primary_key=True, default=lambda: str(uuid.uuid4())),
        sa.Column('name', sa.String(100), unique=True, nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime, default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )

    # Create donation_requests table
    op.create_table(
        'donation_requests',
        sa.Column('id', sa.String(36), primary_key=True, default=lambda: str(uuid.uuid4())),
        sa.Column('ngo_id', sa.String(36), sa.ForeignKey('ngo_profiles.id'), nullable=False),
        sa.Column('category_id', sa.String(36), sa.ForeignKey('categories.id'), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text, nullable=False),
        sa.Column('amount_needed', sa.Numeric(10, 2), nullable=False),
        sa.Column('amount_received', sa.Numeric(10, 2), nullable=False, default=0.00),
        sa.Column('image_url', sa.String(255), nullable=True),
        sa.Column('status', sa.String(20), nullable=False, default='Pending'),
        sa.Column('created_at', sa.DateTime, default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime, default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
        sa.Column('approved_by_admin_id', sa.String(36), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('approval_date', sa.DateTime, nullable=True),
    )

    # Create donations table
    op.create_table(
        'donations',
        sa.Column('id', sa.String(36), primary_key=True, default=lambda: str(uuid.uuid4())),
        sa.Column('donor_id', sa.String(36), sa.ForeignKey('donor_profiles.id'), nullable=False),
        sa.Column('donation_request_id', sa.String(36), sa.ForeignKey('donation_requests.id'), nullable=False),
        sa.Column('amount_donated', sa.Numeric(10, 2), nullable=False),
        sa.Column('transaction_id', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime, default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime, default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )


def downgrade():
    op.drop_table('donations')
    op.drop_table('donation_requests')
    op.drop_table('categories')
    op.drop_table('donor_profiles')
    op.drop_table('ngo_profiles')
    op.drop_table('users')
