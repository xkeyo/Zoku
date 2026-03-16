from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional

from server.schemas.extraction import (
    DocumentType,
    UploadResponse,
    JobStatusResponse,
    ExtractionResult,
    JobStatus
)
from server.utils.extraction_service import extraction_service

router = APIRouter(prefix="/extraction", tags=["extraction"])


@router.post("/upload", response_model=UploadResponse)
async def upload_pdf(
    file: UploadFile = File(...),
    document_type: str = Form(default=DocumentType.AUTO)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    if document_type not in [dt.value for dt in DocumentType]:
        raise HTTPException(status_code=400, detail="Invalid document type")
    
    pdf_bytes = await file.read()
    
    if len(pdf_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size must be less than 10MB")
    
    job_id = extraction_service.create_job(pdf_bytes, document_type)
    
    return UploadResponse(
        job_id=job_id,
        status=JobStatus.PENDING,
        message="PDF uploaded successfully. Processing started."
    )


@router.get("/status/{job_id}", response_model=JobStatusResponse)
async def get_job_status(job_id: str):
    status = extraction_service.get_job_status(job_id)
    
    if not status:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return JobStatusResponse(**status)


@router.get("/result/{job_id}", response_model=ExtractionResult)
async def get_extraction_result(job_id: str):
    result = extraction_service.get_job_result(job_id)
    
    if not result:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return ExtractionResult(**result)


@router.get("/history")
async def get_extraction_history():
    history = extraction_service.get_all_completed_jobs()
    return {"history": history}
