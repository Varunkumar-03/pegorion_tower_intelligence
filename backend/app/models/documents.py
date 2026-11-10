from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, Integer, Boolean, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from .base_class import Base
from typing import Dict, Any, List

class Document(Base):
    __tablename__ = "documents"
    id = Column(String, primary_key=True)
    filename = Column(String, nullable=False)
    original_filename = Column(String)
    file_size = Column(Integer)
    mime_type = Column(String)
    storage_path = Column(String, nullable=False)
    uploaded_by = Column(String)
    organization_id = Column(String)
    tenant_id = Column(String)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="uploaded")  # uploaded, processing, processed, error
    document_type = Column(String, nullable=True)

class DocumentVersion(Base):
    __tablename__ = "document_versions"
    id = Column(String, primary_key=True)
    document_id = Column(String, ForeignKey("documents.id"))
    version_number = Column(Integer)
    storage_path = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(String)

class DocumentPage(Base):
    __tablename__ = "document_pages"
    id = Column(String, primary_key=True)
    document_id = Column(String, ForeignKey("documents.id"))
    page_number = Column(Integer)
    text = Column(Text)
    image_path = Column(String)

class DocumentChunk(Base):
    __tablename__ = "document_chunks"
    id = Column(String, primary_key=True)
    document_id = Column(String, ForeignKey("documents.id"))
    page_number = Column(Integer)
    chunk_index = Column(Integer)
    text = Column(Text)
    embedding_vector = Column(JSON)  # pgvector

class ExtractedEntity(Base):
    __tablename__ = "extracted_entities"
    id = Column(String, primary_key=True)
    document_id = Column(String, ForeignKey("documents.id"))
    entity_type = Column(String)  # party, date, amount, clause
    text = Column(String)
    page_number = Column(Integer)
    offset_start = Column(Integer)
    offset_end = Column(Integer)
    confidence = Column(Float)
    normalized_value = Column(Text)

class ProcessingJob(Base):
    __tablename__ = "processing_jobs"
    id = Column(String, primary_key=True)
    document_id = Column(String, ForeignKey("documents.id"))
    job_type = Column(String)  # extraction, classification, entity_extraction
    status = Column(String, default="queued")
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    result = Column(JSON)

# AI models
class AiRun(Base):
    __tablename__ = "ai_runs"
    id = Column(String, primary_key=True)
    user_id = Column(String)
    prompt = Column(Text)
    response = Column(Text)
    model = Column(String)
    input_tokens = Column(Integer)
    output_tokens = Column(Integer)
    latency_ms = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    citations = Column(JSON)  # List of citation references

class Agent(Base):
    __tablename__ = "agents"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    agent_type = Column(String)  # document_classifier, lease_extractor, legal_reviewer
    is_active = Column(Boolean, default=True)
    config = Column(JSON)

class AgentExecution(Base):
    __tablename__ = "agent_executions"
    id = Column(String, primary_key=True)
    agent_id = Column(String, ForeignKey("agents.id"))
    run_id = Column(String, ForeignKey("ai_runs.id"))
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    status = Column(String)  # running, completed, error
    input_data = Column(JSON)
    output_data = Column(JSON)

class Citation(Base):
    __tablename__ = "citations"
    id = Column(String, primary_key=True)
    run_id = Column(String, ForeignKey("ai_runs.id"))
    document_id = Column(String, ForeignKey("documents.id"))
    page_number = Column(Integer)
    chunk_id = Column(String, ForeignKey("document_chunks.id"))
    text_snippet = Column(Text)
    confidence = Column(Float)

class RetrievalLog(Base):
    __tablename__ = "retrieval_logs"
    id = Column(String, primary_key=True)
    run_id = Column(String, ForeignKey("ai_runs.id"))
    query = Column(Text)
    retrieved_chunk_ids = Column(JSON)
    similarity_scores = Column(JSON)

class ModelUsage(Base):
    __tablename__ = "model_usage"
    id = Column(String, primary_key=True)
    run_id = Column(String, ForeignKey("ai_runs.id"))
    model_name = Column(String)
    input_tokens = Column(Integer)
    output_tokens = Column(Integer)
    latency_ms = Column(Integer)
    cost_usd = Column(Float)

class EvaluationResult(Base):
    __tablename__ = "evaluation_results"
    id = Column(String, primary_key=True)
    run_id = Column(String, ForeignKey("ai_runs.id"))
    metric = Column(String)
    value = Column(Float)
    passed = Column(Boolean)
