"""Create initial schema

Revision ID: 20261107_0001
Revises:
Create Date: 2026-11-07 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
import uuid

def generate_uuid():
    return str(uuid.uuid4())

# revision identifiers, used by Alembic.
revision = '20261107_0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Organizations
    op.create_table('organizations',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('logo_url', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'))
    )

    # Users
    op.create_table('users',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('organization_id', sa.String(), sa.ForeignKey('organizations.id')),
        sa.Column('email', sa.String(), unique=True, nullable=False),
        sa.Column('full_name', sa.String(), nullable=True),
        sa.Column('hashed_password', sa.String()),
        sa.Column('is_active', sa.Boolean(), server_default=sa.text('true')),
        sa.Column('role', sa.String(), server_default=sa.text("'user'")),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'))
    )

    # Roles
    op.create_table('roles',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True)
    )

    # Permissions
    op.create_table('permissions',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('resource', sa.String()),
        sa.Column('action', sa.String())
    )

    # User-Roles association
    op.create_table('user_roles',
        sa.Column('user_id', sa.String(), sa.ForeignKey('users.id'), primary_key=True),
        sa.Column('role_id', sa.String(), sa.ForeignKey('roles.id'), primary_key=True)
    )

    # Role-Permissions association
    op.create_table('role_permissions',
        sa.Column('role_id', sa.String(), sa.ForeignKey('roles.id'), primary_key=True),
        sa.Column('permission_id', sa.String(), sa.ForeignKey('permissions.id'), primary_key=True)
    )

    # Properties
    op.create_table('properties',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('address', sa.String(), nullable=True),
        sa.Column('city', sa.String(), nullable=True),
        sa.Column('state', sa.String(), nullable=True),
        sa.Column('zip_code', sa.String(), nullable=True),
        sa.Column('latitude', sa.Float(), nullable=True),
        sa.Column('longitude', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'))
    )

    # Tower Sites
    op.create_table('tower_sites',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('property_id', sa.String(), sa.ForeignKey('properties.id')),
        sa.Column('site_id_code', sa.String(), unique=True, nullable=False),
        sa.Column('site_name', sa.String(), nullable=True),
        sa.Column('latitude', sa.Float(), nullable=True),
        sa.Column('longitude', sa.Float(), nullable=True),
        sa.Column('status', sa.String(), server_default=sa.text("'active'")),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'))
    )

    # Equipment
    op.create_table('equipment',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('tower_site_id', sa.String(), sa.ForeignKey('tower_sites.id')),
        sa.Column('manufacturer', sa.String(), nullable=True),
        sa.Column('model', sa.String(), nullable=True),
        sa.Column('serial_number', sa.String(), nullable=True),
        sa.Column('capacity_kw', sa.Float(), nullable=True),
        sa.Column('installed_date', sa.DateTime(), nullable=True)
    )

    # Carriers
    op.create_table('carriers',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('mno_code', sa.String(), unique=True, nullable=True),
        sa.Column('logo_url', sa.String(), nullable=True)
    )

    # Carrier Relationships
    op.create_table('carrier_relationships',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('tower_site_id', sa.String(), sa.ForeignKey('tower_sites.id')),
        sa.Column('carrier_id', sa.String(), sa.ForeignKey('carriers.id')),
        sa.Column('relationship_type', sa.String(), nullable=True),
        sa.Column('start_date', sa.DateTime(), nullable=True),
        sa.Column('end_date', sa.DateTime(), nullable=True),
        sa.Column('status', sa.String(), server_default=sa.text("'active'"))
    )

    # Landlords
    op.create_table('landlords',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('address', sa.String(), nullable=True),
        sa.Column('contact_person', sa.String(), nullable=True),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('phone', sa.String(), nullable=True)
    )

    # Ownership Records
    op.create_table('ownership_records',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('property_id', sa.String(), sa.ForeignKey('properties.id')),
        sa.Column('landlord_id', sa.String(), sa.ForeignKey('landlords.id')),
        sa.Column('ownership_pct', sa.Float(), nullable=True),
        sa.Column('start_date', sa.DateTime(), nullable=True)
    )

    # Leases
    op.create_table('leases',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('property_id', sa.String(), sa.ForeignKey('properties.id')),
        sa.Column('landlord_id', sa.String(), sa.ForeignKey('landlords.id')),
        sa.Column('lease_number', sa.String(), unique=True, nullable=False),
        sa.Column('term_months', sa.Integer(), nullable=True),
        sa.Column('start_date', sa.DateTime(), nullable=True),
        sa.Column('end_date', sa.DateTime(), nullable=True),
        sa.Column('annual_rent', sa.Float(), nullable=True),
        sa.Column('rent_escalation_pct', sa.Float(), nullable=True),
        sa.Column('status', sa.String(), server_default=sa.text("'active'"))
    )

    # Contracts
    op.create_table('contracts',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('lease_id', sa.String(), sa.ForeignKey('leases.id')),
        sa.Column('contract_number', sa.String(), unique=True, nullable=False),
        sa.Column('contract_type', sa.String(), nullable=False),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('status', sa.String(), server_default=sa.text("'draft'")),
        sa.Column('signed_date', sa.DateTime(), nullable=True),
        sa.Column('document_id', sa.String(), nullable=True)
    )

    # Clauses
    op.create_table('clauses',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('contract_id', sa.String(), sa.ForeignKey('contracts.id')),
        sa.Column('clause_number', sa.String(), nullable=True),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('page_number', sa.Integer(), nullable=True),
        sa.Column('start_offset', sa.Integer(), nullable=True),
        sa.Column('end_offset', sa.Integer(), nullable=True)
    )

    # Playbooks
    op.create_table('playbooks',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('domain', sa.String(), nullable=True)
    )

    # Playbook Rules
    op.create_table('playbook_rules',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('playbook_id', sa.String(), sa.ForeignKey('playbooks.id')),
        sa.Column('rule_name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('condition', sa.String(), nullable=True),
        sa.Column('action', sa.String(), nullable=True)
    )

    # Contract Reviews
    op.create_table('contract_reviews',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('contract_id', sa.String(), sa.ForeignKey('contracts.id')),
        sa.Column('reviewer_id', sa.String(), nullable=True),
        sa.Column('status', sa.String(), server_default=sa.text("'in_progress'")),
        sa.Column('reviewed_date', sa.DateTime(), nullable=True),
        sa.Column('summary', sa.Text(), nullable=True)
    )

    # Review Findings
    op.create_table('review_findings',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('contract_review_id', sa.String(), sa.ForeignKey('contract_reviews.id')),
        sa.Column('clause_id', sa.String(), sa.ForeignKey('clauses.id')),
        sa.Column('finding_type', sa.String(), nullable=True),
        sa.Column('severity', sa.String(), server_default=sa.text("'medium'")),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('source_document_ref', sa.String(), nullable=True)
    )

    # Legal Matters
    op.create_table('legal_matters',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('organization_id', sa.String()),
        sa.Column('matter_number', sa.String(), unique=True, nullable=True),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('matter_type', sa.String(), nullable=True),
        sa.Column('status', sa.String(), server_default=sa.text("'open'")),
        sa.Column('priority', sa.String(), server_default=sa.text("'medium'")),
        sa.Column('opened_date', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('closed_date', sa.DateTime(), nullable=True)
    )

    # Case Events
    op.create_table('case_events',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('matter_id', sa.String(), sa.ForeignKey('legal_matters.id')),
        sa.Column('event_type', sa.String(), nullable=True),
        sa.Column('event_date', sa.DateTime(), nullable=True),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True)
    )

    # Workflows
    op.create_table('workflows',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('workflow_type', sa.String(), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default=sa.text('true'))
    )

    # Workflow Runs
    op.create_table('workflow_runs',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('workflow_id', sa.String(), sa.ForeignKey('workflows.id')),
        sa.Column('status', sa.String(), server_default=sa.text("'pending'")),
        sa.Column('started_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('assigned_to', sa.String(), nullable=True),
        sa.Column('tower_site_id', sa.String(), nullable=True)
    )

    # Tasks
    op.create_table('tasks',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('status', sa.String(), server_default=sa.text("'pending'")),
        sa.Column('priority', sa.String(), server_default=sa.text("'normal'")),
        sa.Column('assigned_to', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('due_date', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('workflow_run_id', sa.String(), sa.ForeignKey('workflow_runs.id'), nullable=True)
    )

    # Approvals
    op.create_table('approvals',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('task_id', sa.String(), sa.ForeignKey('tasks.id')),
        sa.Column('approver_id', sa.String(), nullable=True),
        sa.Column('status', sa.String(), server_default=sa.text("'pending'")),
        sa.Column('approved_at', sa.DateTime(), nullable=True),
        sa.Column('comments', sa.Text(), nullable=True)
    )

    # Notifications
    op.create_table('notifications',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('user_id', sa.String()),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('is_read', sa.Boolean(), server_default=sa.text('false')),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('source', sa.String(), nullable=True)
    )

    # Documents
    op.create_table('documents',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('filename', sa.String(), nullable=False),
        sa.Column('original_filename', sa.String(), nullable=True),
        sa.Column('file_size', sa.Integer(), nullable=True),
        sa.Column('mime_type', sa.String(), nullable=True),
        sa.Column('storage_path', sa.String(), nullable=False),
        sa.Column('uploaded_by', sa.String(), nullable=True),
        sa.Column('tenant_id', sa.String(), nullable=True),
        sa.Column('uploaded_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('status', sa.String(), server_default=sa.text("'uploaded'")),
        sa.Column('document_type', sa.String(), nullable=True)
    )

    # Document Versions
    op.create_table('document_versions',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('document_id', sa.String(), sa.ForeignKey('documents.id')),
        sa.Column('version_number', sa.Integer(), nullable=True),
        sa.Column('storage_path', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('created_by', sa.String(), nullable=True)
    )

    # Document Pages
    op.create_table('document_pages',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('document_id', sa.String(), sa.ForeignKey('documents.id')),
        sa.Column('page_number', sa.Integer(), nullable=True),
        sa.Column('text', sa.Text(), nullable=True),
        sa.Column('image_path', sa.String(), nullable=True)
    )

    # AI Runs
    op.create_table('ai_runs',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('user_id', sa.String(), nullable=True),
        sa.Column('prompt', sa.Text(), nullable=False),
        sa.Column('response', sa.Text(), nullable=True),
        sa.Column('model', sa.String(), nullable=True),
        sa.Column('input_tokens', sa.Integer(), nullable=True),
        sa.Column('output_tokens', sa.Integer(), nullable=True),
        sa.Column('latency_ms', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('citations', sa.JSON(), nullable=True)
    )

    # Audit Events
    op.create_table('audit_events',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('user_id', sa.String(), nullable=True),
        sa.Column('action', sa.String(), nullable=False),
        sa.Column('resource_type', sa.String(), nullable=True),
        sa.Column('resource_id', sa.String(), nullable=True),
        sa.Column('ip_address', sa.String(), nullable=True),
        sa.Column('user_agent', sa.Text(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('details', sa.JSON(), nullable=True)
    )


def downgrade():
    op.drop_table('audit_events')
    op.drop_table('ai_runs')
    op.drop_table('documents')
    op.drop_table('notifications')
    op.drop_table('approvals')
    op.drop_table('tasks')
    op.drop_table('workflow_runs')
    op.drop_table('workflows')
    op.drop_table('case_events')
    op.drop_table('legal_matters')
    op.drop_table('review_findings')
    op.drop_table('contract_reviews')
    op.drop_table('playbook_rules')
    op.drop_table('playbooks')
    op.drop_table('clauses')
    op.drop_table('contracts')
    op.drop_table('leases')
    op.drop_table('ownership_records')
    op.drop_table('landlords')
    op.drop_table('carrier_relationships')
    op.drop_table('carriers')
    op.drop_table('equipment')
    op.drop_table('tower_sites')
    op.drop_table('properties')
    op.drop_table('role_permissions')
    op.drop_table('user_roles')
    op.drop_table('permissions')
    op.drop_table('roles')
    op.drop_table('users')
    op.drop_table('organizations')