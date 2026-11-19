"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAttemptStore } from "@/features/quiz-attempt/attempt-store";
import { useQuizStore } from "@/features/quiz-generation/quiz-store";
import { quizService } from "@/services/quiz.service";
import { Quiz } from "@/types/quiz";
import { QuizAttemptHeader } from "@/features/quiz-attempt/quiz-attempt-header";
import { QuestionCard } from "@/features/quiz-attempt/question-card";
import { QuizAttemptControls } from "@/features/quiz-attempt/quiz-attempt-controls";
import {
  QuestionNavigatorContent,
  QuestionNavigatorDrawer,
} from "@/features/quiz-attempt/question-navigator";
import { SubmissionModal } from "@/features/quiz-attempt/submission-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";

function QuizAttemptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizIdParam = searchParams.get("id");

  const { generatedQuiz } = useQuizStore();
  const {
    quiz,
    clientQuestions,
    currentIndex,
    selectedAnswers,
    markedForReview,
    timeRemainingSeconds,
    isTimerRunning,
    isSubmitting,
    initAttempt,
    selectAnswer,
    toggleMarkForReview,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    decrementTimer,
    submitAttempt,
  } = useAttemptStore();

  const [isLoadingQuiz, setIsLoadingQuiz] = React.useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = React.useState(false);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  // Load Quiz on mount
  React.useEffect(() => {
    async function load() {
      setIsLoadingQuiz(true);
      setLoadError(null);

      try {
        let targetQuiz: Quiz | null = null;

        // 1. Check generatedQuiz in memory store
        if (generatedQuiz && (!quizIdParam || generatedQuiz.id === quizIdParam)) {
          targetQuiz = generatedQuiz;
        } else if (quizIdParam) {
          // 2. Fetch from service storage
          targetQuiz = await quizService.getQuizById(quizIdParam);
        }

        // 3. Fallback demo quiz if opened directly without generation
        if (!targetQuiz) {
          targetQuiz = await quizService.generateQuiz({
            subject: "Computer Science",
            topic: "Operating Systems — Process Scheduling",
            educationLevel: "undergraduate",
            difficulty: "medium",
            questionCount: 10,
            questionTypes: ["single-choice", "scenario-based", "true-false"],
            language: "english",
            timeLimitMinutes: 15,
          });
        }

        initAttempt(targetQuiz);
      } catch (err: any) {
        setLoadError(err.message || "Failed to load quiz.");
      } finally {
        setIsLoadingQuiz(false);
      }
    }

    load();
  }, [quizIdParam]);

  // Countdown timer loop
  React.useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      const isExpired = decrementTimer();
      if (isExpired) {
        alert("Time limit expired! Your examination has been automatically submitted.");
        handleFinalSubmit();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleFinalSubmit = async () => {
    setIsSubmitModalOpen(false);
    const attemptId = await submitAttempt();
    if (quiz) {
      router.push(`/results?quizId=${encodeURIComponent(quiz.id)}&attemptId=${encodeURIComponent(attemptId)}`);
    }
  };

  if (isLoadingQuiz) {
    return (
      <div className="py-24 text-center space-y-4">
        <Loader2 className="w-10 h-10 text-primary-purple animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-700">
          Preparing secure examination session...
        </p>
      </div>
    );
  }

  if (loadError || !quiz || clientQuestions.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Quiz Unavailable</h2>
        <p className="text-xs text-slate-600">{loadError || "Could not initialize questions."}</p>
        <Link href="/dashboard">
          <Button variant="default">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const currentQ = clientQuestions[currentIndex];
  const currentAnswer = selectedAnswers[currentQ?.id];
  const isMarked = markedForReview[currentQ?.id];

  const answeredCount = clientQuestions.filter((q) => {
    const ans = selectedAnswers[q.id];
    return ans !== undefined && (Array.isArray(ans) ? ans.length > 0 : String(ans).trim().length > 0);
  }).length;

  const markedCount = clientQuestions.filter((q) => markedForReview[q.id]).length;

  return (
    <div className="space-y-6">
      {/* Top Examination Header */}
      <QuizAttemptHeader
        title={quiz.title}
        subject={quiz.subject}
        currentIndex={currentIndex}
        totalQuestions={clientQuestions.length}
        timeRemainingSeconds={timeRemainingSeconds}
        isTimed={quiz.timeLimitMinutes > 0}
        answeredCount={answeredCount}
        onOpenNavigator={() => setIsDrawerOpen(true)}
        onSubmitClick={() => setIsSubmitModalOpen(true)}
      />

      {/* Main 2-Column Grid (Question on left, Navigator on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Current Question Card & Controls */}
        <div className="lg:col-span-8 space-y-5">
          <QuestionCard
            question={currentQ}
            currentIndex={currentIndex}
            totalQuestions={clientQuestions.length}
            currentAnswer={currentAnswer}
            isMarkedForReview={isMarked}
            onSelectAnswer={(ans) => selectAnswer(currentQ.id, ans)}
            onToggleMarkForReview={() => toggleMarkForReview(currentQ.id)}
          />

          <QuizAttemptControls
            currentIndex={currentIndex}
            totalQuestions={clientQuestions.length}
            hasAnswer={currentAnswer !== undefined}
            onPrevious={previousQuestion}
            onNext={nextQuestion}
            onSubmit={() => setIsSubmitModalOpen(true)}
            onClearAnswer={() => selectAnswer(currentQ.id, "")}
          />
        </div>

        {/* Right Column: Desktop Question Navigator Panel */}
        <div className="hidden lg:block lg:col-span-4 sticky top-24">
          <Card className="border-slate-200/90 shadow-sm p-5">
            <QuestionNavigatorContent
              questions={clientQuestions}
              currentIndex={currentIndex}
              selectedAnswers={selectedAnswers}
              markedForReview={markedForReview}
              onSelectQuestion={goToQuestion}
              onSubmitClick={() => setIsSubmitModalOpen(true)}
            />
          </Card>
        </div>
      </div>

      {/* Mobile Navigator Drawer */}
      <QuestionNavigatorDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        questions={clientQuestions}
        currentIndex={currentIndex}
        selectedAnswers={selectedAnswers}
        markedForReview={markedForReview}
        onSelectQuestion={goToQuestion}
        onSubmitClick={() => {
          setIsDrawerOpen(false);
          setIsSubmitModalOpen(true);
        }}
      />

      {/* Submission Confirmation Modal */}
      <SubmissionModal
        open={isSubmitModalOpen}
        onOpenChange={setIsSubmitModalOpen}
        totalQuestions={clientQuestions.length}
        answeredCount={answeredCount}
        markedCount={markedCount}
        isSubmitting={isSubmitting}
        onConfirmSubmit={handleFinalSubmit}
      />
    </div>
  );
}

export default function QuizAttemptPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-16 text-center text-slate-500 text-sm">
          Loading exam room...
        </div>
      }
    >
      <QuizAttemptContent />
    </React.Suspense>
  );
}
