"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  PlusCircle,
  Printer,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Target,
  Sparkles,
  Layers,
} from "lucide-react";
import { resultsService } from "@/services/results.service";
import { quizService } from "@/services/quiz.service";
import { useAttemptStore } from "@/features/quiz-attempt/attempt-store";
import { useQuizStore } from "@/features/quiz-generation/quiz-store";
import { QuizResult, QuestionResultItem } from "@/types/result";
import { formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizIdParam = searchParams.get("quizId");
  const attemptIdParam = searchParams.get("attemptId");

  const { quiz, selectedAnswers, timeRemainingSeconds } = useAttemptStore();
  const { generatedQuiz } = useQuizStore();

  const [result, setResult] = React.useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [filterType, setFilterType] = React.useState<"all" | "correct" | "incorrect" | "unattempted">("all");
  const [expandedQuestions, setExpandedQuestions] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    async function evaluate() {
      setIsLoading(true);
      try {
        // 1. If an attempt was already evaluated and saved with this attemptId, load directly
        if (attemptIdParam) {
          const savedResult = await resultsService.getResultById(attemptIdParam);
          if (savedResult) {
            setResult(savedResult);
            setIsLoading(false);
            return;
          }
        }

        // 2. If user refreshed the results page and selectedAnswers is empty, check recently saved results
        const allSaved = await resultsService.getAllResults();
        if (quizIdParam && Object.keys(selectedAnswers).length === 0 && allSaved.length > 0) {
          const recentMatch = allSaved.find(
            (r) => r.quizId === quizIdParam || (attemptIdParam && r.id === attemptIdParam)
          );
          if (recentMatch) {
            setResult(recentMatch);
            setIsLoading(false);
            return;
          }
        }

        const activeQuiz = quiz || generatedQuiz || (quizIdParam ? await quizService.getQuizById(quizIdParam) : null);

        if (!activeQuiz) {
          if (allSaved.length > 0) {
            setResult(allSaved[0]);
          } else {
            setResult(null);
          }
        } else {
          // Calculate time spent: initial limit - time remaining
          const initialSecs = activeQuiz.timeLimitMinutes > 0 ? activeQuiz.timeLimitMinutes * 60 : 600;
          const timeSpent = Math.max(30, initialSecs - timeRemainingSeconds);

          const evaluated = await resultsService.evaluateQuiz(
            activeQuiz,
            selectedAnswers,
            timeSpent,
            attemptIdParam || undefined
          );
          setResult(evaluated);
        }
      } catch (err) {
        console.error("Evaluation error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    evaluate();
  }, [quizIdParam, attemptIdParam]);

  // Trigger celebration confetti on high score
  React.useEffect(() => {
    if (result && result.scorePercentage >= 75) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#7655E8", "#477CF4", "#F06C9B", "#25B98A"],
        });
      } catch {
        // Safe confetti fallback
      }
    }
  }, [result]);

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-primary-purple-light text-primary-purple flex items-center justify-center mx-auto animate-pulse">
          <Sparkles className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-sm font-semibold text-slate-700">
          Evaluating responses & synthesizing AI explanations...
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-8 sm:p-14 text-center rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5 max-w-xl mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-primary-purple-light text-primary-purple flex items-center justify-center mx-auto shadow-xs">
          <Trophy className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-heading font-extrabold text-slate-900 text-xl sm:text-2xl">
            No Quiz Results Found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Please complete a quiz first to review score breakdowns, topic mastery, and step-by-step explanations.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/create-quiz" className="w-full sm:w-auto">
            <Button variant="default" size="default" className="w-full sm:w-auto font-bold shadow-md shadow-primary-purple/20 min-h-[44px]">
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Create a Quiz
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" size="default" className="w-full sm:w-auto text-slate-700 min-h-[44px]">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const toggleExpand = (qId: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const filteredQuestions = result.questionResults.filter((item) => {
    if (filterType === "correct") return item.isCorrect;
    if (filterType === "incorrect") return !item.isCorrect && item.userAnswer !== null;
    if (filterType === "unattempted") return item.userAnswer === null;
    return true;
  });

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto print:p-0">
      {/* 1. Hero Score Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-purple via-[#6442DD] to-vibe-blue p-6 sm:p-10 text-white shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left: Score Badge */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs">
              Assessment Report
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black font-heading tracking-tight text-white">
                {result.scorePercentage}%
              </span>
              <span className="text-lg text-white/80 font-bold">
                ({result.score}/{result.maxScore} pts)
              </span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="green" size="lg" className="bg-white text-emerald-700 font-bold">
                Grade: {result.grade}
              </Badge>
              <span className="text-xs text-white/90 font-medium">
                {result.grade === "A+" || result.grade === "A"
                  ? "Outstanding Mastery"
                  : result.grade === "B"
                  ? "Good Performance"
                  : "Needs Concept Review"}
              </span>
            </div>
          </div>

          {/* Right: Quick Metrics Row */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs">
              <p className="font-mono text-xl sm:text-2xl font-black text-white">
                {result.correctAnswers}
              </p>
              <p className="text-[11px] font-semibold text-white/80 uppercase">Correct</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs">
              <p className="font-mono text-xl sm:text-2xl font-black text-white">
                {result.incorrectAnswers}
              </p>
              <p className="text-[11px] font-semibold text-white/80 uppercase">Incorrect</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs">
              <p className="font-mono text-xl sm:text-2xl font-black text-white">
                {result.unattemptedQuestions}
              </p>
              <p className="text-[11px] font-semibold text-white/80 uppercase">Unattempted</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs">
              <p className="font-mono text-xl sm:text-2xl font-black text-white">
                {formatDuration(result.timeSpentSeconds)}
              </p>
              <p className="text-[11px] font-semibold text-white/80 uppercase">Time Spent</p>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="mt-8 pt-6 border-t border-white/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <Link href={`/quiz-attempt?id=${result.quizId}`}>
              <Button
                variant="default"
                size="default"
                className="bg-white text-primary-purple hover:bg-slate-50 font-bold shadow-md"
              >
                <RotateCcw className="w-4 h-4 mr-1.5" />
                Retake Quiz
              </Button>
            </Link>

            <Link href="/create-quiz">
              <Button
                variant="outline"
                size="default"
                className="border-white/30 text-white bg-white/10 hover:bg-white/20"
              >
                <PlusCircle className="w-4 h-4 mr-1.5" />
                Generate New Quiz
              </Button>
            </Link>
          </div>

          <button
            type="button"
            onClick={handlePrintReport}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 transition-colors print:hidden"
          >
            <Printer className="w-4 h-4" />
            <span>Download / Print Report</span>
          </button>
        </div>
      </div>

      {/* 2. Topic Breakdown & AI Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Topic Breakdown Card */}
        <Card className="md:col-span-6 border-slate-200/90 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary-purple" />
              <CardTitle className="text-base sm:text-lg">Topic Mastery Breakdown</CardTitle>
            </div>
            <CardDescription>
              Performance segmented by core syllabus concepts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.topicBreakdown.map((t) => (
              <div key={t.topic} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{t.topic}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-700">
                      {t.correctCount}/{t.totalQuestions} ({t.accuracy}%)
                    </span>
                    <Badge
                      variant={t.status === "strong" ? "green" : t.status === "weak" ? "pink" : "orange"}
                      size="sm"
                    >
                      {t.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      t.status === "strong"
                        ? "bg-emerald-500"
                        : t.status === "weak"
                        ? "bg-rose-500"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${t.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Recommendations Card */}
        <Card className="md:col-span-6 border-slate-200/90 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <CardTitle className="text-base sm:text-lg">AI Improvement Insights</CardTitle>
            </div>
            <CardDescription>
              Tailored next steps synthesized from your attempt pattern.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900 leading-relaxed"
              >
                <div className="h-5 w-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  {idx + 1}
                </div>
                <span>{rec}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 3. Detailed Question-by-Question Review */}
      <section id="answer-review" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200">
          <div>
            <h3 className="text-xl font-bold font-heading text-slate-900">
              Detailed Question Review
            </h3>
            <p className="text-xs text-slate-500">
              Inspect answer keys, user selections, and comprehensive pedagogical reasoning.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
              }`}
            >
              All ({result.totalQuestions})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("correct")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "correct" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600"
              }`}
            >
              Correct ({result.correctAnswers})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("incorrect")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "incorrect" ? "bg-white text-red-600 shadow-xs" : "text-slate-600"
              }`}
            >
              Incorrect ({result.incorrectAnswers})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("unattempted")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "unattempted" ? "bg-white text-slate-700 shadow-xs" : "text-slate-600"
              }`}
            >
              Unanswered ({result.unattemptedQuestions})
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((item) => {
            const q = item.question;
            const isExpanded = expandedQuestions[q.id] !== false; // Default expanded for ease of review

            return (
              <Card
                key={q.id}
                className={`border shadow-xs transition-all ${
                  item.isCorrect
                    ? "border-emerald-200 bg-white"
                    : item.userAnswer === null
                    ? "border-slate-200 bg-slate-50/50"
                    : "border-red-200 bg-white"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        Q{q.order}
                      </span>
                      {item.isCorrect ? (
                        <Badge variant="green" size="sm" className="font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Correct (+{item.scoreAwarded} pt)
                        </Badge>
                      ) : item.userAnswer === null ? (
                        <Badge variant="outline" size="sm">
                          Unattempted (0 pt)
                        </Badge>
                      ) : (
                        <Badge variant="pink" size="sm" className="bg-red-50 text-red-700 border-red-200 font-bold">
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Incorrect (0 pt)
                        </Badge>
                      )}
                      <Badge variant="outline" size="sm">
                        {q.type.replace("-", " ").toUpperCase()}
                      </Badge>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleExpand(q.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                      aria-label="Toggle Question Review"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {q.scenarioContext && (
                    <div className="mt-2 p-3 rounded-xl bg-surface-ground text-xs text-slate-700 italic border border-slate-200/80">
                      <span className="font-bold not-italic text-slate-900 block mb-0.5">
                        Context Scenario:
                      </span>
                      {q.scenarioContext}
                    </div>
                  )}

                  <CardTitle className="text-sm sm:text-base font-bold text-slate-900 pt-1 leading-snug">
                    {q.questionText}
                  </CardTitle>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="space-y-4 pt-1 border-t border-slate-100">
                    {/* MCQ Options with marked status */}
                    {q.options && q.options.length > 0 && (
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isCorrectOption = Array.isArray(q.correctAnswer)
                            ? q.correctAnswer.includes(opt.id)
                            : q.correctAnswer === opt.id;

                          const isUserSelected = Array.isArray(item.userAnswer)
                            ? item.userAnswer.includes(opt.id)
                            : item.userAnswer === opt.id;

                          return (
                            <div
                              key={opt.id}
                              className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-3 ${
                                isCorrectOption
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-950 font-medium"
                                  : isUserSelected
                                  ? "border-red-300 bg-red-50 text-red-950"
                                  : "border-slate-200 bg-white text-slate-600 opacity-75"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="font-mono font-bold text-slate-400">
                                  {String.fromCharCode(65 + optIdx)})
                                </span>
                                <span>{opt.text}</span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {isCorrectOption && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                                    Correct Answer ✓
                                  </span>
                                )}
                                {isUserSelected && !isCorrectOption && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-200 text-red-900">
                                    Your Selection ✗
                                  </span>
                                )}
                                {isUserSelected && isCorrectOption && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-300 text-emerald-950">
                                    Your Selection ✓
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Non-MCQ Displays (Blanks, Short Answers) */}
                    {!q.options && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div>
                          <span className="font-bold text-slate-700">Correct Answer: </span>
                          <span className="font-mono text-emerald-700 font-semibold">
                            {String(q.correctAnswer)}
                          </span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-700">Your Answer: </span>
                          <span className="font-mono text-slate-800">
                            {item.userAnswer ? String(item.userAnswer) : "No answer submitted"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* AI Pedagogical Explanation */}
                    <div className="p-3.5 rounded-2xl bg-primary-purple-light/50 border border-primary-purple/20 text-xs text-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-primary-purple font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Concept Reasoning</span>
                      </div>
                      <p className="leading-relaxed text-slate-700">{item.explanation}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-16 text-center text-slate-500 text-sm">
          Loading assessment results...
        </div>
      }
    >
      <ResultsContent />
    </React.Suspense>
  );
}
