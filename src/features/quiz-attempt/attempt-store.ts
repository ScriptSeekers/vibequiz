"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Quiz } from "@/types/quiz";
import { QuestionClientView } from "@/types/question";
import { quizService } from "@/services/quiz.service";

interface AttemptState {
  quiz: Quiz | null;
  clientQuestions: QuestionClientView[];
  currentIndex: number;
  selectedAnswers: Record<string, string | string[]>;
  markedForReview: Record<string, boolean>;
  timeRemainingSeconds: number;
  isTimerRunning: boolean;
  isSubmitting: boolean;
  isCompleted: boolean;
  startedAt: string | null;

  initAttempt: (quiz: Quiz, forceReset?: boolean) => void;
  selectAnswer: (questionId: string, answer: string | string[]) => void;
  toggleMarkForReview: (questionId: string) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  decrementTimer: () => boolean; // returns true if expired
  submitAttempt: () => Promise<string>; // returns attemptId
  resetAttempt: () => void;
}

export const useAttemptStore = create<AttemptState>()(
  persist(
    (set, get) => ({
      quiz: null,
      clientQuestions: [],
      currentIndex: 0,
      selectedAnswers: {},
      markedForReview: {},
      timeRemainingSeconds: 0,
      isTimerRunning: false,
      isSubmitting: false,
      isCompleted: false,
      startedAt: null,

      initAttempt: (quiz: Quiz, forceReset = false) => {
        const { quiz: existingQuiz, isCompleted, clientQuestions: existingQuestions } = get();
        // If already initialized for this same quiz and attempt is active, keep existing state
        if (!forceReset && existingQuiz && existingQuiz.id === quiz.id && !isCompleted && existingQuestions.length > 0) {
          return;
        }

        // Strip correct answers to protect answer keys
        const clientQuestions = quizService.getClientView(quiz.questions);
        const initialSeconds = quiz.timeLimitMinutes > 0 ? quiz.timeLimitMinutes * 60 : 0;

        set({
          quiz,
          clientQuestions,
          currentIndex: 0,
          selectedAnswers: {},
          markedForReview: {},
          timeRemainingSeconds: initialSeconds,
          isTimerRunning: quiz.timeLimitMinutes > 0,
          isSubmitting: false,
          isCompleted: false,
          startedAt: new Date().toISOString(),
        });
      },

  selectAnswer: (questionId: string, answer: string | string[]) => {
    set((state) => ({
      selectedAnswers: {
        ...state.selectedAnswers,
        [questionId]: answer,
      },
    }));
  },

  toggleMarkForReview: (questionId: string) => {
    set((state) => ({
      markedForReview: {
        ...state.markedForReview,
        [questionId]: !state.markedForReview[questionId],
      },
    }));
  },

  goToQuestion: (index: number) => {
    const { clientQuestions } = get();
    if (index >= 0 && index < clientQuestions.length) {
      set({ currentIndex: index });
    }
  },

  nextQuestion: () => {
    const { currentIndex, clientQuestions } = get();
    if (currentIndex < clientQuestions.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  previousQuestion: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  decrementTimer: () => {
    const { timeRemainingSeconds, isTimerRunning } = get();
    if (!isTimerRunning || timeRemainingSeconds <= 0) return false;

    const next = timeRemainingSeconds - 1;
    if (next <= 0) {
      set({ timeRemainingSeconds: 0, isTimerRunning: false });
      return true; // Expired
    }

    set({ timeRemainingSeconds: next });
    return false;
  },

  submitAttempt: async () => {
    const { quiz, isSubmitting } = get();
    if (isSubmitting || !quiz) return "";

    set({ isSubmitting: true, isTimerRunning: false });

    // Simulate network submission delay
    await new Promise((r) => setTimeout(r, 600));

    const attemptId = `att_${Date.now()}`;
    set({ isSubmitting: false, isCompleted: true });
    return attemptId;
  },

  resetAttempt: () => {
    set({
      quiz: null,
      clientQuestions: [],
      currentIndex: 0,
      selectedAnswers: {},
      markedForReview: {},
      timeRemainingSeconds: 0,
      isTimerRunning: false,
      isSubmitting: false,
      isCompleted: false,
      startedAt: null,
    });
  },
    }),
    {
      name: "vibe_quiz_attempt_store",
    }
  )
);
