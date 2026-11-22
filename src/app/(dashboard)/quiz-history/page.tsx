"use client";

import * as React from "react";
import Link from "next/link";
import {
  History,
  Clock,
  RotateCcw,
  Eye,
  Calendar,
  Plus,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { resultsService } from "@/services/results.service";
import { QuizResult } from "@/types/result";
import { formatDuration } from "@/lib/utils";

export default function QuizHistoryPage() {
  const [history, setHistory] = React.useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const list = await resultsService.getAllResults();
        setHistory(list);
      } catch (err) {
        console.error("Failed to load quiz history:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="purple" size="sm">Assessment Records</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
            Quiz History & Past Attempts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review detailed scores, timing breakdowns, and solution explanations.
          </p>
        </div>

        <Link href="/create-quiz">
          <Button variant="default" size="default" className="w-full sm:w-auto font-bold shadow-md shadow-primary-purple/20 min-h-[44px]">
            <Plus className="w-4 h-4 mr-1.5" />
            Create New Quiz
          </Button>
        </Link>
      </div>

      {/* History Items List or Clean Empty State */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-primary-purple-light text-primary-purple flex items-center justify-center mx-auto animate-pulse">
            <History className="w-5 h-5 animate-spin" />
          </div>
          <p className="text-sm font-semibold text-slate-600">Loading attempt history...</p>
        </div>
      ) : history.length > 0 ? (
        <div className="space-y-3.5 sm:space-y-4">
          {history.map((item) => (
            <Card
              key={item.id}
              className="border-slate-200/90 shadow-xs hover:border-slate-300 transition-all p-4 sm:p-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Column: Info */}
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="purple" size="sm">
                      {item.subject}
                    </Badge>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.completedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(item.timeSpentSeconds)}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 leading-snug">
                    {item.quizTitle}
                  </h3>

                  <p className="text-xs text-slate-500">
                    {item.totalQuestions} Questions • {item.correctAnswers} Correct •{" "}
                    {item.incorrectAnswers} Incorrect
                  </p>
                </div>

                {/* Right Column: Score, Grade & Actions */}
                <div className="flex items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                  <div className="text-left lg:text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black font-heading text-slate-900">
                        {Math.round(item.scorePercentage)}%
                      </span>
                      <Badge
                        variant={
                          item.grade === "A+" || item.grade === "A"
                            ? "green"
                            : item.grade === "B"
                            ? "blue"
                            : "orange"
                        }
                        size="sm"
                      >
                        Grade {item.grade}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.score}/{item.maxScore} points
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/results?quizId=${item.quizId}`}>
                      <Button variant="outline" size="sm" className="text-xs min-h-[40px]">
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Review
                      </Button>
                    </Link>

                    <Link href={`/quiz-attempt?id=${item.quizId}`}>
                      <Button variant="default" size="sm" className="text-xs min-h-[40px]">
                        <RotateCcw className="w-3.5 h-3.5 mr-1" />
                        Retake
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Fresh Empty State for New Users */
        <div className="p-8 sm:p-14 text-center rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-primary-purple-light text-primary-purple flex items-center justify-center mx-auto shadow-xs">
            <History className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-heading font-extrabold text-slate-900 text-xl sm:text-2xl">
              No Quiz Attempts Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Once you complete an assessment, your scores, timing breakdowns, question explanations, and review reports will be tracked here.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/create-quiz" className="w-full sm:w-auto">
              <Button variant="default" size="default" className="w-full sm:w-auto font-bold shadow-md shadow-primary-purple/20 min-h-[46px]">
                <Plus className="w-4 h-4 mr-1.5" />
                Take Your First Quiz
              </Button>
            </Link>
            <Link href="/my-quizzes" className="w-full sm:w-auto">
              <Button variant="outline" size="default" className="w-full sm:w-auto text-slate-700 min-h-[46px]">
                <BookOpen className="w-4 h-4 mr-1.5" />
                Browse Library
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
