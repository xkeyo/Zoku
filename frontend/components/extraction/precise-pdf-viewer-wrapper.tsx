"use client";

import dynamic from "next/dynamic";
import { ExtractedField } from "@/lib/api";

const PrecisePDFViewer = dynamic(
  () => import("./precise-pdf-viewer").then((mod) => ({ default: mod.PrecisePDFViewer })),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--dp-pdf-bg)' }}>
        <p className="dp-body-secondary">Loading PDF viewer...</p>
      </div>
    ),
  }
);

interface PrecisePDFViewerWrapperProps {
  file: File | null;
  highlightedField?: ExtractedField | null;
}

export function PrecisePDFViewerWrapper({ file, highlightedField }: PrecisePDFViewerWrapperProps) {
  return <PrecisePDFViewer file={file} highlightedField={highlightedField} />;
}
