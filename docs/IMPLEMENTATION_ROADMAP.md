# Pegorion Implementation Roadmap
**Date: 2026-11-08**
**Stage: STAGE 0 Complete, Ready for STAGE 1 Approval**

---

## Prerequisites Before Any Implementation

1. **Git Repository Initialization** (REQUIRED)
   ```bash
   cd /pegorion
   git init
   git add .
   git commit -m "Checkpoint: Pre-implementation baseline"
   ```
   **Rationale:** Cannot track changes or create backups without version control

2. **Docker Environment Setup**
   ```bash
   cd /pegorion
   docker-compose up -d --build
   ```
   **Missing file:** Create `init-db.sql` with schema setup

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with actual secrets
   ```

---

## STAGE 1: APPLICATION STABILIZATION
**Estimated Effort:** 40-60 hours
**Priority:** P0 (Critical)

### Phase 1.1: Git and Environment Setup
- [ ] Initialize git repository
- [ ] Create initial checkpoint
- [ ] Create `init-db.sql` from migration
- [ ] Verify Docker Compose works

### Phase 1.2: Frontend Critical Bug Fix
- [ ] **FIX:** `/frontend/components/Layout.tsx:28`
  - Change `"text-gray-600 hover text-gray-900"` to `"text-gray-600 hover:text-gray-900"`
- [ ] **ADD:** QueryClientProvider in `_app.tsx`
  ```tsx
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
  
  const queryClient = new QueryClient()
  
  export default function App({ Component, pageProps }: AppProps) {
    return (
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    )
  }
  ```

### Phase 1.3: Create Missing Pages (Minimum Viable)
| Page | Purpose | Minimal Implementation |
|------|---------|----------------------|
| `/leases` | Lease dashboard | List + detail views |
| `/legal` | Legal matters | List + detail views |
| `/operations` | Task management | Task list |
| `/ai` | Future AI workspace | Placeholder page |

### Phase 1.4: Connect Frontend to Backend
- [ ] Replace hardcoded `towerData` in `pages/index.tsx` with `useTowers()` hook
- [ ] Replace hardcoded data in `towers/index.tsx` and `towers/[id].tsx`
- [ ] Add tenant-aware requests (include organization context)

### Phase 1.5: Fix Navigation Duplication
**Issue:** `navItems` array duplicated in multiple files
**Solution:** Create `components/Nav.tsx` or move to `lib/navigation.ts`

---

## STAGE 2: SECURITY AND DATABASE FOUNDATION
**Estimated Effort:** 60-80 hours
**Priority:** P0

### 2.1: CORS Security Fix
**File:** `/backend/main.py:19`
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Production domains only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2.2: Tenant Isolation Implementation
**Strategy:** Every query must filter by `organization_id`

**Files to modify:**
- `app/routers/towers.py` - Add org filter
- `app/routers/documents.py` - Add org filter
- `app/routers/leases.py` - Add org filter
- `app/routers/legal.py` - Add org filter

**New middleware needed:**
```python
# app/middleware/tenant.py
def tenant_filter(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        # Add org_id to query
```

### 2.3: Role-Based Access Control
- Implement `require_role` decorator usage
- Add permission system for document access
- Create `can_access_document()` helper

### 2.4: Audit Event Middleware
**File:** `app/middleware/audit.py`
```python
from ..models.governance import AuditEvent

def create_audit_event(action, resource_type=None, resource_id=None):
    # Log to audit_events table
```

### 2.5: Secure File Upload
**File:** `app/routers/auth.py:80`
- Add file type whitelist (PDF, DOCX)
- Add max file size validation (from settings: 50MB)
- Generate secure filenames
- Virus scan integration placeholder

### 2.6: API Rate Limiting
**Add to:** `app/middleware/rate_limit.py`
- Login endpoint: 5 attempts per minute
- General API: 100 requests per minute

### 2.7: Database Indexing
**Add indexes on:**
- `towers.property_id`
- `documents.organization_id`
- `leases.organization_id`
- `legal_matters.organization_id`
- `documents.filename` (full-text)

---

## STAGE 3: DOCUMENT INTELLIGENCE ENGINE
**Estimated Effort:** 120-160 hours
**Priority:** P0

### 3.1: Document Upload Enhancement
**File:** `app/routers/documents.py`
- Add virus scanning placeholder
- Add file type validation
- Add organization_id assignment

### 3.2: OCR Integration
**Add:** `app/services/ocr.py`
```python
import pytesseract
from pdf2image import convert_from_path

def extract_ocr_text(file_path):
    # Handle scanned PDFs
```

### 3.3: Document Classification
**Add:** `app/services/document_classifier.py`
- Classify: Lease, Contract, Legal Doc, etc.
- Store in `document_type` field

### 3.4: Entity Extraction
**Add:** `app/services/entity_extractor.py`
- Extract: parties, dates, amounts, clauses
- Store in `extracted_entities` table

### 3.5: Structural Chunking
**Add:** `app/services/chunker.py`
- Chunk by: page, section, paragraph
- Generate embeddings
- Store in `document_chunks` table
- Generate pgvector index

### 3.6: Embedding Generation
**Add:** `app/services/embeddings.py`
```python
from langchain_community.embeddings import OpenAIEmbeddings

def generate_embeddings(text):
    embeddings = OpenAIEmbeddings()
    return embeddings.embed_query(text)
```

### 3.7: Processing Queue
**Integrate:** Celery for background processing
- Task: document processing pipeline
- Retry on failure
- Progress tracking

---

## STAGE 4: SIX PRODUCT MODULES
**Estimated Effort:** 200-300 hours per module
**Priority:** P1-P0

### Module 1: Legal Intelligence
**Features to implement:**
1. Legal corpus ingestion (CourtListener, eCFR)
2. Statutory search
3. Case law search
4. Citation system
5. Precedent analysis

### Module 2: Contract Intelligence
**Features to implement:**
1. Contract upload & classification
2. Clause extraction
3. Playbook comparison
4. Risk scoring
5. Deviation detection

### Module 3: Lease Intelligence
**Features to implement:**
1. Lease portfolio dashboard
2. Obligation tracking
3. Renewal alerts
4. Amendment tracking
5. Financial tracking

### Module 4: Litigation Intelligence
**Features to implement:**
1. Matter management
2. Case timelines
3. Document association
4. Event tracking
5. Risk scoring

### Module 5: Regulatory Intelligence
**Features to implement:**
1. FCC regulation database
2. FAA Part 77 rules
3. Change tracking
4. Compliance mapping

### Module 6: AI Legal Workspace
**Features to implement:**
1. RAG conversation
2. Document Q&A
3. Citation verification
4. Response grounding
5. Usage tracking

---

## STAGE 5: LEGAL DATA INGESTION
**Estimated Effort:** 80-120 hours

### Sources to Integrate:
1. **CourtListener API** - Federal case law
   - License: Free for non-commercial, paid for commercial
   - Rate limit: 1000 requests/day free

2. **eCFR API** - FCC rules (Title 47)
   - License: Public domain
   - Update: Daily

3. **Federal Register API** - Rulemaking
   - License: Public domain
   - Update: Daily

4. **US Code API** - Statutes
   - License: Public domain
   - Update: Periodic

5. **FAA Part 77** - Tower obstructions
   - License: Government work
   - Update: Periodic

### Ingestion Pipeline:
```
Source → Fetch → Parse → Deduplicate → Store → Index
```

---

## STAGE 6: AI AND LEGAL RAG
**Estimated Effort:** 150-200 hours

### Components to Build:

1. **LLM Gateway** (`app/services/llm_gateway.py`)
   - Anthropic Claude adapter
   - OpenAI GPT adapter
   - Request/response logging
   - Cost tracking

2. **Retrieval Engine** (`app/services/retrieval.py`)
   - Dense vector search (pgvector)
   - Sparse keyword search (BM25)
   - Hybrid fusion (RRF)

3. **Reranker** (`app/services/reranker.py`)
   - Cross-encoder for relevance
   - Return top-k with scores

4. **Citation System** (`app/services/citation.py`)
   - Link claims to evidence
   - Format citations
   - Verify sources

5. **Prompt Library** (`app/prompts/legal.yaml`)
   - Legal research prompts
   - Contract analysis prompts
   - Citation-aware prompts

---

## File Change Summary by Stage

| Stage | Files to Create | Files to Modify |
|-------|-----------------|-----------------|
| 1 | 4 missing page files | 3 (Layout.tsx, _app.tsx, nav centralizing) |
| 2 | ~5 middleware files | 6 router files (tenant filters) |
| 3 | 6 service files | documents.py |
| 4 | 24+ page files | Multiple |
| 5 | 5 ingestion modules | 2 |
| 6 | 5 AI service files | Multiple |

---

## Testing Strategy

### Unit Tests
- Backend: Pytest with FastAPI test client
- Frontend: Jest + React Testing Library

### Integration Tests
- API endpoint coverage: 90% minimum
- Database queries: All tenant-filtered queries tested

### E2E Tests
- Cypress: Critical user flows
- Authentication flow
- Document upload/processing
- Legal search
- RAG chat

### Security Tests
- CORS validation
- Tenant isolation
- RBAC enforcement
- Rate limiting

---

## Approval Gate

**STOP** - Stage 0 complete
Awaiting approval to begin:
1. Git repository initialization
2. STAGE 1: Application Stabilization

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Breaking existing functionality | Git checkpoints, small incremental changes |
| Data exposure | Tenant isolation tests, RBAC enforcement |
| AI hallucinations | Citation requirements, no legal conclusions |
| Performance degradation | Load testing, indexing |
| Security vulnerabilities | Regular security reviews, OWASP compliance |