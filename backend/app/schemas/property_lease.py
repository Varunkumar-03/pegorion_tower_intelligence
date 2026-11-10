from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class LandlordBase(BaseModel):
    name: str
    address: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class Landlord(LandlordBase):
    id: str

    class Config:
        from_attributes = True

class LeaseBase(BaseModel):
    lease_number: str
    property_id: str
    landlord_id: str
    term_months: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    annual_rent: Optional[float] = None
    rent_escalation_pct: Optional[float] = None
    status: Optional[str] = "active"

class Lease(LeaseBase):
    id: str
    organization_id: Optional[str] = None

    class Config:
        from_attributes = True

class ObligationBase(BaseModel):
    description: str
    obligation_type: Optional[str] = None
    due_date: Optional[datetime] = None
    is_met: bool = False

class Obligation(ObligationBase):
    id: str
    lease_id: str

    class Config:
        from_attributes = True

class AmendmentBase(BaseModel):
    lease_id: str
    amendment_number: int
    title: Optional[str] = None

class Amendment(AmendmentBase):
    id: str
    effective_date: Optional[datetime] = None

    class Config:
        from_attributes = True

class DeadlineBase(BaseModel):
    title: str
    due_date: Optional[datetime] = None
    is_urgent: bool = False

class Deadline(DeadlineBase):
    id: str
    lease_id: str

    class Config:
        from_attributes = True

class LeasePartyBase(BaseModel):
    lease_id: str
    party_type: str
    entity_name: str
    role_description: Optional[str] = None

class LeaseParty(LeasePartyBase):
    id: str

    class Config:
        from_attributes = True

class LeaseVersionBase(BaseModel):
    lease_id: str
    version_number: int
    amendment_number: Optional[int] = None
    effective_date: Optional[datetime] = None
    document_id: Optional[str] = None

class LeaseVersion(LeaseVersionBase):
    id: str

    class Config:
        from_attributes = True

class OwnershipRecordBase(BaseModel):
    property_id: str
    landlord_id: str
    ownership_pct: Optional[float] = None
    start_date: Optional[datetime] = None

class OwnershipRecord(OwnershipRecordBase):
    id: str

    class Config:
        from_attributes = True