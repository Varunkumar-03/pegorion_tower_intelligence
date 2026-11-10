from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from .base_class import Base

class LegalMatter(Base):
    __tablename__ = "legal_matters"
    id = Column(String, primary_key=True)
    organization_id = Column(String, nullable=True)
    matter_number = Column(String, unique=True)
    title = Column(String, nullable=False)
    matter_type = Column(String)  # litigation, compliance, review
    status = Column(String, default="open")
    priority = Column(String, default="medium")
    opened_date = Column(DateTime, default=datetime.utcnow)
    closed_date = Column(DateTime, nullable=True)

class MatterParty(Base):
    __tablename__ = "matter_parties"
    id = Column(String, primary_key=True)
    matter_id = Column(String, ForeignKey("legal_matters.id"))
    party_name = Column(String)
    party_type = Column(String)  # plaintiff, defendant, witness, third_party
    role_description = Column(String)

class MatterDocument(Base):
    __tablename__ = "matter_documents"
    id = Column(String, primary_key=True)
    matter_id = Column(String, ForeignKey("legal_matters.id"))
    document_id = Column(String)
    document_type = Column(String)
    filed_date = Column(DateTime)

class CaseEvent(Base):
    __tablename__ = "case_events"
    id = Column(String, primary_key=True)
    matter_id = Column(String, ForeignKey("legal_matters.id"))
    event_type = Column(String)
    event_date = Column(DateTime)
    title = Column(String)
    description = Column(Text)

class LegalSource(Base):
    __tablename__ = "legal_sources"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    jurisdiction = Column(String)
    source_type = Column(String)  # statute, case_law, regulation
    url = Column(String)

class LegalCitation(Base):
    __tablename__ = "legal_citations"
    id = Column(String, primary_key=True)
    matter_id = Column(String, ForeignKey("legal_matters.id"))
    source_id = Column(String, ForeignKey("legal_sources.id"))
    citation_text = Column(String)
    page_number = Column(Integer)

class LegalDraft(Base):
    __tablename__ = "legal_drafts"
    id = Column(String, primary_key=True)
    matter_id = Column(String, ForeignKey("legal_matters.id"), nullable=True)
    title = Column(String)
    content = Column(Text)
    version = Column(Integer, default=1)
    status = Column(String, default="draft")
    created_by = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=True)