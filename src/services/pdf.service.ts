import { UploadedDocumentMeta } from "@/types/quiz";

export interface IPdfService {
  validateFile(file: File): { isValid: boolean; error?: string };
  uploadDocument(
    file: File,
    onProgress?: (percentage: number) => void
  ): Promise<UploadedDocumentMeta>;
  removeDocument(docId: string): Promise<void>;
  formatFileSize(bytes: number): string;
}

export const MAX_PDF_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

class MockPdfService implements IPdfService {
  validateFile(file: File): { isValid: boolean; error?: string } {
    const isPdfType =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isPdfType) {
      return {
        isValid: false,
        error: "Invalid file format. Please upload a valid .pdf document.",
      };
    }

    if (file.size > MAX_PDF_SIZE_BYTES) {
      return {
        isValid: false,
        error: `File size exceeds 25MB limit (Selected: ${this.formatFileSize(file.size)}).`,
      };
    }

    if (file.size === 0) {
      return {
        isValid: false,
        error: "The uploaded file is empty.",
      };
    }

    return { isValid: true };
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  async uploadDocument(
    file: File,
    onProgress?: (percentage: number) => void
  ): Promise<UploadedDocumentMeta> {
    const validation = this.validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Simulate realistic chunked upload progress
    const steps = [15, 35, 60, 85, 100];
    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      if (onProgress) onProgress(step);
    }

    // Simulate brief document parsing phase
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Simulated page count based on file size
    const estimatedPages = Math.max(1, Math.min(60, Math.round(file.size / (150 * 1024))));

    const meta: UploadedDocumentMeta = {
      id: `doc_${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      status: "ready",
      pageCount: estimatedPages,
    };

    return meta;
  }

  async removeDocument(_docId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
}

export const pdfService: IPdfService = new MockPdfService();
