"use client";

import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ZoomIn, ZoomOut } from "lucide-react";
import { ExtractedField } from "@/lib/api";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface TextSpan {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PrecisePDFViewerProps {
  file: File | null;
  highlightedField?: ExtractedField | null;
}

export function PrecisePDFViewer({ file, highlightedField }: PrecisePDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.3);
  const [textSpans, setTextSpans] = useState<Map<number, TextSpan[]>>(new Map());
  const [highlights, setHighlights] = useState<Array<{ x: number; y: number; width: number; height: number }>>([]);
  const [isApproximate, setIsApproximate] = useState(false);
  const [pageHeight, setPageHeight] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const extractTextLayer = async (pageNumber: number) => {
    if (!file) return;

    try {
      const loadingTask = pdfjs.getDocument(URL.createObjectURL(file));
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const viewport = page.getViewport({ scale });

      setPageHeight(viewport.height);
      setPageWidth(viewport.width);

      const spans: TextSpan[] = [];
      
      textContent.items.forEach((item: any) => {
        if (item.str && item.transform) {
          const transform = item.transform;
          const x = transform[4];
          const y = viewport.height - transform[5];
          const width = item.width * transform[0];
          const height = item.height || 12;

          spans.push({
            text: item.str,
            x: x,
            y: y - height,
            width: width,
            height: height,
          });
        }
      });

      setTextSpans((prev) => new Map(prev).set(pageNumber, spans));
    } catch (error) {
      console.error("Error extracting text layer:", error);
    }
  };

  const findTextInPage = (searchText: string, pageNumber: number): Array<{ x: number; y: number; width: number; height: number }> => {
    const spans = textSpans.get(pageNumber);
    if (!spans || !searchText) return [];

    const results: Array<{ x: number; y: number; width: number; height: number }> = [];
    const normalizedSearch = searchText.toLowerCase().trim();

    let concatenated = "";
    let matchSpans: TextSpan[] = [];

    for (let i = 0; i < spans.length; i++) {
      const span = spans[i];
      
      if (matchSpans.length === 0) {
        matchSpans = [span];
        concatenated = span.text;
      } else {
        matchSpans.push(span);
        concatenated += span.text;
      }

      const normalizedConcat = concatenated.toLowerCase().replace(/\s+/g, ' ').trim();
      
      if (normalizedConcat.includes(normalizedSearch.replace(/\s+/g, ' '))) {
        const minX = Math.min(...matchSpans.map(s => s.x));
        const minY = Math.min(...matchSpans.map(s => s.y));
        const maxX = Math.max(...matchSpans.map(s => s.x + s.width));
        const maxY = Math.max(...matchSpans.map(s => s.y + s.height));

        results.push({
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
        });
        
        break;
      }

      if (concatenated.length > normalizedSearch.length * 3) {
        concatenated = span.text;
        matchSpans = [span];
      }
    }

    if (results.length === 0) {
      const words = normalizedSearch.split(/\s+/).filter(w => w.length > 2);
      words.forEach(word => {
        spans.forEach(span => {
          if (span.text.toLowerCase().includes(word)) {
            results.push({
              x: span.x,
              y: span.y,
              width: span.width,
              height: span.height,
            });
          }
        });
      });
    }

    return results;
  };

  useEffect(() => {
    if (!highlightedField) {
      setHighlights([]);
      setIsApproximate(false);
      return;
    }

    const targetPage = highlightedField.location?.page || 1;
    
    if (currentPage !== targetPage) {
      setCurrentPage(targetPage);
    }

    if (!textSpans.has(targetPage)) {
      extractTextLayer(targetPage);
      return;
    }

    if (highlightedField.source_text) {
      const foundHighlights = findTextInPage(highlightedField.source_text, targetPage);
      
      if (foundHighlights.length > 0) {
        setHighlights(foundHighlights);
        setIsApproximate(false);
      } else {
        setHighlights([]);
        setIsApproximate(true);
      }
    } else {
      setHighlights([]);
      setIsApproximate(true);
    }
  }, [highlightedField, textSpans, currentPage]);

  useEffect(() => {
    if (currentPage && !textSpans.has(currentPage)) {
      extractTextLayer(currentPage);
    }
  }, [currentPage, file, scale]);

  const getRegionHighlight = (region: string) => {
    const baseStyle = {
      position: "absolute" as const,
      left: "4%",
      right: "4%",
      backgroundColor: "rgba(255, 224, 102, 0.3)",
      pointerEvents: "none" as const,
      zIndex: 10,
      borderRadius: "4px",
      border: "2px dashed rgba(255, 193, 7, 0.8)",
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

      <div className="flex-1 overflow-auto p-8 flex items-start justify-center">
        <div className="relative rounded-lg overflow-hidden dp-shadow-lg">
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <Page
              pageNumber={currentPage}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>

          {highlights.length > 0 && pageHeight > 0 && (
            <svg
              className="absolute top-0 left-0 pointer-events-none"
              style={{
                width: `${pageWidth * scale}px`,
                height: `${pageHeight * scale}px`,
                zIndex: 10,
              }}
            >
              {highlights.map((highlight, index) => (
                <rect
                  key={index}
                  x={highlight.x * scale}
                  y={highlight.y * scale}
                  width={highlight.width * scale}
                  height={highlight.height * scale}
                  fill="rgba(255, 224, 102, 0.4)"
                  stroke="rgba(255, 193, 7, 0.8)"
                  strokeWidth="1"
                  rx="2"
                  className="animate-pulse"
                />
              ))}
            </svg>
          )}

          {isApproximate && highlightedField?.location && (
            <div 
              className="dp-pulse-highlight" 
              style={getRegionHighlight(highlightedField.location.region)} 
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
          {isApproximate && (
            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--dp-warning)', color: '#8B5A00' }}>
              Approximate
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
