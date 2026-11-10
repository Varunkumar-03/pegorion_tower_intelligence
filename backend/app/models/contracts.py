from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from .base_class import Base

class Contract(Base):
    __tablename__ = "contracts"
    id = Column(String, primary_key=True)
    lease_id = Column(String, ForeignKey("leases.id"))
    contract_number = Column(String, unique=True)
    contract_type = Column(String)  # master_lease, ground_lease, colocation_agreement
    title = Column(String)
    status = Column(String, default="draft")
    signed_date = Column(DateTime)
    document_id = Column(String)

class Clause(Base):
    __tablename__ = "clauses"
    id = Column(String, primary_key=True)
    contract_id = Column(String, ForeignKey("contracts.id"))
    clause_number = Column(String)
    title = Column(String)
    content = Column(Text)
    page_number = Column(Integer)
    start_offset = Column(Integer)
    end_offset = Column(Integer)

class Playbook(Base):
    __tablename__ = "playbooks"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    domain = Column(String)  # legal, compliance, lease_review

class PlaybookRule(Base):
    __tablename__ = "playbook_rules"
    id = Column(String, primary_key=True)
    playbook_id = Column(String, ForeignKey("playbooks.id"))
    rule_name = Column(String)
    description = Column(Text)
    condition = Column(String)
    action = Column(String)

class ContractReview(Base):
    __tablename__ = "contract_reviews"
    id = Column(String, primary_key=True)
    contract_id = Column(String, ForeignKey("contracts.id"))
    reviewer_id = Column(String)
    status = Column(String, default="in_progress")
    reviewed_date = Column(DateTime)
    summary = Column(Text)

class ReviewFinding(Base):
    __tablename__ = "review_findings"
    id = Column(String, primary_key=True)
    contract_review_id = Column(String, ForeignKey("contract_reviews.id"))
    clause_id = Column(String, ForeignKey("clauses.id"))
    finding_type = Column(String)  # deviation, concern, note
    severity = Column(String, default="medium")
    title = Column(String)
    description = Column(Text)
    source_document_ref = Column(String)