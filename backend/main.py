"""Pegorion Platform - Enterprise Telecom Infrastructure Intelligence API."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.core.config import settings, validate_file_upload, ALLOWED_EXTENSIONS, MAX_FILE_SIZE_MB
from app.routers import auth, towers, documents, leases, legal, operations, contracts, ai

app = FastAPI(
    title="Pegorion Platform API",
    version="1.0.0",
    description="Enterprise telecom infrastructure intelligence platform for Vertical Bridge",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS for local development - restricted from wildcard for security
# Add production domains as needed via CORS_ORIGINS environment variable
allowed_origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# API Routers - versioned under /api/v1
app.include_router(auth.router, prefix="/api/v1")
app.include_router(towers.router, prefix="/api/v1")
app.include_router(documents.router, prefix="/api/v1")
app.include_router(leases.router, prefix="/api/v1")
app.include_router(legal.router, prefix="/api/v1")
app.include_router(operations.router, prefix="/api/v1")
app.include_router(contracts.router, prefix="/api/v1")
app.include_router(ai.router, prefix="/api/v1")

@app.get("/")
def root():
    """API root endpoint."""
    return {
        "name": "Pegorion Platform API",
        "version": "1.0.0",
        "description": "Enterprise telecom infrastructure intelligence platform",
        "message": "Welcome to Pegorion Platform API"
    }

@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

@app.get("/api/v1/")
def api_root():
    """API root with available endpoints."""
    return {
        "api_version": "1.0.0",
        "endpoints": [
            "/api/v1/auth/register",
            "/api/v1/auth/token",
            "/api/v1/auth/me",
            "/api/v1/auth/upload_document",
            "/api/v1/towers",
            "/api/v1/documents",
            "/api/v1/documents/upload",
            "/api/v1/documents/process/{document_id}",
            "/api/v1/leases",
            "/api/v1/leases/search/expiring",
            "/api/v1/legal/matters",
            "/api/v1/operations/tasks",
            "/api/v1/operations/tasks/{task_id}",
            "/api/v1/operations/workflows",
            "/api/v1/contracts/contracts",
            "/api/v1/contracts/contracts/{contract_id}",
            "/api/v1/contracts/playbooks"
        ]
    }


