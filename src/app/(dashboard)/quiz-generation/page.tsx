"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  RefreshCw,
  Edit3,
  Trash2,
  Play,
  Bookmark,
  CheckCircle2,
  Clock,
  Layers,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useQuizStore } from "@/features/quiz-generation/quiz-store";
import { quizService } from "@/services/quiz.service";
import { Quiz } from "@/types/quiz";
import { Question } from "@/types/question";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { QuestionEditModal } from "@/features/quiz-generation/question-edit-modal";

function QuizGenerationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPreviewMode = searchParams.get("preview") === "true";

  const {
    draftConfig,
    generatedQuiz,
    isGenerating,
    generationStep,
    generationMessage,
    setIsGenerating,
    setGenerationProgress,
    setGeneratedQuiz,
  } = useQuizStore();

  const [expandedExplanations, setExpandedExplanations] = React.useState<Record<string, boolean>>({});
  const [editingQuestion, setEditingQuestion] = React.useState<Question | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [regeneratingQuestionId, setRegeneratingQuestionId] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  // Trigger generation on initial mount if draft exists and no quiz yet
  React.useEffect(() => {
    if (draftConfig && !generatedQuiz && !isGenerating) {
      handleGenerate();
    }
  }, [draftConfig, generatedQuiz]);

  const handleGenerate = async () => {
    if (!draftConfig) {
      router.push("/create-quiz");
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);
    setGenerationProgress(10, "Initializing AI models...");

    try {
      const quiz = await quizService.generateQuiz(draftConfig, (step, msg) => {
        setGenerationProgress(step, msg);
      });
      setGeneratedQuiz(quiz);

      if (!isPreviewMode) {
        setGenerationProgress(100, "Quiz ready! Launching examination session...");
        // Smoothly auto-navigate into the quiz attempt page
        setTimeout(() => {
          router.push(`/quiz-attempt?id=${encodeURIComponent(quiz.id)}`);
        }, 800);
      } else {
        setIsGenerating(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to generate quiz. Please retry.");
      setIsGenerating(false);
    }
  };

  const handleRegenerateQuestion = async (qIndex: number, qId: string) => {
    if (!draftConfig || !generatedQuiz) return;
    setRegeneratingQuestionId(qId);
    try {
      const updatedQ = await quizService.regenerateQuestion(
        generatedQuiz.id,
        qIndex + 1,
        draftConfig
      );
      const updatedQuestions = [...generatedQuiz.questions];
      updatedQuestions[qIndex] = { ...updatedQ, order: qIndex + 1 };
      const updatedQuiz = { ...generatedQuiz, questions: updatedQuestions };
      setGeneratedQuiz(updatedQuiz);
    } catch (err: any) {
      alert("Could not regenerate question: " + err.message);
    } finally {
      setRegeneratingQuestionId(null);
    }
  };

  const handleDeleteQuestion = (qIndex: number) => {
    if (!generatedQuiz || generatedQuiz.questions.length <= 1) {
      alert("A quiz must have at least one question.");
      return;
    }
    const filtered = generatedQuiz.questions
      .filter((_, idx) => idx !== qIndex)
      .map((q, idx) => ({ ...q, order: idx + 1 }));

    setGeneratedQuiz({
      ...generatedQuiz,
      questionCount: filtered.length,
      questions: filtered,
    });
  };

  const handleSaveQuestionEdit = (updatedQ: Question) => {
    if (!generatedQuiz) return;
    const updatedQuestions = generatedQuiz.questions.map((q) =>
      q.id === updatedQ.id ? updatedQ : q
    );
    setGeneratedQuiz({ ...generatedQuiz, questions: updatedQuestions });
  };

  const handleSaveQuiz = async () => {
    if (!generatedQuiz) return;
    await quizService.saveQuiz(generatedQuiz);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const toggleExplanation = (id: string) => {
    setExpandedExplanations((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // -------------------------------------------------------------
  // VIEW 1: GENERATING STATE
  // -------------------------------------------------------------
  if (isGenerating) {
    return (
      <div className="max-w-2xl mx-auto py-12 sm:py-20 text-center space-y-8 animate-in fade-in duration-300">
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 rounded-3xl bg-primary-purple/20 animate-ping" />
          <div className="relative h-24 w-24 rounded-3xl bg-gradient-to-tr from-primary-purple to-vibe-blue flex items-center justify-center text-white shadow-xl shadow-primary-purple/30">
            <Sparkles className="w-10 h-10 animate-bounce" />
          </div>
        </div>

        <div className="space-y-3">
          <Badge variant="purple" size="lg">
            Generating Quiz
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
            Synthesizing Your Curriculum
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            {draftConfig?.subject}: <span className="font-semibold text-slate-900">{draftConfig?.topic}</span>
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-3">
          <Progress value={generationStep} variant="gradient" className="h-3" />
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span className="text-primary-purple font-medium">{generationMessage}</span>
            <span>{generationStep}%</span>
          </div>

          {generationStep === 100 && (
            <div className="pt-4 space-y-2 animate-in fade-in zoom-in-95 duration-200">
              <Button
                variant="default"
                size="lg"
                onClick={() => {
                  if (generatedQuiz) {
                    router.push(`/quiz-attempt?id=${encodeURIComponent(generatedQuiz.id)}`);
                  }
                }}
                className="w-full font-bold shadow-lg shadow-primary-purple/25 min-h-[48px]"
              >
                <Play className="w-5 h-5 mr-2" />
                Launch Quiz Now
              </Button>
              <button
                type="button"
                onClick={() => setIsGenerating(false)}
                className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
              >
                Or preview and customize questions first
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: ERROR STATE
  // -------------------------------------------------------------
  if (errorMessage) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold font-heading text-slate-900">
            Generation Interrupted
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">{errorMessage}</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link href="/create-quiz">
            <Button variant="outline">Edit Configuration</Button>
          </Link>
          <Button variant="default" onClick={handleGenerate}>
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Retry Generation
          </Button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: EMPTY STATE FALLBACK
  // -------------------------------------------------------------
  if (!generatedQuiz) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <FileText className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-heading text-slate-900">
            No Quiz Draft Found
          </h2>
          <p className="text-xs text-slate-500">
            Configure your subject parameters to generate a custom quiz.
          </p>
        </div>
        <Link href="/create-quiz">
          <Button variant="default">Configure a New Quiz</Button>
        </Link>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 4: PREVIEW & EDIT STUDIO
  // -------------------------------------------------------------
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Examination Launch Banner */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-primary-purple/10 via-primary-purple/5 to-vibe-blue/10 border border-primary-purple/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-4 h-4 text-primary-purple" />
            <span className="text-xs font-bold text-primary-purple uppercase tracking-wider">
              Examination Ready
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
            {generatedQuiz.title}
          </h2>
          <p className="text-xs text-slate-600">
            {generatedQuiz.questionCount} Questions • {generatedQuiz.timeLimitMinutes > 0 ? `${generatedQuiz.timeLimitMinutes} minutes timed limit` : "Untimed"} • {generatedQuiz.difficulty.toUpperCase()} tier
          </p>
        </div>
        <Link href={`/quiz-attempt?id=${generatedQuiz.id}`} className="w-full sm:w-auto">
          <Button
            size="lg"
            className="w-full sm:w-auto font-bold shadow-lg shadow-primary-purple/25 min-h-[48px]"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Quiz Attempt
          </Button>
        </Link>
      </div>

      {/* Top Navigation & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <Link
            href="/create-quiz"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Configuration</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="purple" size="default">
              Generated & Verified
            </Badge>
            <Badge variant="green" size="default">
              {generatedQuiz.difficulty.toUpperCase()}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
            {generatedQuiz.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {generatedQuiz.questionCount} Questions • {generatedQuiz.educationLevel} tier •{" "}
            {generatedQuiz.timeLimitMinutes > 0
              ? `${generatedQuiz.timeLimitMinutes} minutes timed limit`
              : "Untimed practice"}
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="default"
            onClick={handleGenerate}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Regenerate Full Quiz
          </Button>

          <Button
            variant="outline"
            size="default"
            onClick={handleSaveQuiz}
            className="text-xs"
          >
            <Bookmark className="w-3.5 h-3.5 mr-1.5" />
            {saveSuccess ? "Saved to Library ✓" : "Save Quiz"}
          </Button>

          <Link href={`/quiz-attempt?id=${generatedQuiz.id}`}>
            <Button
              variant="default"
              size="default"
              className="text-xs sm:text-sm font-bold shadow-md shadow-primary-purple/20"
            >
              <Play className="w-4 h-4 mr-1.5" />
              Start Quiz Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Security Notice Pill */}
      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Instructor / Preview Mode:</strong> You can inspect explanations, edit prompts, and customize distractors. Correct answers will be encrypted and hidden once examination mode begins.
          </span>
        </span>
      </div>

      {/* Questions Preview List */}
      <div className="space-y-4">
        {generatedQuiz.questions.map((q, idx) => {
          const isExplanationOpen = expandedExplanations[q.id];
          const isRegenerating = regeneratingQuestionId === q.id;

          return (
            <Card
              key={q.id}
              className={`border-slate-200/90 shadow-xs transition-all ${
                isRegenerating ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      Q{q.order}
                    </span>
                    <Badge variant="outline" size="sm">
                      {q.type.replace("-", " ").toUpperCase()}
                    </Badge>
                    <Badge variant="blue" size="sm">
                      {q.points} {q.points === 1 ? "Point" : "Points"}
                    </Badge>
                  </div>

                  {/* Question Controls */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingQuestion(q);
                        setIsEditModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-primary-purple hover:bg-slate-100 transition-colors"
                      title="Edit question text and options"
                      aria-label="Edit Question"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRegenerateQuestion(idx, q.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-vibe-blue hover:bg-slate-100 transition-colors"
                      title="Regenerate this question with AI"
                      aria-label="Regenerate Question"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(idx)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-slate-100 transition-colors"
                      title="Delete question"
                      aria-label="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Scenario Context if present */}
                {q.scenarioContext && (
                  <div className="mt-2.5 p-3 rounded-xl bg-surface-ground border border-slate-200/80 text-xs text-slate-700 italic">
                    <span className="font-bold not-italic text-slate-900 block mb-0.5">
                      Context Scenario:
                    </span>
                    {q.scenarioContext}
                  </div>
                )}

                {/* Question Statement */}
                <CardTitle className="text-base sm:text-lg font-bold text-slate-900 pt-2 leading-snug">
                  {q.questionText}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Options List for Single MCQ, Multi-Select, True/False, Scenario */}
                {q.options && q.options.length > 0 && (
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = Array.isArray(q.correctAnswer)
                        ? q.correctAnswer.includes(opt.id)
                        : q.correctAnswer === opt.id;

                      return (
                        <div
                          key={opt.id}
                          className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-3 ${
                            isCorrect
                              ? "border-emerald-300 bg-emerald-50/50 text-slate-900 font-medium"
                              : "border-slate-200 bg-white text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="font-mono font-bold text-slate-400">
                              {String.fromCharCode(65 + optIdx)})
                            </span>
                            <span className="break-words">{opt.text}</span>
                          </div>
                          {isCorrect && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                              Answer Key ✓
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* For fill in blanks / short answer */}
                {!q.options && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700">Correct Target: </span>
                    <span className="font-mono text-primary-purple font-semibold">
                      {String(q.correctAnswer)}
                    </span>
                  </div>
                )}

                {/* Collapsible AI Explanation Preview */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => toggleExplanation(q.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary-purple hover:underline focus:outline-none"
                  >
                    <span>
                      {isExplanationOpen ? "Hide AI Reasoning" : "Preview AI Reasoning"}
                    </span>
                    {isExplanationOpen ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {isExplanationOpen && (
                    <div className="mt-2.5 p-3.5 rounded-xl bg-primary-purple-light/40 border border-primary-purple/20 text-xs text-slate-700 leading-relaxed animate-in fade-in-50">
                      <span className="font-bold text-primary-purple block mb-1">
                        Step-by-step Explanation:
                      </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl flex items-center justify-between gap-4">
        <div className="text-xs text-slate-600 hidden sm:block">
          Ready to test your active recall with {generatedQuiz.questionCount} questions?
        </div>
        <Link href={`/quiz-attempt?id=${generatedQuiz.id}`} className="w-full sm:w-auto">
          <Button
            variant="default"
            size="lg"
            className="w-full sm:w-auto font-bold shadow-md shadow-primary-purple/25"
          >
            <Play className="w-5 h-5 mr-2" />
            Begin Quiz Attempt
          </Button>
        </Link>
      </div>

      {/* Question Edit Modal */}
      <QuestionEditModal
        question={editingQuestion}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleSaveQuestionEdit}
      />
    </div>
  );
}

export default function QuizGenerationPage() {
  return (
    <React.Suspense
      fallback={
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-purple/10 text-primary-purple flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            Initializing AI Generation Studio...
          </p>
        </div>
      }
    >
      <QuizGenerationContent />
    </React.Suspense>
  );
}
