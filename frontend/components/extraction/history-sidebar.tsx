"use client";

import { useEffect, useState } from "react";
import { Clock, FileText, ChevronRight, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { extractionAPI, ExtractionResult } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

interface HistorySidebarProps {
  onSelectJob: (jobId: string) => void;
  currentJobId?: string;
  refreshTrigger?: number;
}

export function HistorySidebar({ onSelectJob, currentJobId, refreshTrigger }: HistorySidebarProps) {
  const [history, setHistory] = useState<ExtractionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      setRefreshing(true);
      const data = await extractionAPI.getHistory();
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            History
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchHistory}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No extraction history yet
            </div>
          ) : (
            <div className="space-y-1 p-4">
              {history.map((item) => (
                <Button
                  key={item.job_id}
                  variant={currentJobId === item.job_id ? "secondary" : "ghost"}
                  className="w-full justify-start h-auto py-3 px-3"
                  onClick={() => onSelectJob(item.job_id)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <FileText className="h-4 w-4 mt-0.5 shrink-0" />
                    <div className="flex-1 text-left space-y-1 min-w-0">
                      <p className="text-sm font-medium capitalize truncate">
                        {item.document_type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(item.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.fields.length} fields
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
                  </div>
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
