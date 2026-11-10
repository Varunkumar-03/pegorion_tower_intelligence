from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, Integer, Boolean, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from .base_class import Base

class AuditEvent(Base):
    __tablename__ = "audit_events"
    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=True)
    action = Column(String, nullable=False)
    resource_type = Column(String)
    resource_id = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(JSON)

class AccessLog(Base):
    __tablename__ = "access_logs"
    id = Column(String, primary_key=True)
    user_id = Column(String)
    resource_type = Column(String)
    resource_id = Column(String)
    action = Column(String)
    granted = Column(Boolean)
    timestamp = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String)

class RetentionPolicy(Base):
    __tablename__ = "retention_policies"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    resource_type = Column(String)
    retention_days = Column(Integer)
    legal_hold_only = Column(Boolean, default=False)

class LegalHold(Base):
    __tablename__ = "legal_holds"
    id = Column(String, primary_key=True)
    matter_id = Column(String, ForeignKey("legal_matters.id"))
    resource_type = Column(String)
    resource_id = Column(String)
    hold_reason = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

class SecurityEvent(Base):
    __tablename__ = "security_events"
    id = Column(String, primary_key=True)
    event_type = Column(String)
    severity = Column(String)
    user_id = Column(String, nullable=True)
    resource_type = Column(String, nullable=True)
    resource_id = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    description = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)