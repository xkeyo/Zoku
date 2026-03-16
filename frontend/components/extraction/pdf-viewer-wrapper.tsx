"use client";

import dynamic from "next/dynamic";
import { BoundingBox } from "@/lib/api";

const PDFViewer = dynamic(
  () => import("./pdf-viewer-client").then((mod) => mod.PDFViewerClient),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">Loading PDF viewer...</p>
      </div>
    ),
  }
);

interface PDFViewerWrapperProps {
  file: File | null;
  highlightedRegion?: BoundingBox | null;
}

export function PDFViewerWrapper({ file, highlightedRegion }: PDFViewerWrapperProps) {
  return <PDFViewer file={file} highlightedRegion={highlightedRegion} />;
}
