from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, Integer, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from .base_class import Base

class Workflow(Base):
    __tablename__ = "workflows"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    workflow_type = Column(String)  # colocation_intake, lease_review, approval
    is_active = Column(Boolean, default=True)

class WorkflowVersion(Base):
    __tablename__ = "workflow_versions"
    id = Column(String, primary_key=True)
    workflow_id = Column(String, ForeignKey("workflows.id"))
    version_number = Column(Integer)
    definition = Column(Text)  # JSON workflow definition

class WorkflowRun(Base):
    __tablename__ = "workflow_runs"
    id = Column(String, primary_key=True)
    workflow_id = Column(String, ForeignKey("workflows.id"))
    status = Column(String, default="pending")
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    assigned_to = Column(String)
    tower_site_id = Column(String, nullable=True)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default="pending")  # pending, in_progress, completed, blocked
    priority = Column(String, default="normal")
    assigned_to = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime)
    completed_at = Column(DateTime)
    workflow_run_id = Column(String, ForeignKey("workflow_runs.id"), nullable=True)

class Approval(Base):
    __tablename__ = "approvals"
    id = Column(String, primary_key=True)
    task_id = Column(String, ForeignKey("tasks.id"))
    approver_id = Column(String)
    status = Column(String, default="pending")
    approved_at = Column(DateTime)
    comments = Column(Text)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String, primary_key=True)
    user_id = Column(String)
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    source = Column(String)  # workflow, task, approval, lease