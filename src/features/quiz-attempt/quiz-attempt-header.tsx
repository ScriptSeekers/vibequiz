"use client";

import * as React from "react";
import { Clock, LayoutGrid, AlertTriangle, Send } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface QuizAttemptHeaderProps {
  title: string;
  subject: string;
  currentIndex: number;
  totalQuestions: number;
  timeRemainingSeconds: number;
  isTimed: boolean;
  answeredCount: number;
  onOpenNavigator: () => void;
  onSubmitClick: () => void;
}

export function QuizAttemptHeader({
  title,
  subject,
  currentIndex,
  totalQuestions,
  timeRemainingSeconds,
  isTimed,
  answeredCount,
  onOpenNavigator,
  onSubmitClick,
}: QuizAttemptHeaderProps) {
  const isUrgent = isTimed && timeRemainingSeconds > 0 && timeRemainingSeconds <= 120; // < 2 mins

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Title & Question Counter */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <Badge variant="purple" size="sm" className="hidden xs:inline-flex">
              {subject}
            </Badge>
            <span className="font-mono text-xs font-bold text-slate-800">
              Q{currentIndex + 1} / {totalQuestions}
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-bold font-heading text-slate-900 truncate">
            {title}
          </h2>
        </div>
      </div>

      {/* Right: Timer, Mobile Navigator Trigger, and Submit Button */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Countdown Timer */}
        {isTimed && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-colors ${
              isUrgent
                ? "bg-red-50 border-red-300 text-red-600 animate-pulse"
                : "bg-slate-100 border-slate-200 text-slate-700"
            }`}
            aria-live="polite"
          >
            {isUrgent ? (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            ) : (
              <Clock className="w-4 h-4 text-primary-purple" />
            )}
            <span>{formatDuration(timeRemainingSeconds)}</span>
          </div>
        )}

        {/* Mobile Navigator Button */}
        <button
          type="button"
          onClick={onOpenNavigator}
          className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 min-h-[40px]"
          aria-label="Open Question Navigator"
        >
          <LayoutGrid className="w-4 h-4 text-primary-purple" />
          <span>
            {answeredCount}/{totalQuestions}
          </span>
        </button>

        {/* Submit Quiz Button */}
        <Button
          variant="default"
          size="sm"
          onClick={onSubmitClick}
          className="font-bold shadow-xs text-xs sm:text-sm"
        >
          <Send className="w-3.5 h-3.5 mr-1 sm:mr-1.5" />
          <span className="hidden xs:inline">Submit Quiz</span>
          <span className="xs:hidden">Submit</span>
        </Button>
      </div>
    </header>
  );
}
