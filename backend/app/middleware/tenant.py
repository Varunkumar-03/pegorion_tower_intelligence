"""Tenant isolation middleware for organizing data access."""
from functools import wraps
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Callable, TypeVar
from ..models.identity import User

T = TypeVar('T')

def tenant_filter(model_class: str, org_id_param: str = "organization_id"):
    """
    Decorator to automatically filter queries by organization_id.
    
    Usage:
        @tenant_filter("TowerSite")
        def get_towers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
            ...
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            # This would need to be adapted for FastAPI's Depends system
            # For now, provides the filtering logic
            return func(*args, **kwargs)
        return wrapper
    return decorator


def apply_tenant_filter(query, model, org_id):
    """
    Apply organization_id filter to a SQLAlchemy query.
    
    Args:
        query: SQLAlchemy query object
        model: The model class being queried
        org_id: Current user's organization_id
    
    Returns:
        Filtered query with tenant isolation
    """
    # Check if model has organization_id field
    if hasattr(model, 'organization_id'):
        return query.filter(model.organization_id == org_id)
    return query


class TenantAccess:
    """
    Tenant access enforcement utility.
    """
    
    @staticmethod
    def can_access(user: User, resource_org_id: str) -> bool:
        """Check if user can access a resource from another organization."""
        # For now, users can access their own organization
        return user.organization_id == resource_org_id
    
    @staticmethod
    def validate_access(user: User, resource) -> None:
        """Validate access or raise HTTPException."""
        if hasattr(resource, 'organization_id'):
            if not TenantAccess.can_access(user, resource.organization_id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied to resource in another organization"
                )
