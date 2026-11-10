from typing import List, Optional
from uuid import uuid4
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.identity import User
from ..models.operations import Task, Workflow, Approval, WorkflowRun
from ..schemas.operations import Task as TaskSchema
from ..security import get_current_user

router = APIRouter(prefix="/operations", tags=["operations"])

@router.get("/tasks", response_model=List[TaskSchema])
def get_tasks(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    assignee_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get list of tasks with optional filtering."""
    query = db.query(Task)
    if status:
        query = query.filter(Task.status == status)
    if assignee_id:
        query = query.filter(Task.assigned_to == assignee_id)
    return query.offset(skip).limit(limit).all()

@router.get("/tasks/{task_id}", response_model=TaskSchema)
def get_task(task_id: str, db: Session = Depends(get_db)):
    """Get task by ID."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.get("/tasks/{task_id}/approvals", response_model=List[dict])
def get_task_approvals(task_id: str, db: Session = Depends(get_db)):
    """Get approvals for a task."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    approvals = db.query(Approval).filter(Approval.task_id == task_id).all()
    return [{"id": a.id, "approver_id": a.approver_id, "status": a.status, "approved_at": a.approved_at} for a in approvals]

@router.post("/tasks", response_model=TaskSchema, status_code=status.HTTP_201_CREATED)
def create_task(task_in: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create a new task."""
    task = Task(
        id=str(uuid4()),
        title=task_in.get("title"),
        description=task_in.get("description"),
        status=task_in.get("status", "pending"),
        priority=task_in.get("priority", "normal"),
        assigned_to=task_in.get("assigned_to"),
        due_date=task_in.get("due_date"),
        workflow_run_id=task_in.get("workflow_run_id")
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.put("/tasks/{task_id}", response_model=TaskSchema)
def update_task(task_id: str, task_in: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Update an existing task."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in task_in.items():
        if hasattr(task, key) and value is not None:
            setattr(task, key, value)
    db.commit()
    db.refresh(task)
    return task

@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete a task."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return None

@router.get("/workflows", response_model=List[dict])
def get_workflows(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get list of workflows."""
    workflows = db.query(Workflow).offset(skip).limit(limit).all()
    return [{"id": w.id, "name": w.name, "description": w.description, "is_active": w.is_active} for w in workflows]

@router.get("/dashboard/summary", response_model=dict)
def get_dashboard_summary(db: Session = Depends(get_db)):
    """Get operational dashboard summary."""
    total_tasks = db.query(Task).count()
    pending_tasks = db.query(Task).filter(Task.status == "pending").count()
    completed_tasks = db.query(Task).filter(Task.status == "completed").count()
    overdue_tasks = db.query(Task).filter(Task.due_date < datetime.utcnow(), Task.status != "completed").count()

    return {
        "total_tasks": total_tasks,
        "pending_tasks": pending_tasks,
        "completed_tasks": completed_tasks,
        "overdue_tasks": overdue_tasks,
        "recent_tasks": db.query(Task).order_by(Task.created_at.desc()).limit(5).all()
    }