"""Database initialization script for Pegorion Platform."""
import os
import sys
import uuid
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from .config import settings
from .database import Base

# Import all models
from ..models import (
    Organization, User, Role, Permission,
    Property, TowerSite, Equipment, Carrier,
    Landlord, Lease, Contract, Clause,
    Document, DocumentPage, AiRun, AuditEvent
)
from ..models.operations import Workflow, Task, Approval
from ..models.governance import AuditEvent, AccessLog

def init_database():
    """Initialize database with base tables and seed data."""
    engine = create_engine(settings.DATABASE_URL)

    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully")

    return engine

def seed_demo_data():
    """Add demo data for initial testing."""
    from .database import SessionLocal

    db = SessionLocal()

    try:
        # Create organization
        org = Organization(
            id=str(uuid.uuid4()),
            name="Demo Organization",
            logo_url=None
        )
        db.add(org)
        db.commit()
        db.refresh(org)

        # Create admin user
        from ..security import get_password_hash
        admin = User(
            id=str(uuid.uuid4()),
            organization_id=org.id,
            email="admin@example.com",
            full_name="Admin User",
            hashed_password=get_password_hash("admin123"),
            role="admin"
        )
        db.add(admin)
        db.commit()

        # Create demo property
        prop = Property(
            id=str(uuid.uuid4()),
            name="Dallas Metro Site",
            address="123 Telecom Drive, Dallas, TX",
            city="Dallas",
            state="TX",
            zip_code="75201",
            latitude=32.7767,
            longitude=-96.7970
        )
        db.add(prop)
        db.commit()
        db.refresh(prop)

        # Create demo tower site
        tower = TowerSite(
            id=str(uuid.uuid4()),
            property_id=prop.id,
            site_id_code="VB-TOWER-001",
            site_name="Site Alpha",
            latitude=32.7770,
            longitude=-96.7975,
            status="active"
        )
        db.add(tower)
        db.commit()

        # Create demo carriers
        carrier = Carrier(
            id=str(uuid.uuid4()),
            name="Verizon Wireless",
            mno_code="VZ",
            logo_url=None
        )
        db.add(carrier)
        db.commit()

        # Create carrier relationship
        car_rel = CarrierRelationship(
            id=str(uuid.uuid4()),
            tower_site_id=tower.id,
            carrier_id=carrier.id,
            relationship_type="tenant",
            status="active"
        )
        db.add(car_rel)
        db.commit()

        print(f"Demo data created:")
        print(f"  Organization: {org.name} ({org.id})")
        print(f"  Admin User: {admin.email}")
        print(f"  Property: {prop.name}")
        print(f"  Tower: {tower.site_code}")
        print(f"  Carrier: {carrier.name}")

    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing Pegorion database...")
    init_database()
    print("\nSeeding demo data...")
    seed_demo_data()
    print("\nDatabase initialization complete!")