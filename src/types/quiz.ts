import { Question, QuestionType } from "./question";

export type { Question, QuestionType };

export type EducationLevel =
  | "school"
  | "higher-secondary"
  | "undergraduate"
  | "postgraduate"
  | "professional";

export type QuizDifficulty = "easy" | "medium" | "hard" | "mixed";

export type QuizLanguage = "english" | "hindi" | "hinglish";

export type TimeLimitMinutes = 0 | 15 | 30 | 45 | 60;

export interface UploadedDocumentMeta {
  id: string;
  fileName: string;
  fileSize: number; // in bytes
  uploadedAt: string;
  status: "idle" | "uploading" | "processing" | "ready" | "error";
  pageCount?: number;
}

export interface QuizCreationFormValues {
  subject: string;
  topic: string;
  educationLevel: EducationLevel;
  difficulty: QuizDifficulty;
  questionCount: number;
  questionTypes: QuestionType[];
  language: QuizLanguage;
  timeLimitMinutes: TimeLimitMinutes;
  customInstructions?: string;
  uploadedDocument?: UploadedDocumentMeta;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  topic: string;
  educationLevel: EducationLevel;
  difficulty: QuizDifficulty;
  language: QuizLanguage;
  timeLimitMinutes: TimeLimitMinutes;
  questionCount: number;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  tags: string[];
  customInstructions?: string;
  sourceDocumentName?: string;
  isDraft?: boolean;
}

export interface QuizAttemptState {
  quizId: string;
  attemptId: string;
  currentQuestionIndex: number;
  selectedAnswers: Record<string, string | string[]>; // questionId -> optionId or text
  markedForReview: Record<string, boolean>; // questionId -> boolean
  timeRemainingSeconds: number;
  startedAt: string;
  isCompleted: boolean;
}
