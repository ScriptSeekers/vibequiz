"use client";

import * as React from "react";
import { QuestionClientView } from "@/types/question";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, Bookmark, CheckSquare } from "lucide-react";

interface QuestionCardProps {
  question: QuestionClientView;
  currentIndex: number;
  totalQuestions: number;
  currentAnswer?: string | string[];
  isMarkedForReview?: boolean;
  onSelectAnswer: (answer: string | string[]) => void;
  onToggleMarkForReview: () => void;
}

export function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  currentAnswer,
  isMarkedForReview,
  onSelectAnswer,
  onToggleMarkForReview,
}: QuestionCardProps) {
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Helper for multi-select options
  const handleMultiSelect = (optionId: string) => {
    const existing = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
    if (existing.includes(optionId)) {
      onSelectAnswer(existing.filter((id) => id !== optionId));
    } else {
      onSelectAnswer([...existing, optionId]);
    }
  };

  return (
    <Card className="border-slate-200/90 shadow-sm overflow-hidden">
      {/* Top Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5">
        <div
          className="h-full bg-gradient-to-r from-primary-purple to-vibe-blue transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <CardHeader className="space-y-3 pb-3">
        {/* Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <Badge variant="blue" size="sm">
              {question.points} {question.points === 1 ? "Point" : "Points"}
            </Badge>
            <Badge variant="outline" size="sm" className="hidden sm:inline-flex">
              {question.type.replace("-", " ").toUpperCase()}
            </Badge>
          </div>

          <button
            type="button"
            onClick={onToggleMarkForReview}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors min-h-[36px] ${
              isMarkedForReview
                ? "bg-amber-100 text-amber-800 border border-amber-300"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${
                isMarkedForReview ? "fill-amber-600 text-amber-600" : ""
              }`}
            />
            <span>{isMarkedForReview ? "Marked for Review" : "Mark for Review"}</span>
          </button>
        </div>

        {/* Case Scenario Context (if scenario-based) */}
        {question.scenarioContext && (
          <div className="p-3.5 rounded-2xl bg-surface-ground border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-1">
            <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider text-primary-purple">
              Case Context:
            </span>
            <p>{question.scenarioContext}</p>
          </div>
        )}

        {/* Question Statement */}
        <CardTitle className="text-base sm:text-xl font-bold font-heading text-slate-900 leading-relaxed">
          {question.questionText}
        </CardTitle>

        {question.type === "multiple-select" && (
          <p className="text-xs text-primary-purple font-semibold">
            (Select ALL correct answers that apply)
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* 1. Single Choice MCQ & Scenario-based */}
        {(question.type === "single-choice" || question.type === "scenario-based") &&
          question.options && (
            <div className="space-y-2.5">
              {question.options.map((opt, idx) => {
                const isSelected = currentAnswer === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onSelectAnswer(opt.id)}
                    className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all min-h-[48px] select-none ${
                      isSelected
                        ? "border-primary-purple bg-primary-purple-light/40 ring-2 ring-primary-purple/20 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? "bg-primary-purple text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span
                      className={`text-xs sm:text-sm leading-relaxed ${
                        isSelected ? "font-bold text-slate-900" : "text-slate-700"
                      }`}
                    >
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

        {/* 2. Multiple-Select MCQ */}
        {question.type === "multiple-select" && question.options && (
          <div className="space-y-2.5">
            {question.options.map((opt, idx) => {
              const isSelected =
                Array.isArray(currentAnswer) && currentAnswer.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleMultiSelect(opt.id)}
                  className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all min-h-[48px] select-none ${
                    isSelected
                      ? "border-primary-purple bg-primary-purple-light/40 ring-2 ring-primary-purple/20 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                      isSelected
                        ? "bg-primary-purple border-primary-purple text-white shadow-xs"
                        : "bg-white border-slate-300"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isSelected ? "font-bold text-slate-900" : "text-slate-700"
                    }`}
                  >
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 3. True / False */}
        {question.type === "true-false" && (
          <div className="grid grid-cols-2 gap-4 py-2">
            <button
              type="button"
              onClick={() => onSelectAnswer("opt_true")}
              className={`p-5 rounded-2xl border text-center font-heading text-base sm:text-lg font-bold transition-all min-h-[56px] select-none ${
                currentAnswer === "opt_true"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20 shadow-xs"
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
              }`}
            >
              TRUE
            </button>
            <button
              type="button"
              onClick={() => onSelectAnswer("opt_false")}
              className={`p-5 rounded-2xl border text-center font-heading text-base sm:text-lg font-bold transition-all min-h-[56px] select-none ${
                currentAnswer === "opt_false"
                  ? "border-red-500 bg-red-50 text-red-800 ring-2 ring-red-500/20 shadow-xs"
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
              }`}
            >
              FALSE
            </button>
          </div>
        )}

        {/* 4. Fill in the Blank */}
        {question.type === "fill-in-the-blank" && (
          <div className="space-y-2 py-2">
            <label className="text-xs font-semibold text-slate-600 block">
              Type your answer below:
            </label>
            <Input
              type="text"
              placeholder="Enter the missing term or answer"
              value={typeof currentAnswer === "string" ? currentAnswer : ""}
              onChange={(e) => onSelectAnswer(e.target.value)}
              className="font-mono text-sm sm:text-base h-12"
            />
          </div>
        )}

        {/* 5. Short Answer */}
        {question.type === "short-answer" && (
          <div className="space-y-2 py-2">
            <label className="text-xs font-semibold text-slate-600 block">
              Type your concise explanation below:
            </label>
            <textarea
              rows={4}
              placeholder="Formulate your concise conceptual answer here..."
              value={typeof currentAnswer === "string" ? currentAnswer : ""}
              onChange={(e) => onSelectAnswer(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-purple/20 focus:border-primary-purple"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
