import { Question } from "./question";

export type PerformanceGrade = "A+" | "A" | "B" | "C" | "D" | "F";

export interface QuestionResultItem {
  question: Question;
  userAnswer: string | string[] | null;
  isCorrect: boolean;
  scoreAwarded: number;
  maxScore: number;
  explanation: string;
}

export interface TopicPerformance {
  topic: string;
  totalQuestions: number;
  correctCount: number;
  accuracy: number; // 0 - 100
  status: "strong" | "moderate" | "weak";
}

export interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  topic: string;
  completedAt: string;
  timeSpentSeconds: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattemptedQuestions: number;
  score: number;
  maxScore: number;
  scorePercentage: number;
  accuracy: number;
  grade: PerformanceGrade;
  topicBreakdown: TopicPerformance[];
  weakTopics: string[];
  strongTopics: string[];
  recommendations: string[];
  questionResults: QuestionResultItem[];
}
