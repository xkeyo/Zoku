"use client";

import { useState } from "react";
import { Download, FileJson, FileSpreadsheet, Play, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExtractedField } from "@/lib/api";

interface MagicFormProps {
  fields: ExtractedField[];
  documentType: string;
  isExtracting: boolean;
  currentFieldIndex: number;
  onFieldChange: (key: string, value: string) => void;
  onExport: (format: "json" | "csv") => void;
  onNavigate: (direction: "next" | "prev") => void;
  onStartMagicFill: () => void;
}

export function MagicForm({
  fields,
  documentType,
  isExtracting,
  currentFieldIndex,
  onFieldChange,
  onExport,
  onNavigate,
  onStartMagicFill,
}: MagicFormProps) {
  const [filledFields, setFilledFields] = useState<Set<string>>(new Set());
  const [isFilling, setIsFilling] = useState(false);

  const fillCurrentField = () => {
    if (currentFieldIndex >= 0 && currentFieldIndex < fields.length) {
      const field = fields[currentFieldIndex];
      setIsFilling(true);
      
      const value = String(field.value || "");
      let currentIndex = 0;

      const interval = setInterval(() => {
        if (currentIndex <= value.length) {
          onFieldChange(field.key, value.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setFilledFields((prev) => new Set([...prev, field.key]));
          setIsFilling(false);
        }
      }, 30);
    }
  };

  const getFieldInput = (field: ExtractedField, index: number) => {
    const isCurrent = index === currentFieldIndex;
    const isFilled = filledFields.has(field.key);
    const isEmpty = !field.value;
    const extractedValue = String(field.value || "");

    return (
      <div
        key={field.key}
        className={`space-y-3 p-4 rounded-lg border transition-all duration-500 ${
          isCurrent 
            ? "ring-2 ring-primary border-primary bg-primary/5 shadow-lg scale-105" 
            : "border-border bg-card"
        }`}
      >
        <div className="flex items-center justify-between">
          <Label htmlFor={field.key} className="flex items-center gap-2 font-medium">
            {field.label || field.key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
            {isEmpty && (
              <Badge variant="destructive" className="text-xs">
                Missing
              </Badge>
            )}
            {isFilled && (
              <Badge variant="default" className="text-xs bg-green-500">
                Filled
              </Badge>
            )}
          </Label>
          <Badge
            variant="secondary"
            className={`text-xs font-semibold ${
              field.confidence >= 0.8
                ? "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30"
                : field.confidence >= 0.6
                ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30"
                : "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30"
            }`}
          >
            {Math.round(field.confidence * 100)}%
          </Badge>
        </div>

        {!isEmpty && !isFilled && (
          <div className="text-sm p-2 rounded bg-muted/50 border border-dashed">
            <span className="text-muted-foreground">Extracted: </span>
            <span className="font-mono">{extractedValue}</span>
          </div>
        )}

        <Input
          id={field.key}
          type={field.field_type === "date" ? "date" : field.field_type === "number" ? "number" : field.field_type === "email" ? "email" : field.field_type === "phone" ? "tel" : "text"}
          value={field.value || ""}
          onChange={(e) => onFieldChange(field.key, e.target.value)}
          className={`${
            isEmpty ? "border-red-500 bg-red-50 dark:bg-red-950/20" : ""
          }`}
          placeholder={isEmpty ? "Fill manually" : ""}
          readOnly={!isFilled && !isEmpty}
        />
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="capitalize">{documentType} Form</CardTitle>
            {isExtracting && (
              <p className="text-sm text-muted-foreground mt-1">
                Extracting field {currentFieldIndex + 1} of {fields.length}...
              </p>
            )}
          </div>
          {!isExtracting && fields.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport("json")}
              >
                <FileJson className="h-4 w-4 mr-2" />
                JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport("csv")}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                CSV
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto space-y-4">
        {fields.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Waiting for extraction to begin...</p>
          </div>
        ) : (
          <>
            {fields.map((field, index) => getFieldInput(field, index))}

            {!isExtracting && fields.length > 0 && (
              <>
                <div className="sticky bottom-0 bg-background/95 backdrop-blur p-4 border-t space-y-3 -mx-6 -mb-6">
                  {currentFieldIndex >= 0 && currentFieldIndex < fields.length && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate("prev")}
                        disabled={currentFieldIndex === 0}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      
                      <Button
                        className="flex-1"
                        onClick={fillCurrentField}
                        disabled={isFilling || filledFields.has(fields[currentFieldIndex].key)}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {filledFields.has(fields[currentFieldIndex].key) ? "Filled" : "Magic Fill"}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate("next")}
                        disabled={currentFieldIndex === fields.length - 1}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                  
                  {currentFieldIndex === -1 && (
                    <Button className="w-full" onClick={onStartMagicFill}>
                      <Play className="h-4 w-4 mr-2" />
                      Start Magic Fill
                    </Button>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => onExport("json")}
                    >
                      <FileJson className="h-4 w-4 mr-2" />
                      Export JSON
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => onExport("csv")}
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
