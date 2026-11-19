"use client";

import * as React from "react";
import Link from "next/link";
import {
  History,
  Clock,
  RotateCcw,
  Eye,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
        if (list.length === 0) {
          // Add realistic demo historical entries if none in storage
          const demoResults: QuizResult[] = [
            {
              id: "res_demo_1",
              quizId: "quiz_cs_01",
              quizTitle: "Operating Systems — Process Scheduling & Synchronization",
              subject: "Computer Science",
              topic: "Process Scheduling",
              completedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
              timeSpentSeconds: 520,
              totalQuestions: 15,
              correctAnswers: 13,
              incorrectAnswers: 2,
              unattemptedQuestions: 0,
              score: 13,
              maxScore: 15,
              scorePercentage: 86.6,
              accuracy: 86.6,
              grade: "A",
              topicBreakdown: [],
              weakTopics: [],
              strongTopics: ["Process Scheduling"],
              recommendations: ["Great pace and strong grasp of scheduler algorithms."],
              questionResults: [],
            },
            {
              id: "res_demo_2",
              quizId: "quiz_ds_02",
              quizTitle: "Data Structures — Balanced Binary Search Trees",
              subject: "Computer Science",
              topic: "AVL & Red-Black Trees",
              completedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
              timeSpentSeconds: 610,
              totalQuestions: 12,
              correctAnswers: 9,
              incorrectAnswers: 3,
              unattemptedQuestions: 0,
              score: 9,
              maxScore: 12,
              scorePercentage: 75.0,
              accuracy: 75.0,
              grade: "B",
              topicBreakdown: [],
              weakTopics: ["Red-Black Rotations"],
              strongTopics: ["AVL Balancing"],
              recommendations: ["Review tree rotation edge cases."],
              questionResults: [],
            },
            {
              id: "res_demo_3",
              quizId: "quiz_math_04",
              quizTitle: "Linear Algebra — Eigenvalues, Eigenvectors & Diagonalization",
              subject: "Mathematics",
              topic: "Matrices & Transformations",
              completedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
              timeSpentSeconds: 840,
              totalQuestions: 20,
              correctAnswers: 16,
              incorrectAnswers: 4,
              unattemptedQuestions: 0,
              score: 16,
              maxScore: 20,
              scorePercentage: 80.0,
              accuracy: 80.0,
              grade: "A",
              topicBreakdown: [],
              weakTopics: [],
              strongTopics: ["Eigenvalues"],
              recommendations: ["Good mastery of diagonalization conditions."],
              questionResults: [],
            },
          ];
          setHistory(demoResults);
        } else {
          setHistory(list);
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="purple">Assessment Records</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
            Quiz History & Past Attempts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review detailed scores, timing breakdowns, and solution explanations.
          </p>
        </div>

        <Link href="/create-quiz">
          <Button variant="default" size="sm" className="font-bold">
            Take Another Quiz
          </Button>
        </Link>
      </div>

      {/* History Items List */}
      <div className="space-y-4">
        {history.map((item) => (
          <Card
            key={item.id}
            className="border-slate-200/90 shadow-xs hover:border-slate-300 transition-all p-4 sm:p-6"
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
                      {item.scorePercentage}%
                    </span>
                    <Badge variant={item.grade === "A+" || item.grade === "A" ? "green" : "orange"} size="sm">
                      Grade {item.grade}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {item.score}/{item.maxScore} points
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/results?quizId=${item.quizId}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      View Report
                    </Button>
                  </Link>

                  <Link href={`/quiz-attempt?id=${item.quizId}`}>
                    <Button variant="default" size="sm" className="text-xs">
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
    </div>
  );
}
