from typing import List, Optional
from uuid import uuid4
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.identity import User
from ..models.legal import LegalMatter, MatterParty, CaseEvent
from ..models.documents import Document
from ..schemas.legal import LegalMatter as LegalMatterSchema
from ..security import get_current_user

router = APIRouter(prefix="/legal", tags=["legal"])

@router.get("/matters", response_model=List[LegalMatterSchema])
def get_legal_matters(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get list of legal matters."""
    query = db.query(LegalMatter)
    if status:
        query = query.filter(LegalMatter.status == status)
    return query.offset(skip).limit(limit).all()

@router.get("/matters/{matter_id}", response_model=LegalMatterSchema)
def get_legal_matter(matter_id: str, db: Session = Depends(get_db)):
    """Get legal matter by ID."""
    matter = db.query(LegalMatter).filter(LegalMatter.id == matter_id).first()
    if not matter:
        raise HTTPException(status_code=404, detail="Legal matter not found")
    return matter

@router.get("/matters/{matter_id}/events", response_model=List[dict])
def get_matter_events(matter_id: str, db: Session = Depends(get_db)):
    """Get case events for a matter."""
    matter = db.query(LegalMatter).filter(LegalMatter.id == matter_id).first()
    if not matter:
        raise HTTPException(status_code=404, detail="Legal matter not found")
    events = db.query(CaseEvent).filter(CaseEvent.matter_id == matter_id).all()
    return [{"id": e.id, "event_type": e.event_type, "event_date": e.event_date, "title": e.title} for e in events]

@router.get("/matters/{matter_id}/documents", response_model=List[dict])
def get_matter_documents(matter_id: str, db: Session = Depends(get_db)):
    """Get documents associated with a matter."""
    matter = db.query(LegalMatter).filter(LegalMatter.id == matter_id).first()
    if not matter:
        raise HTTPException(status_code=404, detail="Legal matter not found")
    return db.query(Document).filter(Document.tenant_id == matter_id).all()

@router.post("/matters", response_model=LegalMatterSchema, status_code=status.HTTP_201_CREATED)
def create_legal_matter(matter_in: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create a new legal matter."""
    matter = LegalMatter(
        id=str(uuid4()),
        title=matter_in.get("title"),
        matter_type=matter_in.get("matter_type", "review"),
        status=matter_in.get("status", "open"),
        priority=matter_in.get("priority", "medium")
    )
    db.add(matter)
    db.commit()
    db.refresh(matter)
    return matter

@router.put("/matters/{matter_id}", response_model=LegalMatterSchema)
def update_legal_matter(matter_id: str, matter_in: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Update an existing legal matter."""
    matter = db.query(LegalMatter).filter(LegalMatter.id == matter_id).first()
    if not matter:
        raise HTTPException(status_code=404, detail="Legal matter not found")
    for key, value in matter_in.items():
        if hasattr(matter, key) and value is not None:
            setattr(matter, key, value)
    db.commit()
    db.refresh(matter)
    return matter

@router.delete("/matters/{matter_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_legal_matter(matter_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete a legal matter."""
    matter = db.query(LegalMatter).filter(LegalMatter.id == matter_id).first()
    if not matter:
        raise HTTPException(status_code=404, detail="Legal matter not found")
    db.delete(matter)
    db.commit()
    return None
