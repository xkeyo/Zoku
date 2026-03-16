from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from enum import Enum


class DocumentType(str, Enum):
    AUTO = "auto"
    FINANCIAL = "financial"
    LEGAL = "legal"
    CLINICAL = "clinical"


class JobStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class UploadResponse(BaseModel):
    job_id: str
    status: JobStatus
    message: str


class BoundingBox(BaseModel):
    page: int
    region: str


class ExtractedField(BaseModel):
    key: str
    value: Any
    confidence: float
    field_type: Optional[str] = "text"
    label: Optional[str] = None
    location: Optional[BoundingBox] = None
    source_text: Optional[str] = None  # Exact verbatim text from PDF for precise highlighting


class JobStatusResponse(BaseModel):
    job_id: str
    status: JobStatus
    document_type: Optional[str] = None
    progress: Optional[int] = None
    error: Optional[str] = None


class ExtractionResult(BaseModel):
    job_id: str
    status: JobStatus
    document_type: str
    fields: List[ExtractedField]
    raw_data: Dict[str, Any]
    created_at: str
    error: Optional[str] = None
