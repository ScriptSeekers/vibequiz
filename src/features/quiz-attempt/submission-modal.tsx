"use client";

import * as React from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Bookmark, Send } from "lucide-react";

interface SubmissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalQuestions: number;
  answeredCount: number;
  markedCount: number;
  isSubmitting: boolean;
  onConfirmSubmit: () => void;
}

export function SubmissionModal({
  open,
  onOpenChange,
  totalQuestions,
  answeredCount,
  markedCount,
  isSubmitting,
  onConfirmSubmit,
}: SubmissionModalProps) {
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader onClose={() => onOpenChange(false)}>
        <DialogTitle>Confirm Quiz Submission</DialogTitle>
        <DialogDescription>
          Are you ready to submit your assessment for deterministic grading and AI feedback?
        </DialogDescription>
      </DialogHeader>

      <DialogContent>
        {/* Status Breakdown Cards */}
        <div className="grid grid-cols-3 gap-2.5 text-center py-2">
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <p className="font-mono text-lg font-bold text-emerald-800">{answeredCount}</p>
            <p className="text-[10px] font-semibold text-emerald-700 uppercase">Answered</p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
            <Bookmark className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <p className="font-mono text-lg font-bold text-amber-800">{markedCount}</p>
            <p className="text-[10px] font-semibold text-amber-700 uppercase">Review</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <AlertTriangle className="w-5 h-5 text-slate-500 mx-auto mb-1" />
            <p className="font-mono text-lg font-bold text-slate-800">{unansweredCount}</p>
            <p className="text-[10px] font-semibold text-slate-600 uppercase">Unanswered</p>
          </div>
        </div>

        {/* Warning if unanswered questions exist */}
        {unansweredCount > 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">You have {unansweredCount} unanswered questions.</p>
              <p className="text-amber-700 text-[11px] mt-0.5">
                Unanswered questions will be evaluated as 0 points. You can return to the exam to complete them.
              </p>
            </div>
          </div>
        )}

        <p className="text-xs text-slate-500 text-center pt-1">
          Once submitted, your responses will be evaluated against server keys and detailed AI explanations will be generated.
        </p>
      </DialogContent>

      <DialogFooter>
        <Button
          variant="outline"
          size="default"
          onClick={() => onOpenChange(false)}
          disabled={isSubmitting}
        >
          Return to Exam
        </Button>
        <Button
          variant="default"
          size="default"
          onClick={onConfirmSubmit}
          isLoading={isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
        >
          <Send className="w-4 h-4 mr-1.5" />
          Confirm & Submit
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
