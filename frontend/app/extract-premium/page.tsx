"use client";

import { useState } from "react";
import { FileJson, FileSpreadsheet, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { PrecisePDFViewerWrapper } from "@/components/extraction/precise-pdf-viewer-wrapper";
import { PremiumForm } from "@/components/extraction/premium-form";
import { extractionAPI, ExtractedField } from "@/lib/api";
import { toast } from "sonner";

export default function ExtractPremiumPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [fields, setFields] = useState<ExtractedField[]>([]);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(-1);
  const [highlightedField, setHighlightedField] = useState<ExtractedField | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const handleUploadSuccess = async (uploadedJobId: string, file: File) => {
    setPdfFile(file);
    setJobId(uploadedJobId);
    setIsExtracting(true);
    setFields([]);
    setCurrentFieldIndex(-1);
    
    pollForResults(uploadedJobId);
  };

  const pollForResults = async (jobId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const status = await extractionAPI.getJobStatus(jobId);
        
        if (status.document_type) {
          setDocumentType(status.document_type);
        }
        
        if (status.progress) {
          setProgress(status.progress);
        }

        if (status.status === "completed") {
          clearInterval(pollInterval);
          const result = await extractionAPI.getResult(jobId);
          
          if (result.fields && result.fields.length > 0) {
            setFields(result.fields);
            setIsExtracting(false);
            toast.success("Extraction complete!");
          }
        } else if (status.status === "failed") {
          clearInterval(pollInterval);
          setIsExtracting(false);
          toast.error(status.error || "Extraction failed");
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 2000);
  };

  const handleStartMagicFill = () => {
    if (fields.length > 0) {
      setCurrentFieldIndex(0);
      setHighlightedField(fields[0]);
    }
  };

  const handleNavigate = (direction: "next" | "prev") => {
    setCurrentFieldIndex((prev) => {
      const newIndex =
        direction === "next"
          ? Math.min(fields.length - 1, prev + 1)
          : Math.max(0, prev - 1);

      setHighlightedField(fields[newIndex] || null);

      return newIndex;
    });
  };

  const handleFieldChange = (key: string, value: string) => {
    setFields((prev) =>
      prev.map((field) => (field.key === key ? { ...field, value } : field))
    );
  };

  const handleExport = (format: "json" | "csv") => {
    const data = fields.reduce((acc, field) => {
      acc[field.key] = field.value;
      return acc;
    }, {} as Record<string, any>);

    if (format === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${documentType}_extraction.json`;
      a.click();
      toast.success("Exported as JSON");
    } else {
      const csvRows = [
        ["Field", "Value"],
        ...fields.map((f) => [f.label || f.key, f.value]),
      ];
      const csvContent = csvRows.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${documentType}_extraction.csv`;
      a.click();
      toast.success("Exported as CSV");
    }
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--dp-surface)' }}>
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{
          backgroundColor: 'var(--dp-white)',
          borderBottom: '1px solid var(--dp-border)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--dp-primary)' }}
          >
            <FileText className="h-5 w-5" style={{ color: 'var(--dp-white)' }} />
          </div>
          <div>
            <h1 className="text-lg font-semibold" style={{ color: 'var(--dp-text-primary)' }}>
              DocParser
            </h1>
            <p className="text-xs" style={{ color: 'var(--dp-text-secondary)' }}>
              AI-powered document extraction
            </p>
          </div>
        </div>

        {isExtracting && (
          <div className="flex items-center gap-3">
            <div
              className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: 'var(--dp-surface)',
                color: 'var(--dp-text-secondary)',
              }}
            >
              Processing... {progress}%
            </div>
            <div className="w-48 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--dp-surface)' }}>
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  backgroundColor: 'var(--dp-primary)',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {!pdfFile ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            <input
              type="file"
              id="pdf-upload"
              accept=".pdf"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    const response = await extractionAPI.uploadPDF(file, "auto");
                    handleUploadSuccess(response.job_id, file);
                  } catch (error) {
                    toast.error("Upload failed");
                  }
                }
              }}
            />
            <label
              htmlFor="pdf-upload"
              className="block p-12 rounded-2xl cursor-pointer transition-all hover:border-[var(--dp-primary)]"
              style={{
                border: '2px dashed var(--dp-border)',
                backgroundColor: 'var(--dp-white)',
              }}
            >
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--dp-surface)' }}
              >
                <FileText className="h-8 w-8" style={{ color: 'var(--dp-primary)' }} />
              </div>
              <h3 className="text-center text-base font-medium mb-2" style={{ color: 'var(--dp-text-primary)' }}>
                Upload PDF Document
              </h3>
              <p className="text-center text-sm" style={{ color: 'var(--dp-text-secondary)' }}>
                Click to browse or drag and drop your file here
              </p>
            </label>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - PDF Viewer (45%) */}
          <div className="w-[45%]">
            <PrecisePDFViewerWrapper file={pdfFile} highlightedField={highlightedField} />
          </div>

          {/* Right Panel - Form (55%) */}
          <div className="w-[55%]">
            <PremiumForm
              fields={fields}
              documentType={documentType}
              isExtracting={isExtracting}
              currentFieldIndex={currentFieldIndex}
              onFieldChange={handleFieldChange}
              onNavigate={handleNavigate}
              onStartMagicFill={handleStartMagicFill}
              onExport={handleExport}
            />
          </div>
        </div>
      )}
    </div>
  );
}
