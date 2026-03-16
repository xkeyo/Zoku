"use client";

import { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ZoomIn, ZoomOut } from "lucide-react";
import { BoundingBox } from "@/lib/api";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerClientProps {
  file: File | null;
  highlightedRegion?: BoundingBox | null;
}

export function PDFViewerClient({ file, highlightedRegion }: PDFViewerClientProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.3);
  const containerRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const getHighlightStyle = (region: string) => {
    const baseStyle = {
      position: "absolute" as const,
      left: "4%",
      right: "4%",
      backgroundColor: "rgba(255, 224, 102, 0.4)",
      pointerEvents: "none" as const,
      zIndex: 10,
      borderRadius: "4px",
      transition: "opacity 200ms ease-in-out",
    };

    switch (region) {
      case "top":
        return { ...baseStyle, top: "4%", height: "30%" };
      case "middle":
        return { ...baseStyle, top: "37%", height: "30%" };
      case "bottom":
        return { ...baseStyle, top: "70%", height: "26%" };
      default:
        return { ...baseStyle, top: "4%", height: "92%" };
    }
  };

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--dp-pdf-bg)' }}>
        <p className="dp-body-secondary">No PDF loaded</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--dp-pdf-bg)' }}>
      <div className="flex items-center justify-center gap-2 py-4">
        <div 
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg"
          style={{ 
            backgroundColor: 'var(--dp-white)',
            border: '1px solid var(--dp-border)',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
          }}
        >
          <button
            onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-black/5 transition-all"
            style={{ color: 'var(--dp-text-secondary)' }}
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="dp-body-secondary min-w-[50px] text-center text-sm font-medium">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(2.0, s + 0.2))}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-black/5 transition-all"
            style={{ color: 'var(--dp-text-secondary)' }}
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-8 flex items-start justify-center"
      >
        <div className="relative rounded-lg overflow-hidden dp-shadow-lg">
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <Page
              pageNumber={currentPage}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>

          {highlightedRegion && highlightedRegion.page === currentPage && (
            <div 
              className="dp-pulse-highlight" 
              style={getHighlightStyle(highlightedRegion.region)} 
            />
          )}
        </div>
      </div>

      <div className="py-4 text-center">
        <div 
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ 
            backgroundColor: 'var(--dp-white)',
            border: '1px solid var(--dp-border)',
            color: 'var(--dp-text-secondary)'
          }}
        >
          Page {currentPage} of {numPages}
        </div>
      </div>
    </div>
  );
}
