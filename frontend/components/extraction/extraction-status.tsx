"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extractionAPI, JobStatusResponse } from "@/lib/api";

interface ExtractionStatusProps {
  jobId: string;
  onComplete: () => void;
}

export function ExtractionStatus({ jobId, onComplete }: ExtractionStatusProps) {
  const [status, setStatus] = useState<JobStatusResponse | null>(null);
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    if (!polling) return;

    const pollStatus = async () => {
      try {
        const data = await extractionAPI.getJobStatus(jobId);
        setStatus(data);

        if (data.status === "completed" || data.status === "failed") {
          setPolling(false);
          if (data.status === "completed") {
            onComplete();
          }
        }
      } catch (error) {
        console.error("Failed to fetch status:", error);
      }
    };

    pollStatus();
    const interval = setInterval(pollStatus, 2000);

    return () => clearInterval(interval);
  }, [jobId, polling, onComplete]);

  if (!status) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status.status === "processing" && (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              Processing Document
            </>
          )}
          {status.status === "pending" && (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
              Queued
            </>
          )}
          {status.status === "completed" && (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Extraction Complete
            </>
          )}
          {status.status === "failed" && (
            <>
              <XCircle className="h-5 w-5 text-red-500" />
              Extraction Failed
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status.document_type && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span className="capitalize">{status.document_type} Document</span>
          </div>
        )}

        {status.status === "processing" && status.progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{status.progress}%</span>
            </div>
            <Progress value={status.progress} />
          </div>
        )}

        {status.error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-4 text-sm text-red-600 dark:text-red-400">
            {status.error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
