import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorStateProps {
  message: string;
  title?: string;
}

export function ErrorState({ message, title }: ErrorStateProps) {
  return (
    <div className="flex items-center py-6">
      <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
      <div>
        {title && <p className="font-semibold text-red-900">{title}</p>}
        <span className="text-red-900">{message}</span>
      </div>
    </div>
  );
}

export function ErrorCard({ message, title }: ErrorStateProps) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="py-6">
        <ErrorState message={message} title={title} />
      </CardContent>
    </Card>
  );
}

export function ErrorAlert({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
