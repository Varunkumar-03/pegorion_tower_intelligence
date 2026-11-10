# Pegorion Testing Guide

## Overview

This document describes the testing approach and procedures for the Pegorion platform.

## Testing Strategy

### 1. Unit Tests

#### Backend Unit Tests
Tests for individual functions and modules:
- Model validation
- Schema serialization/deserialization
- Utility functions
- Security helpers

Location: `backend/tests/`

#### Frontend Unit Tests
Tests for React components:
- Component rendering
- State management with TanStack Query
- Form validation

### 2. Integration Tests

#### API Integration Tests
Tests for complete API workflows:
- Authentication flow (register, login, token refresh)
- CRUD operations on all entities
- Tenant isolation verification
- Rate limiting enforcement

#### Document Processing Tests
- File upload validation
- Document text extraction
- OCR processing for scanned documents
- Chunk creation and embedding

### 3. End-to-End Tests

#### User Journey Tests
- Complete user registration and onboarding
- Document upload and analysis workflow
- AI query with RAG
- Cross-tenant access prevention

## Running Tests

### Backend Tests

```bash
cd backend

# Run all tests
pytest tests/ -v

# Run specific test file
pytest tests/test_api.py -v

# Run with coverage
pytest tests/ --cov=app --cov-report=html
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Test Categories

### Security Tests (Critical)
1. **Unauthorized Access**: Verify no access without valid token
2. **Cross-Tenant Access**: Verify users cannot access other organizations' data
3. **Invalid File Uploads**: Test rejection of malicious files
4. **Authentication Failures**: Test wrong password scenarios
5. **API Rate Limits**: Verify rate limiting works

### Functional Tests
1. **Tenant Isolation Tests**: Each organization's data is isolated
2. **RBAC Tests**: Role-based permissions enforced
3. **Document Processing Tests**: Text extraction works correctly
4. **Search Tests**: Full-text search returns correct results

### Performance Tests
1. **API Response Time**: Endpoints respond within acceptable time
2. **Database Query Performance**: Queries optimized
3. **Concurrent User Load**: Multiple users can operate simultaneously

## Test Data

### Demo Users

The system includes pre-configured demo users:

| Email | Password | Role | Organization |
|-------|----------|------|--------------|
| admin@pegorion.demo | DemoPass123 | admin | DemoCorp |
| analyst@pegorion.demo | DemoPass123 | analyst | DemoCorp |
| viewer@pegorion.demo | DemoPass123 | viewer | DemoCorp |

### Synthetic Data

Sample data created for demonstration:
- 3 Tower Sites
- 2 Leases
- 5 Legal Matters
- 10 Documents
- 15 Tasks

## Test API Endpoints

### Health Check
```bash
curl http://localhost:8000/health
```

### Authentication
```bash
# Register
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","full_name":"Test User","password":"password123"}'

# Login
curl -X POST http://localhost:8000/api/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"password123"}'
```

### Protected Endpoints
```bash
# Get towers (requires auth)
curl http://localhost:8000/api/v1/towers \
  -H "Authorization: Bearer YOUR_TOKEN"

# Upload document
curl -X POST http://localhost:8000/api/v1/auth/upload_document \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@document.pdf"
```

## CI/CD Pipeline

The platform should be tested on every commit:

```yaml
# Example GitHub Actions workflow
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r backend/requirements.txt
      - run: cd backend && pytest tests/ -v
      
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: cd frontend && npm ci
      - run: cd frontend && npm test
```

## Manual Testing Checklist

### Before Deployment
- [ ] All backend tests pass
- [ ] Frontend build succeeds
- [ ] API documentation accessible at `/docs`
- [ ] CORS headers configured correctly
- [ ] Rate limiting tested

### After Deployment
- [ ] Health check responds
- [ ] Authentication works
- [ ] Document upload works
- [ ] AI features work (with API keys)
- [ ] Tenant isolation verified
- [ ] HTTPS is active

## Known Limitations in Testing

1. **External API Mocks**: OpenAI/Anthropic APIs may be mocked in tests
2. **File System**: Some file operations may require local storage
3. **Database**: Tests use SQLite in-memory for speed
4. **Redis**: May require mock Redis for unit tests

## Test Coverage Goals

- Backend: 85% minimum
- Frontend: 70% minimum
- Security tests: 100% for critical paths
- Integration tests: 80% minimum