from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class ContractBase(BaseModel):
    contract_number: str
    contract_type: str
    title: Optional[str] = None
    status: Optional[str] = "draft"
    lease_id: Optional[str] = None
    document_id: Optional[str] = None

class Contract(ContractBase):
    id: str

    class Config:
        from_attributes = True

class ClauseBase(BaseModel):
    contract_id: str
    clause_number: Optional[str] = None
    title: Optional[str] = None
    content: Optional[str] = None
    page_number: Optional[int] = None
    start_offset: Optional[int] = None
    end_offset: Optional[int] = None

class Clause(ClauseBase):
    id: str

    class Config:
        from_attributes = True

class PlaybookBase(BaseModel):
    name: str
    description: Optional[str] = None
    domain: Optional[str] = None

class Playbook(PlaybookBase):
    id: str

    class Config:
        from_attributes = True

class PlaybookRuleBase(BaseModel):
    playbook_id: str
    rule_name: str
    description: Optional[str] = None
    condition: Optional[str] = None
    action: Optional[str] = None

class PlaybookRule(PlaybookRuleBase):
    id: str

    class Config:
        from_attributes = True

class ContractReviewBase(BaseModel):
    contract_id: str
    reviewer_id: Optional[str] = None
    status: Optional[str] = "in_progress"
    reviewed_date: Optional[datetime] = None
    summary: Optional[str] = None

class ContractReview(ContractReviewBase):
    id: str

    class Config:
        from_attributes = True

class ReviewFindingBase(BaseModel):
    contract_review_id: str
    clause_id: Optional[str] = None
    finding_type: Optional[str] = None
    severity: Optional[str] = "medium"
    title: Optional[str] = None
    description: Optional[str] = None
    source_document_ref: Optional[str] = None

class ReviewFinding(ReviewFindingBase):
    id: str

    class Config:
        from_attributes = True