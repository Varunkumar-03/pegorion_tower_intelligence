from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class LegalMatterBase(BaseModel):
    title: str
    matter_type: Optional[str] = None
    status: Optional[str] = "open"
    priority: Optional[str] = "medium"
    organization_id: Optional[str] = None

class LegalMatter(LegalMatterBase):
    id: str
    matter_number: Optional[str] = None
    opened_date: Optional[datetime] = None
    closed_date: Optional[datetime] = None

    class Config:
        from_attributes = True

class CaseEventBase(BaseModel):
    event_type: str
    title: str
    event_date: Optional[datetime] = None
    description: Optional[str] = None

class CaseEvent(CaseEventBase):
    id: str
    matter_id: str

    class Config:
        from_attributes = True

class LegalSource(BaseModel):
    id: str
    name: str
    jurisdiction: Optional[str] = None
    source_type: Optional[str] = None
    url: Optional[str] = None

    class Config:
        from_attributes = True

class LegalCitationBase(BaseModel):
    matter_id: str
    source_id: str
    citation_text: str
    page_number: Optional[int] = None

class LegalCitation(LegalCitationBase):
    id: str

    class Config:
        from_attributes = True

class LegalDraftBase(BaseModel):
    title: str
    content: Optional[str] = None
    version: int = 1
    status: Optional[str] = "draft"
    matter_id: Optional[str] = None
    created_by: Optional[str] = None

class LegalDraft(LegalDraftBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class MatterPartyBase(BaseModel):
    matter_id: str
    party_name: str
    party_type: Optional[str] = None
    role_description: Optional[str] = None

class MatterParty(MatterPartyBase):
    id: str

    class Config:
        from_attributes = True

class MatterDocumentBase(BaseModel):
    matter_id: str
    document_id: str
    document_type: Optional[str] = None
    filed_date: Optional[datetime] = None

class MatterDocument(MatterDocumentBase):
    id: str

    class Config:
        from_attributes = True