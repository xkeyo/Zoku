import os
import base64
import asyncio
from typing import Dict, Any, List, Optional
from datetime import datetime
from anthropic import Anthropic
from PyPDF2 import PdfReader
import io

from server.schemas.extraction import DocumentType, JobStatus, ExtractedField


class ExtractionService:
    def __init__(self):
        self.client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        self.jobs: Dict[str, Dict[str, Any]] = {}
    
    def extract_text_from_pdf(self, pdf_bytes: bytes) -> str:
        pdf_file = io.BytesIO(pdf_bytes)
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    
    def get_extraction_prompt(self, document_type: str, text: str) -> str:
        base_prompt = f"""You are a document extraction AI. Extract structured data from the following {document_type} document.

Document text:
{text}

Instructions:
1. Identify and extract all relevant fields based on the document type
2. For each field, provide:
   - key: snake_case field identifier
   - value: the extracted/formatted value
   - source_text: the EXACT verbatim text snippet from the document (critical for precise highlighting)
   - confidence: score between 0.0 and 1.0
   - field_type: one of "text", "number", "date", "email", "phone", "select"
   - label: human-readable field name
   - location: approximate location in document with page number (1-indexed) and region ("top", "middle", "bottom")

IMPORTANT: The source_text must be the exact text as it appears in the document, not the formatted value.
Examples:
- If document shows "$4,250.00", source_text should be "$4,250.00" (not "4250.00")
- If document shows "01/15/2024", source_text should be "01/15/2024" (not "2024-01-15")
- If document shows "ACME Corp.", source_text should be "ACME Corp." (exact match)

3. Return the data as a JSON object with this structure:
{{
  "document_type": "{document_type}",
  "fields": [
    {{
      "key": "field_name",
      "value": "extracted_value",
      "source_text": "exact text from document",
      "confidence": 0.95,
      "field_type": "text",
      "label": "Field Name",
      "location": {{"page": 1, "region": "top"}}
    }}
  ]
}}

"""
        
        if document_type == "financial":
            base_prompt += """For financial documents, extract fields like:
- company_name (text), fiscal_year (number), revenue (number), expenses (number), net_income (number), assets (number), liabilities (number), equity (number), report_date (date), etc.
"""
        elif document_type == "legal":
            base_prompt += """For legal documents, extract fields like:
- document_title (text), parties_involved (text), effective_date (date), jurisdiction (text), key_terms (text), obligations (text), contract_value (number), etc.
"""
        elif document_type == "clinical":
            base_prompt += """For clinical documents, extract fields like:
- patient_name (text), date_of_birth (date), diagnosis (text), medications (text), procedures (text), physician_name (text), visit_date (date), patient_id (text), etc.
"""
        
        base_prompt += "\nProvide ONLY the JSON response, no additional text."
        return base_prompt
    
    def detect_document_type(self, text: str) -> str:
        prompt = f"""Analyze the following document text and determine its type. 
Choose from: financial, legal, clinical, or general.

Document text (first 1000 characters):
{text[:1000]}

Respond with ONLY one word: financial, legal, clinical, or general."""
        
        models_to_try = [
            "claude-3-5-sonnet-20241022",
            "claude-3-opus-20240229",
            "claude-3-sonnet-20240229",
            "claude-3-haiku-20240307"
        ]
        
        last_error = None
        for model in models_to_try:
            try:
                message = self.client.messages.create(
                    model=model,
                    max_tokens=10,
                    messages=[{"role": "user", "content": prompt}]
                )
                
                detected_type = message.content[0].text.strip().lower()
                if detected_type not in ["financial", "legal", "clinical"]:
                    detected_type = "general"
                
                return detected_type
            except Exception as e:
                last_error = e
                continue
        
        raise Exception(f"All models failed. Last error: {last_error}")
    
    async def process_pdf(self, job_id: str, pdf_bytes: bytes, document_type: str):
        try:
            self.jobs[job_id]["status"] = JobStatus.PROCESSING
            self.jobs[job_id]["progress"] = 10
            
            text = self.extract_text_from_pdf(pdf_bytes)
            self.jobs[job_id]["progress"] = 30
            
            if document_type == DocumentType.AUTO:
                detected_type = self.detect_document_type(text)
                document_type = detected_type
            
            self.jobs[job_id]["document_type"] = document_type
            self.jobs[job_id]["progress"] = 50
            
            prompt = self.get_extraction_prompt(document_type, text)
            
            models_to_try = [
                "claude-3-5-sonnet-20241022",
                "claude-3-opus-20240229",
                "claude-3-sonnet-20240229",
                "claude-3-haiku-20240307"
            ]
            
            message = None
            last_error = None
            for model in models_to_try:
                try:
                    message = self.client.messages.create(
                        model=model,
                        max_tokens=4096,
                        messages=[{"role": "user", "content": prompt}]
                    )
                    break
                except Exception as e:
                    last_error = e
                    continue
            
            if message is None:
                raise Exception(f"All models failed. Last error: {last_error}")
            
            self.jobs[job_id]["progress"] = 90
            
            response_text = message.content[0].text.strip()
            
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            import json
            import re
            
            try:
                result = json.loads(response_text)
            except json.JSONDecodeError as e:
                print(f"JSON Parse Error: {e}")
                print(f"Raw response: {response_text[:500]}")
                
                response_text = re.sub(r',(\s*[}\]])', r'\1', response_text)
                response_text = re.sub(r"'", '"', response_text)
                
                try:
                    result = json.loads(response_text)
                except json.JSONDecodeError:
                    result = {
                        "document_type": document_type,
                        "fields": [
                            {
                                "key": "raw_extraction",
                                "value": response_text,
                                "confidence": 0.5
                            }
                        ]
                    }
            
            self.jobs[job_id]["status"] = JobStatus.COMPLETED
            self.jobs[job_id]["progress"] = 100
            self.jobs[job_id]["result"] = result
            self.jobs[job_id]["completed_at"] = datetime.utcnow().isoformat()
            
        except Exception as e:
            self.jobs[job_id]["status"] = JobStatus.FAILED
            self.jobs[job_id]["error"] = str(e)
            self.jobs[job_id]["progress"] = 0
    
    def create_job(self, pdf_bytes: bytes, document_type: str) -> str:
        import uuid
        job_id = str(uuid.uuid4())
        
        self.jobs[job_id] = {
            "job_id": job_id,
            "status": JobStatus.PENDING,
            "document_type": document_type if document_type != DocumentType.AUTO else None,
            "progress": 0,
            "created_at": datetime.utcnow().isoformat(),
            "pdf_bytes": pdf_bytes
        }
        
        asyncio.create_task(self.process_pdf(job_id, pdf_bytes, document_type))
        
        return job_id
    
    def get_job_status(self, job_id: str) -> Optional[Dict[str, Any]]:
        if job_id not in self.jobs:
            return None
        
        job = self.jobs[job_id]
        return {
            "job_id": job_id,
            "status": job["status"],
            "document_type": job.get("document_type"),
            "progress": job.get("progress", 0),
            "error": job.get("error")
        }
    
    def get_job_result(self, job_id: str) -> Optional[Dict[str, Any]]:
        if job_id not in self.jobs:
            return None
        
        job = self.jobs[job_id]
        
        if job["status"] != JobStatus.COMPLETED:
            return {
                "job_id": job_id,
                "status": job["status"],
                "error": job.get("error")
            }
        
        result = job.get("result", {})
        
        return {
            "job_id": job_id,
            "status": job["status"],
            "document_type": job.get("document_type", "unknown"),
            "fields": result.get("fields", []),
            "raw_data": result,
            "created_at": job["created_at"],
            "error": None
        }
    
    def get_all_completed_jobs(self) -> List[Dict[str, Any]]:
        completed = []
        for job_id, job in self.jobs.items():
            if job["status"] == JobStatus.COMPLETED:
                result = self.get_job_result(job_id)
                if result:
                    completed.append(result)
        
        completed.sort(key=lambda x: x["created_at"], reverse=True)
        return completed


extraction_service = ExtractionService()
