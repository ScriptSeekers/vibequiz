"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizAttemptControlsProps {
  currentIndex: number;
  totalQuestions: number;
  hasAnswer: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onClearAnswer: () => void;
}

export function QuizAttemptControls({
  currentIndex,
  totalQuestions,
  hasAnswer,
  onPrevious,
  onNext,
  onSubmit,
  onClearAnswer,
}: QuizAttemptControlsProps) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      {/* Previous Button */}
      <Button
        type="button"
        variant="outline"
        size="default"
        onClick={onPrevious}
        disabled={isFirst}
        className="min-h-[44px] px-4 font-semibold"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        <span className="hidden xs:inline">Previous</span>
      </Button>

      {/* Clear Response */}
      {hasAnswer && (
        <button
          type="button"
          onClick={onClearAnswer}
          className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors inline-flex items-center gap-1 min-h-[44px] px-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Answer</span>
        </button>
      )}

      {/* Next or Finish Button */}
      {isLast ? (
        <Button
          type="button"
          variant="default"
          size="default"
          onClick={onSubmit}
          className="min-h-[44px] px-6 font-bold bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 text-white"
        >
          <span>Submit Quiz</span>
          <CheckCircle2 className="w-4 h-4 ml-1.5" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="default"
          size="default"
          onClick={onNext}
          className="min-h-[44px] px-6 font-bold shadow-md shadow-primary-purple/20"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      )}
    </div>
  );
}
