"use client";

import { useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { extractionAPI, ExtractionResult } from "@/lib/api";

interface ExtractionResultsProps {
  jobId: string;
}

export function ExtractionResults({ jobId }: ExtractionResultsProps) {
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await extractionAPI.getResult(jobId);
        setResult(data);
      } catch (error) {
        console.error("Failed to fetch result:", error);
        toast.error("Failed to load extraction results");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [jobId]);

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result.raw_data, null, 2));
    toast.success("Copied to clipboard!");
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-500/10 text-green-700 dark:text-green-400";
    if (confidence >= 0.6) return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
    return "bg-red-500/10 text-red-700 dark:text-red-400";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result || result.status !== "completed") {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Extracted Data</CardTitle>
            <p className="text-sm text-muted-foreground capitalize">
              {result.document_type} Document
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            Copy JSON
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {result.fields.map((field, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">
                  {field.key.replace(/_/g, " ")}
                </span>
                <Badge
                  variant="secondary"
                  className={getConfidenceColor(field.confidence)}
                >
                  {(field.confidence * 100).toFixed(0)}% confidence
                </Badge>
              </div>
              <div className="rounded-lg bg-muted p-3 text-sm">
                {typeof field.value === "object"
                  ? JSON.stringify(field.value, null, 2)
                  : String(field.value)}
              </div>
              {index < result.fields.length - 1 && <Separator />}
            </div>
          ))}
        </div>

        {result.fields.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No fields extracted from this document
          </div>
        )}
      </CardContent>
    </Card>
  );
}
