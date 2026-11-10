from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class DocumentBase(BaseModel):
    filename: str
    original_filename: Optional[str] = None

class DocumentCreate(DocumentBase):
    tenant_id: Optional[str] = None

class Document(DocumentBase):
    id: str
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    storage_path: str
    uploaded_by: Optional[str] = None
    organization_id: Optional[str] = None
    tenant_id: Optional[str] = None
    uploaded_at: datetime
    status: Optional[str] = "uploaded"
    document_type: Optional[str] = None

    class Config:
        from_attributes = True

class DocumentPage(BaseModel):
    id: str
    document_id: str
    page_number: int
    text: Optional[str] = None
    image_path: Optional[str] = None

    class Config:
        from_attributes = True

class DocumentChunk(BaseModel):
    id: str
    document_id: str
    page_number: int
    chunk_index: int
    text: Optional[str] = None

    class Config:
        from_attributes = True

class ExtractedEntity(BaseModel):
    id: str
    document_id: str
    entity_type: str
    text: str
    page_number: int
    offset_start: Optional[int] = None
    offset_end: Optional[int] = None
    confidence: Optional[float] = None
    normalized_value: Optional[str] = None

    class Config:
        from_attributes = True

class Citation(BaseModel):
    id: str
    run_id: str
    document_id: str
    page_number: int
    chunk_id: Optional[str] = None
    text_snippet: str
    confidence: Optional[float] = None

    class Config:
        from_attributes = True

class AiRun(BaseModel):
    id: str
    user_id: Optional[str] = None
    prompt: str
    response: Optional[str] = None
    model: Optional[str] = None
    input_tokens: Optional[int] = None
    output_tokens: Optional[int] = None
    created_at: datetime
    citations: Optional[List[dict]] = None

    class Config:
        from_attributes = True

class RetrievalLog(BaseModel):
    id: str
    run_id: str
    query: Optional[str] = None

    class Config:
        from_attributes = True

class ModelUsage(BaseModel):
    id: str
    run_id: str
    model_name: Optional[str] = None
    input_tokens: Optional[int] = None
    output_tokens: Optional[int] = None
    cost_usd: Optional[float] = None

    class Config:
        from_attributes = True

class EvaluationResult(BaseModel):
    id: str
    run_id: str
    metric: Optional[str] = None
    value: Optional[float] = None
    passed: Optional[bool] = None

    class Config:
        from_attributes = True