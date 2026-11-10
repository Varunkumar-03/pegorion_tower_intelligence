"""Contracts router with lease and contract management."""
from typing import List, Optional
from uuid import uuid4
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.identity import User
from ..models.property_lease import Lease, Obligation
from ..models.contracts import Contract, Clause, ContractReview, ReviewFinding, Playbook
from ..schemas.property_lease import Lease as LeaseSchema
from ..security import get_current_user

router = APIRouter(prefix="/contracts", tags=["contracts"])

@router.get("/contracts", response_model=List[dict])
def get_contracts(
    skip: int = 0,
    limit: int = 100,
    contract_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get list of contracts."""
    query = db.query(Contract)
    if contract_type:
        query = query.filter(Contract.contract_type == contract_type)
    return query.offset(skip).limit(limit).all()

@router.get("/contracts/{contract_id}", response_model=dict)
def get_contract(contract_id: str, db: Session = Depends(get_db)):
    """Get contract by ID."""
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    return contract

@router.get("/contracts/{contract_id}/clauses", response_model=List[dict])
def get_contract_clauses(contract_id: str, db: Session = Depends(get_db)):
    """Get clauses for a contract."""
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    clauses = db.query(Clause).filter(Clause.contract_id == contract_id).all()
    return [{"id": c.id, "clause_number": c.clause_number, "title": c.title, "page_number": c.page_number} for c in clauses]

@router.get("/contracts/{contract_id}/reviews", response_model=List[dict])
def get_contract_reviews(contract_id: str, db: Session = Depends(get_db)):
    """Get reviews for a contract."""
    reviews = db.query(ContractReview).filter(ContractReview.contract_id == contract_id).all()
    return [{"id": r.id, "status": r.status, "reviewed_date": r.reviewed_date} for r in reviews]

@router.get("/leases/{lease_id}/contracts", response_model=List[dict])
def get_lease_contracts(lease_id: str, db: Session = Depends(get_db)):
    """Get contracts for a lease."""
    contracts = db.query(Contract).filter(Contract.lease_id == lease_id).all()
    return [
        {
            "id": c.id,
            "contract_number": c.contract_number,
            "contract_type": c.contract_type,
            "title": c.title,
            "status": c.status,
            "signed_date": c.signed_date
        }
        for c in contracts
    ]

@router.get("/contracts/search/expiring", response_model=List[dict])
def get_expiring_contracts(
    days: int = 180,
    lease_status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get contracts with expiring leases."""
    from datetime import datetime, timedelta
    cutoff = datetime.utcnow() + timedelta(days=days)
    query = db.query(Lease).join(Contract).filter(Contract.signed_date >= cutoff)
    if lease_status:
        query = query.filter(Lease.status == lease_status)
    leases = query.limit(100).all()
    return [
        {
            "id": l.id,
            "lease_number": l.lease_number,
            "end_date": l.end_date,
            "status": l.status
        }
        for l in leases
    ]

@router.get("/playbooks", response_model=List[dict])
def get_playbooks(
    domain: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get playbooks."""
    query = db.query(Playbook)
    if domain:
        query = query.filter(Playbook.domain == domain)
    playbooks = query.all()
    return [{"id": p.id, "name": p.name, "domain": p.domain} for p in playbooks]