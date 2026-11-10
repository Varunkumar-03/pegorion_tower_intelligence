# Alembic Migrations for Pegorion Platform

## Initial Migration

Run the following to create the initial database schema:

```bash
# Set DATABASE_URL environment variable
export DATABASE_URL="postgresql+psycopg2://postgres:password@localhost:5432/pegorion"

# Create initial migration
alembic revision --autogenerate -m "Create initial schema"

# Apply migration
alembic upgrade head
```

Or use Python API:
```python
from alembic import command
from alembic.config import Config

alembic_config = Config("alembic.ini")
command.upgrade(alembic_config, "head")
```

## Environment Setup

1. PostgreSQL must be running
2. Database `pegorion` must exist
3. User `postgres` with password `password` must have access

## Migration History

The following migrations will be auto-generated based on the models in `app/models/`:

1. **001_create_initial_schema** - All 9 domain groups:
   - identity (organizations, users, teams, roles, permissions)
   - infrastructure (properties, towers, equipment, carriers)
   - property_lease (landlords, leases, amendments, obligations)
   - contracts (contracts, clauses, playbooks)
   - legal (legal matters, case events, citations)
   - operations (workflows, tasks, approvals)
   - documents (documents, pages, chunks, entities)
   - ai (ai_runs, agents, citations)
   - governance (audit_events, access_logs)