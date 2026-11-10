"""API tests for Pegorion Platform"""
import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

backend_dir = str(Path(__file__).resolve().parent.parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Pegorion" in response.json()["message"]

def test_register_and_login():
    user_data = {
        "email": "test@example.com",
        "full_name": "Test User",
        "password": "testpass123"
    }

    # Register
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code in [200, 400]  # 400 if already exists

    # Login
    response = client.post("/api/v1/auth/token", json={
        "username": user_data["email"],
        "password": user_data["password"]
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_get_towers():
    response = client.get("/api/v1/towers")
    assert response.status_code == 200
    assert isinstance(response.json(), list)