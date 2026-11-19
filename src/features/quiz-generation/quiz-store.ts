"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { QuizCreationInput } from "@/lib/validations/quiz";
import { Quiz } from "@/types/quiz";

interface QuizGenerationStore {
  draftConfig: QuizCreationInput | null;
  generatedQuiz: Quiz | null;
  isGenerating: boolean;
  generationStep: number;
  generationMessage: string;

  setDraftConfig: (config: QuizCreationInput) => void;
  setGeneratedQuiz: (quiz: Quiz) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setGenerationProgress: (step: number, message: string) => void;
  resetDraft: () => void;
}

export const useQuizStore = create<QuizGenerationStore>()(
  persist(
    (set) => ({
      draftConfig: null,
      generatedQuiz: null,
      isGenerating: false,
      generationStep: 0,
      generationMessage: "Initializing AI models...",

      setDraftConfig: (config) => set({ draftConfig: config, generatedQuiz: null }),
      setGeneratedQuiz: (quiz) => set({ generatedQuiz: quiz }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      setGenerationProgress: (step, message) =>
        set({ generationStep: step, generationMessage: message }),
      resetDraft: () =>
        set({
          draftConfig: null,
          generatedQuiz: null,
          isGenerating: false,
          generationStep: 0,
        }),
    }),
    {
      name: "vibe_quiz_active_store",
    }
  )
);
