from typing import List, Optional
from uuid import uuid4
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import String
from ..core.database import get_db
from ..models.identity import User
from ..models.property_lease import Lease, Landlord, Obligation, Deadline, Amendment
from ..models.infrastructure import TowerSite, Property
from ..schemas.property_lease import Lease as LeaseSchema, Landlord as LandlordSchema
from ..security import get_current_user

router = APIRouter(prefix="/leases", tags=["leases"])

@router.get("/", response_model=List[LeaseSchema])
def get_leases(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    search: Optional[str] = Query(None, alias="q"),
    db: Session = Depends(get_db)
):
    """Get list of leases with optional filtering."""
    query = db.query(Lease)
    if status:
        query = query.filter(Lease.status == status)
    if search:
        query = query.filter(Lease.lease_number.contains(search) | Lease.end_date.cast(String).contains(search))
    return query.offset(skip).limit(limit).all()

@router.get("/{lease_id}", response_model=LeaseSchema)
def get_lease(lease_id: str, db: Session = Depends(get_db)):
    """Get lease by ID."""
    lease = db.query(Lease).filter(Lease.id == lease_id).first()
    if not lease:
        raise HTTPException(status_code=404, detail="Lease not found")
    return lease

@router.get("/{lease_id}/obligations", response_model=List[dict])
def get_lease_obligations(lease_id: str, db: Session = Depends(get_db)):
    """Get obligations for a lease."""
    lease = db.query(Lease).filter(Lease.id == lease_id).first()
    if not lease:
        raise HTTPException(status_code=404, detail="Lease not found")
    obligations = db.query(Obligation).filter(Obligation.lease_id == lease_id).all()
    return [{"id": o.id, "description": o.description, "due_date": o.due_date, "is_met": o.is_met} for o in obligations]

@router.get("/{lease_id}/landlord", response_model=LandlordSchema)
def get_lease_landlord(lease_id: str, db: Session = Depends(get_db)):
    """Get landlord for a lease."""
    lease = db.query(Lease).filter(Lease.id == lease_id).first()
    if not lease:
        raise HTTPException(status_code=404, detail="Lease not found")
    landlord = db.query(Landlord).filter(Landlord.id == lease.landlord_id).first()
    return landlord

@router.post("/", response_model=LeaseSchema, status_code=status.HTTP_201_CREATED)
def create_lease(lease_in: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create a new lease."""
    lease = Lease(**lease_in, id=str(uuid4()))
    db.add(lease)
    db.commit()
    db.refresh(lease)
    return lease

@router.put("/{lease_id}", response_model=LeaseSchema)
def update_lease(lease_id: str, lease_in: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Update an existing lease."""
    lease = db.query(Lease).filter(Lease.id == lease_id).first()
    if not lease:
        raise HTTPException(status_code=404, detail="Lease not found")
    for key, value in lease_in.items():
        if hasattr(lease, key) and value is not None:
            setattr(lease, key, value)
    db.commit()
    db.refresh(lease)
    return lease

@router.delete("/{lease_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lease(lease_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete a lease."""
    lease = db.query(Lease).filter(Lease.id == lease_id).first()
    if not lease:
        raise HTTPException(status_code=404, detail="Lease not found")
    db.delete(lease)
    db.commit()
    return None

@router.get("/search/expiring", response_model=List[LeaseSchema])
def get_expiring_leases(days: int = 90, db: Session = Depends(get_db)):
    """Get leases expiring within X days."""
    cutoff = datetime.utcnow() + timedelta(days=days)
    return db.query(Lease).filter(Lease.end_date <= cutoff).all()