from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class WorkflowBase(BaseModel):
    name: str
    description: Optional[str] = None
    workflow_type: Optional[str] = None
    is_active: bool = True

class Workflow(WorkflowBase):
    id: str

    class Config:
        from_attributes = True

class WorkflowRunBase(BaseModel):
    status: Optional[str] = "pending"
    assigned_to: Optional[str] = None

class WorkflowRun(WorkflowRunBase):
    id: str
    workflow_id: str
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    tower_site_id: Optional[str] = None

    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "pending"
    priority: Optional[str] = "normal"
    due_date: Optional[datetime] = None
    assigned_to: Optional[str] = None

class Task(TaskBase):
    id: str
    created_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    workflow_run_id: Optional[str] = None

    class Config:
        from_attributes = True

class ApprovalBase(BaseModel):
    approver_id: str
    comments: Optional[str] = None

class Approval(ApprovalBase):
    id: str
    task_id: str
    status: Optional[str] = "pending"
    approved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class NotificationBase(BaseModel):
    user_id: str
    message: str
    is_read: bool = False
    source: Optional[str] = None

class Notification(NotificationBase):
    id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True