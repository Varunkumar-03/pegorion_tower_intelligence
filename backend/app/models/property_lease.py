from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, Integer, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from .base_class import Base

class Landlord(Base):
    __tablename__ = "landlords"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    address = Column(String)
    contact_person = Column(String)
    email = Column(String)
    phone = Column(String)

class OwnershipRecord(Base):
    __tablename__ = "ownership_records"
    id = Column(String, primary_key=True)
    property_id = Column(String, ForeignKey("properties.id"))
    landlord_id = Column(String, ForeignKey("landlords.id"))
    ownership_pct = Column(Float)
    start_date = Column(DateTime)

class Lease(Base):
    __tablename__ = "leases"
    id = Column(String, primary_key=True)
    property_id = Column(String, ForeignKey("properties.id"))
    landlord_id = Column(String, ForeignKey("landlords.id"))
    lease_number = Column(String, unique=True)
    term_months = Column(Integer)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    annual_rent = Column(Float)
    rent_escalation_pct = Column(Float)
    status = Column(String, default="active")
    organization_id = Column(String)

class LeaseParty(Base):
    __tablename__ = "lease_parties"
    id = Column(String, primary_key=True)
    lease_id = Column(String, ForeignKey("leases.id"))
    party_type = Column(String)  # tenant, landlord, subtenant
    entity_name = Column(String)
    role_description = Column(String)

class LeaseVersion(Base):
    __tablename__ = "lease_versions"
    id = Column(String, primary_key=True)
    lease_id = Column(String, ForeignKey("leases.id"))
    version_number = Column(Integer)
    amendment_number = Column(Integer)
    effective_date = Column(DateTime)
    document_id = Column(String)

class Amendment(Base):
    __tablename__ = "amendments"
    id = Column(String, primary_key=True)
    lease_id = Column(String, ForeignKey("leases.id"))
    amendment_number = Column(Integer)
    effective_date = Column(DateTime)
    document_id = Column(String)
    title = Column(String)

class Obligation(Base):
    __tablename__ = "obligations"
    id = Column(String, primary_key=True)
    lease_id = Column(String, ForeignKey("leases.id"))
    description = Column(Text)
    obligation_type = Column(String)
    due_date = Column(DateTime)
    is_met = Column(Boolean, default=False)

class Deadline(Base):
    __tablename__ = "deadlines"
    id = Column(String, primary_key=True)
    lease_id = Column(String, ForeignKey("leases.id"))
    title = Column(String)
    due_date = Column(DateTime)
    is_urgent = Column(Boolean, default=False)
