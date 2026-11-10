from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Table, Integer
from sqlalchemy.orm import relationship
from .base_class import Base

# Association table for roles and permissions
user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", String, ForeignKey("users.id"), primary_key=True),
    Column("role_id", String, ForeignKey("roles.id"), primary_key=True)
)

role_permissions = Table(
    "role_permissions",
    Base.metadata,
    Column("role_id", String, ForeignKey("roles.id"), primary_key=True),
    Column("permission_id", String, ForeignKey("permissions.id"), primary_key=True)
)

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    logo_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    organization_id = Column(String, ForeignKey("organizations.id"))
    email = Column(String, unique=True, nullable=False)
    full_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="user")
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="users")

Organization.users = relationship("User", back_populates="organization")

class Team(Base):
    __tablename__ = "teams"
    id = Column(String, primary_key=True)
    organization_id = Column(String, ForeignKey("organizations.id"))
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Role(Base):
    __tablename__ = "roles"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)

class Permission(Base):
    __tablename__ = "permissions"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    resource = Column(String)
    action = Column(String)

# Association table for Team Memberships
team_memberships = Table(
    "team_memberships",
    Base.metadata,
    Column("team_id", String, ForeignKey("teams.id"), primary_key=True),
    Column("user_id", String, ForeignKey("users.id"), primary_key=True),
    Column("joined_at", DateTime, default=datetime.utcnow),
    Column("role_in_team", String)
)

class Membership(Base):
    __tablename__ = "memberships"
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    team_id = Column(String, ForeignKey("teams.id"))
    role_in_team = Column(String)
    joined_at = Column(DateTime, default=datetime.utcnow)

class ProjectMember(Base):
    __tablename__ = "project_members"
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    team_id = Column(String, ForeignKey("teams.id"))
    project_role = Column(String)
    joined_at = Column(DateTime, default=datetime.utcnow)