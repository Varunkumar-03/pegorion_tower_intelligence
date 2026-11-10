from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from uuid import UUID

class OrganizationBase(BaseModel):
    name: str
    logo_url: Optional[str] = None

class OrganizationCreate(OrganizationBase):
    pass

class Organization(OrganizationBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    organization_id: str
    is_active: bool
    created_at: datetime
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None