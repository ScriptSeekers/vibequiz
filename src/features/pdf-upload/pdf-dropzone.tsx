"use client";

import * as React from "react";
import { UploadCloud, FileText, Trash2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { UploadedDocumentMeta } from "@/types/quiz";
import { pdfService } from "@/services/pdf.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PdfDropzoneProps {
  value?: UploadedDocumentMeta;
  onChange: (meta?: UploadedDocumentMeta) => void;
  disabled?: boolean;
}

export function PdfDropzone({ value, onChange, disabled }: PdfDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    setErrorMessage(null);
    const validation = pdfService.validateFile(file);
    if (!validation.isValid) {
      setErrorMessage(validation.error || "Invalid file");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const meta = await pdfService.uploadDocument(file, (pct) => {
        setUploadProgress(pct);
      });
      onChange(meta);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleRemove = async () => {
    if (!value) return;
    try {
      await pdfService.removeDocument(value.id);
      onChange(undefined);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      onChange(undefined);
    }
  };

  return (
    <div className="space-y-3">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        disabled={disabled || isUploading}
        onChange={handleFileChange}
      />

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in-50">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* State 1: Document Uploaded Successfully */}
      {value ? (
        <div className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 flex items-center justify-between gap-4 transition-all">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="h-11 w-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
              <FileText className="w-6 h-6" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-sm font-bold text-slate-900 truncate">
                {value.fileName}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>{pdfService.formatFileSize(value.fileSize)}</span>
                {value.pageCount && (
                  <>
                    <span>•</span>
                    <span>~{value.pageCount} pages</span>
                  </>
                )}
                <Badge variant="green" size="sm">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Ready for AI
                </Badge>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="h-10 w-10 min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            aria-label="Remove uploaded document"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ) : isUploading ? (
        /* State 2: Upload In Progress */
        <div className="p-6 rounded-2xl border-2 border-dashed border-primary-purple bg-primary-purple-light/20 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-primary-purple">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing PDF & Extracting Concepts...</span>
          </div>
          <Progress value={uploadProgress} variant="purple" />
          <p className="text-xs text-slate-500 font-mono">{uploadProgress}% complete</p>
        </div>
      ) : (
        /* State 3: Empty Dropzone Ready for Input */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-3 min-h-[160px] flex flex-col items-center justify-center select-none",
            isDragging
              ? "border-primary-purple bg-primary-purple-light/30 scale-[1.01]"
              : "border-slate-200 bg-surface-ground hover:border-primary-purple/50 hover:bg-white"
          )}
        >
          <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-primary-purple shadow-xs">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-800">
              Drag & Drop your PDF here, or{" "}
              <span className="text-primary-purple underline">browse files</span>
            </p>
            <p className="text-xs text-slate-500">
              Supports textbooks, notes, syllabi, or slides up to 25MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
