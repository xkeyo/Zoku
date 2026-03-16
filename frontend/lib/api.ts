import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface UploadResponse {
  job_id: string;
  status: string;
  message: string;
}

export interface JobStatusResponse {
  job_id: string;
  status: string;
  document_type?: string;
  progress?: number;
  error?: string;
}

export interface BoundingBox {
  page: number;
  region: string;
}

export interface ExtractedField {
  key: string;
  value: any;
  confidence: number;
  field_type?: string;
  label?: string;
  location?: BoundingBox;
  source_text?: string;  // Exact text from PDF for precise highlighting
}

export interface ExtractionResult {
  job_id: string;
  status: string;
  document_type: string;
  fields: ExtractedField[];
  raw_data: any;
  created_at: string;
  error?: string;
}

export const extractionAPI = {
  uploadPDF: async (file: File, documentType: string): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);

    const response = await axios.post(`${API_BASE_URL}/extraction/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  getJobStatus: async (jobId: string): Promise<JobStatusResponse> => {
    const response = await axios.get(`${API_BASE_URL}/extraction/status/${jobId}`);
    return response.data;
  },

  getResult: async (jobId: string): Promise<ExtractionResult> => {
    const response = await axios.get(`${API_BASE_URL}/extraction/result/${jobId}`);
    return response.data;
  },

  getHistory: async (): Promise<ExtractionResult[]> => {
    const response = await axios.get(`${API_BASE_URL}/extraction/history`);
    return response.data.history;
  },
};
