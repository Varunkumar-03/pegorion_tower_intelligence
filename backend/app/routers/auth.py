"""Authentication router with secure file upload."""
from datetime import datetime
import uuid
import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.identity import User, Organization
from ..models.documents import Document
from ..schemas.identity import UserCreate, Token, User as UserSchema
from ..security import get_password_hash, verify_password, create_access_token, get_current_user
from ..core.config import settings, validate_file_upload

router = APIRouter(prefix="/auth", tags=["auth"])

# File upload security settings
ALLOWED_EXTENSIONS = {'.pdf', '.doc', '.docx', '.txt', '.rtf', '.eml'}
MAX_FILE_SIZE_MB = 50


@router.post("/token", response_model=Token)
async def login(form_data: dict, db: Session = Depends(get_db)):
    """Authenticate user and return JWT token."""
    user = db.query(User).filter(User.email == form_data.get("username")).first()
    if not user or not verify_password(form_data.get("password"), user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    access_token = create_access_token(data={"sub": user.id})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", response_model=UserSchema)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    db_user = db.query(User).filter(User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Generate organization_id or use provided
    org_id = f"org-{uuid.uuid4().hex[:8]}"
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        org = Organization(id=org_id, name="Default Organization")
        db.add(org)
        db.commit()
    
    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        id=str(uuid.uuid4()),
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=hashed_password,
        organization_id=org_id,
        role="admin"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.get("/me", response_model=UserSchema)
def read_users_me(current_user: User = Depends(get_current_user)):
    """Get current user info."""
    return current_user


@router.post("/upload_document", response_model=dict)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Secure document upload with validation."""
    # Validate file
    is_valid, error_msg = validate_file_upload(file.filename, file.size or 0)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    # Create storage directory
    os.makedirs(settings.DOCUMENT_STORAGE_PATH, exist_ok=True)
    
    # Generate unique filename with organization prefix for tenant isolation
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[-1].lower()
    storage_path = os.path.join(settings.DOCUMENT_STORAGE_PATH, f"{current_user.organization_id}_{file_id}{ext}")
    
    # Save file securely
    with open(storage_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Create document record with tenant isolation
    db_doc = Document(
        id=file_id,
        filename=file.filename,
        original_filename=file.filename,
        file_size=file.size,
        mime_type=file.content_type,
        storage_path=storage_path,
        uploaded_by=current_user.id,
        organization_id=current_user.organization_id,
        document_type=None
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    
    return {
        "id": db_doc.id,
        "filename": db_doc.filename,
        "size_bytes": db_doc.file_size,
        "organization_id": current_user.organization_id
    }
