"use client";

import * as React from "react";
import { QuestionClientView } from "@/types/question";
import { X, CheckCircle2, Bookmark, CircleDot, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuestionNavigatorProps {
  questions: QuestionClientView[];
  currentIndex: number;
  selectedAnswers: Record<string, string | string[]>;
  markedForReview: Record<string, boolean>;
  onSelectQuestion: (index: number) => void;
  onSubmitClick: () => void;
}

export function QuestionNavigatorContent({
  questions,
  currentIndex,
  selectedAnswers,
  markedForReview,
  onSelectQuestion,
  onSubmitClick,
}: QuestionNavigatorProps) {
  const answeredCount = questions.filter((q) => {
    const ans = selectedAnswers[q.id];
    return ans !== undefined && (Array.isArray(ans) ? ans.length > 0 : String(ans).trim().length > 0);
  }).length;

  const markedCount = questions.filter((q) => markedForReview[q.id]).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="space-y-5">
      {/* Summary Chips */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
          <p className="font-mono text-base font-bold text-emerald-700">{answeredCount}</p>
          <p className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">Answered</p>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
          <p className="font-mono text-base font-bold text-amber-700">{markedCount}</p>
          <p className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider">Review</p>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <p className="font-mono text-base font-bold text-slate-700">{unansweredCount}</p>
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">Left</p>
        </div>
      </div>

      {/* Grid of question bubbles */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>Question Overview</span>
          <span className="text-[11px] text-slate-400">Jump directly</span>
        </div>

        <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1">
          {questions.map((q, idx) => {
            const isCurrent = currentIndex === idx;
            const ans = selectedAnswers[q.id];
            const hasAnswer =
              ans !== undefined && (Array.isArray(ans) ? ans.length > 0 : String(ans).trim().length > 0);
            const isMarked = markedForReview[q.id];

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onSelectQuestion(idx)}
                className={cn(
                  "h-10 w-full rounded-xl font-mono text-xs font-bold transition-all relative flex items-center justify-center min-h-[40px] focus:outline-none",
                  isCurrent
                    ? "ring-2 ring-primary-purple ring-offset-2 border-primary-purple bg-primary-purple text-white shadow-xs"
                    : hasAnswer
                    ? "bg-emerald-500 text-white hover:bg-emerald-600 border border-emerald-600"
                    : isMarked
                    ? "bg-amber-100 text-amber-900 border-2 border-amber-400"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                )}
                aria-label={`Go to Question ${idx + 1}`}
              >
                <span>{idx + 1}</span>
                {isMarked && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-500 ring-2 ring-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-100 border border-amber-400" />
          <span>Marked Review</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-primary-purple" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-white border border-slate-300" />
          <span>Unanswered</span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2 border-t border-slate-100">
        <Button
          type="button"
          variant="default"
          size="default"
          onClick={onSubmitClick}
          className="w-full justify-center font-bold min-h-[44px]"
        >
          <Send className="w-4 h-4 mr-2" />
          Submit Examination
        </Button>
      </div>
    </div>
  );
}

// Mobile Slide-up Drawer
export function QuestionNavigatorDrawer({
  isOpen,
  onClose,
  ...props
}: QuestionNavigatorProps & { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs lg:hidden animate-in fade-in duration-200 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-heading font-bold text-slate-900 text-base">
            Question Navigator
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700"
            aria-label="Close Navigator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <QuestionNavigatorContent
          {...props}
          onSelectQuestion={(idx) => {
            props.onSelectQuestion(idx);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
