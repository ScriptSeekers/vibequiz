import { z } from "zod";

export const questionTypeSchema = z.enum([
  "single-choice",
  "multiple-select",
  "true-false",
  "fill-in-the-blank",
  "short-answer",
  "scenario-based",
]);

export const educationLevelSchema = z.enum([
  "school",
  "higher-secondary",
  "undergraduate",
  "postgraduate",
  "professional",
]);

export const quizDifficultySchema = z.enum(["easy", "medium", "hard", "mixed"]);

export const quizLanguageSchema = z.enum(["english", "hindi", "hinglish"]);

export const timeLimitSchema = z.union([
  z.literal(0),
  z.literal(15),
  z.literal(30),
  z.literal(45),
  z.literal(60),
]);

export const uploadedDocumentSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  fileSize: z.number(),
  uploadedAt: z.string(),
  status: z.enum(["idle", "uploading", "processing", "ready", "error"]),
  pageCount: z.number().optional(),
});

export const quizCreationSchema = z.object({
  subject: z
    .string()
    .min(2, "Subject must be at least 2 characters")
    .max(100, "Subject cannot exceed 100 characters"),
  topic: z
    .string()
    .min(2, "Topic must be at least 2 characters")
    .max(150, "Topic cannot exceed 150 characters"),
  educationLevel: educationLevelSchema,
  difficulty: quizDifficultySchema,
  questionCount: z
    .number()
    .min(5, "Minimum 5 questions")
    .max(50, "Maximum 50 questions"),
  questionTypes: z
    .array(questionTypeSchema)
    .min(1, "Select at least one question type"),
  language: quizLanguageSchema,
  timeLimitMinutes: timeLimitSchema,
  customInstructions: z
    .string()
    .max(500, "Custom instructions cannot exceed 500 characters")
    .optional(),
  uploadedDocument: uploadedDocumentSchema.optional(),
});

export type QuizCreationInput = z.infer<typeof quizCreationSchema>;
