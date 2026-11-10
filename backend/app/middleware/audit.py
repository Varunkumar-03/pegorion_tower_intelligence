"""Audit event logging middleware."""
import uuid
from datetime import datetime
from typing import Optional
from fastapi import Request, HTTPException
from sqlalchemy.orm import Session
from ..models.governance import AuditEvent


class AuditLogger:
    """
    Audit logging utility for tracking user actions.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def log(
        self,
        action: str,
        user_id: Optional[str],
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        details: Optional[dict] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ):
        """
        Log an audit event.
        """
        audit_event = AuditEvent(
            id=str(uuid.uuid4()),
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details or {},
            ip_address=ip_address,
            user_agent=user_agent[:500] if user_agent else None  # Truncate long user agents
        )
        
        try:
            self.db.add(audit_event)
            self.db.commit()
        except Exception:
            # Don't fail the request if audit logging fails
            self.db.rollback()
    
    def log_request(
        self,
        request: Request,
        user: Optional[object],
        action: str,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None
    ):
        """Log an incoming request as an audit event."""
        client_ip = request.client.host if request.client else None
        
        self.log(
            action=f"request_{action}",
            user_id=user.id if user and hasattr(user, 'id') else None,
            resource_type=resource_type,
            resource_id=resource_id,
            details={
                "method": request.method,
                "url": str(request.url),
                "headers": {
                    "content-type": request.headers.get("content-type"),
                    "authorization": "[REDACTED]"
                }
            },
            ip_address=client_ip,
            user_agent=request.headers.get("user-agent")
        )


def create_audit_decorator(audit_logger: AuditLogger):
    """Create a decorator that logs requests to audit events."""
    
    def decorator(action: str, resource_type: str = None):
        def wrapper(func):
            from functools import wraps
            @wraps(func)
            async def async_wrapper(*args, **kwargs):
                # This would need FastAPI context to get request
                return await func(*args, **kwargs)
            return async_wrapper
        return wrapper
    return decorator
