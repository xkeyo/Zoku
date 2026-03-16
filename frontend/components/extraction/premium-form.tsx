"use client";

import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Sparkles, Check, FileJson, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ExtractedField } from "@/lib/api";

interface PremiumFormProps {
  fields: ExtractedField[];
  documentType: string;
  isExtracting: boolean;
  currentFieldIndex: number;
  onFieldChange: (key: string, value: string) => void;
  onNavigate: (direction: "next" | "prev") => void;
  onStartMagicFill: () => void;
  onExport: (format: "json" | "csv") => void;
}

interface FieldSection {
  title: string;
  fields: ExtractedField[];
}

export function PremiumForm({
  fields,
  documentType,
  isExtracting,
  currentFieldIndex,
  onFieldChange,
  onNavigate,
  onStartMagicFill,
  onExport,
}: PremiumFormProps) {
  const [filledFields, setFilledFields] = useState<Set<string>>(new Set());
  const [isFilling, setIsFilling] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const groupFieldsIntoSections = (): FieldSection[] => {
    const sections: FieldSection[] = [];
    const sectionMap = new Map<string, ExtractedField[]>();

    fields.forEach((field) => {
      const key = field.key.toLowerCase();
      let sectionName = "General Information";

      if (key.includes("party") || key.includes("name") || key.includes("entity")) {
        sectionName = "Parties";
      } else if (key.includes("date") || key.includes("effective") || key.includes("expir")) {
        sectionName = "Dates";
      } else if (key.includes("amount") || key.includes("price") || key.includes("value") || key.includes("revenue") || key.includes("cost")) {
        sectionName = "Financial Terms";
      } else if (key.includes("address") || key.includes("location") || key.includes("city") || key.includes("state")) {
        sectionName = "Location";
      }

      if (!sectionMap.has(sectionName)) {
        sectionMap.set(sectionName, []);
      }
      sectionMap.get(sectionName)!.push(field);
    });

    sectionMap.forEach((fields, title) => {
      sections.push({ title, fields });
    });

    return sections;
  };

  const sections = groupFieldsIntoSections();

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

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const getStatusDot = (field: ExtractedField, index: number) => {
    const isCurrent = index === currentFieldIndex;
    const isFilled = filledFields.has(field.key);
    const isEmpty = !field.value;

    let color = "var(--dp-status-empty)";
    if (isFilled) color = "var(--dp-status-filled)";
    else if (isCurrent && isFilling) color = "var(--dp-status-filling)";
    else if (isEmpty) color = "var(--dp-status-review)";

    return (
      <div
        className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
        style={{ backgroundColor: color }}
      />
    );
  };

  const isSectionComplete = (section: FieldSection) => {
    return section.fields.every((field) => filledFields.has(field.key) || !field.value);
  };

  if (fields.length === 0) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--dp-white)' }}>
        <p className="dp-body-secondary">Waiting for extraction...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--dp-white)', borderLeft: '1px solid var(--dp-border)' }}>
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--dp-border)' }}>
        <div>
          <h2 className="text-base font-medium capitalize" style={{ color: 'var(--dp-text-primary)' }}>
            {documentType} Document
          </h2>
          {isExtracting && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--dp-text-secondary)' }}>Processing extraction...</p>
          )}
        </div>
        
        {!isExtracting && fields.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => onExport("json")}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-all hover:bg-black/5 flex items-center gap-1.5"
              style={{
                border: '1px solid var(--dp-border)',
                backgroundColor: 'var(--dp-white)',
                color: 'var(--dp-text-primary)',
              }}
            >
              <FileJson className="h-3.5 w-3.5" />
              <span>JSON</span>
            </button>
            <button
              onClick={() => onExport("csv")}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-all hover:bg-black/5 flex items-center gap-1.5"
              style={{
                border: '1px solid var(--dp-border)',
                backgroundColor: 'var(--dp-white)',
                color: 'var(--dp-text-primary)',
              }}
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>CSV</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto px-6 py-4 space-y-6">
        {sections.map((section) => {
          const isCollapsed = collapsedSections.has(section.title);
          const isComplete = isSectionComplete(section);

          return (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between py-2 hover:opacity-70 transition-opacity"
              >
                <div className="flex items-center gap-2">
                  <span className="dp-section-header">{section.title}</span>
                  {isComplete && (
                    <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--dp-success)' }}>
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
                  style={{ color: 'var(--dp-text-hint)' }}
                />
              </button>

              {!isCollapsed && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {section.fields.map((field, sectionIndex) => {
                    const globalIndex = fields.findIndex((f) => f.key === field.key);
                    const isCurrent = globalIndex === currentFieldIndex;
                    const isFilled = filledFields.has(field.key);
                    const isEmpty = !field.value;

                    return (
                      <div
                        key={field.key}
                        className={`p-3 rounded-lg transition-all duration-200 ${
                          isCurrent ? 'ring-2 ring-offset-1 ring-(--dp-primary)' : ''
                        }`}
                        style={{
                          backgroundColor: 'var(--dp-white)',
                          border: `1px solid ${isEmpty && !isFilled ? 'var(--dp-error)' : 'var(--dp-border)'}`,
                          borderLeftWidth: isEmpty && !isFilled ? '3px' : '1px',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            {getStatusDot(field, globalIndex)}
                            <label className="text-xs font-medium" style={{ color: 'var(--dp-text-secondary)' }}>
                              {field.label || field.key.replace(/_/g, " ")}
                            </label>
                          </div>
                          {field.confidence !== undefined && (
                            <span
                              className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                              style={{
                                backgroundColor:
                                  field.confidence >= 0.8
                                    ? 'rgba(68, 131, 97, 0.1)'
                                    : field.confidence >= 0.6
                                    ? 'rgba(255, 201, 64, 0.15)'
                                    : 'rgba(224, 62, 62, 0.1)',
                                color:
                                  field.confidence >= 0.8
                                    ? 'var(--dp-success)'
                                    : field.confidence >= 0.6
                                    ? '#D97706'
                                    : 'var(--dp-error)',
                              }}
                            >
                              {Math.round(field.confidence * 100)}%
                            </span>
                          )}
                        </div>

                        <Input
                          type={
                            field.field_type === "date"
                              ? "date"
                              : field.field_type === "number"
                              ? "number"
                              : field.field_type === "email"
                              ? "email"
                              : "text"
                          }
                          value={field.value || ""}
                          onChange={(e) => onFieldChange(field.key, e.target.value)}
                          readOnly={!isFilled && !isEmpty}
                          placeholder={!isFilled && !isEmpty ? String(field.value || "") : ""}
                          className="h-9 text-sm rounded-md transition-all"
                          style={{
                            borderWidth: '1px',
                            borderColor: 'var(--dp-border)',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isExtracting && (
        <div
          className="p-5 space-y-3"
          style={{
            borderTop: '1px solid var(--dp-border)',
            backgroundColor: 'var(--dp-white)',
          }}
        >
          {currentFieldIndex >= 0 && currentFieldIndex < fields.length && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate("prev")}
                disabled={currentFieldIndex === 0}
                className="px-3 py-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 active:scale-95"
                style={{
                  border: '1px solid var(--dp-border)',
                  backgroundColor: 'var(--dp-white)',
                  color: 'var(--dp-text-primary)',
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={fillCurrentField}
                disabled={isFilling || filledFields.has(fields[currentFieldIndex].key)}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
                style={{
                  backgroundColor: 'var(--dp-primary)',
                  color: 'var(--dp-white)',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm">
                    {filledFields.has(fields[currentFieldIndex].key) ? "Filled" : "Magic Fill"}
                  </span>
                </div>
              </button>

              <button
                onClick={() => onNavigate("next")}
                disabled={currentFieldIndex === fields.length - 1}
                className="px-3 py-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 active:scale-95"
                style={{
                  border: '1px solid var(--dp-border)',
                  backgroundColor: 'var(--dp-white)',
                  color: 'var(--dp-text-primary)',
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {currentFieldIndex === -1 && (
            <button
              onClick={onStartMagicFill}
              className="w-full px-4 py-2.5 rounded-lg font-medium transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--dp-primary)',
                color: 'var(--dp-white)',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm">Start Magic Fill</span>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
