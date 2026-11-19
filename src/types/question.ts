export type QuestionType =
  | "single-choice"
  | "multiple-select"
  | "true-false"
  | "fill-in-the-blank"
  | "short-answer"
  | "scenario-based";

export type QuestionDifficulty = "easy" | "medium" | "hard";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  quizId?: string;
  order: number;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  questionText: string;
  scenarioContext?: string; // Optional context for scenario-based questions
  options?: QuestionOption[]; // For single-choice, multiple-select, scenario
  topicTag: string;
  points: number;
  // NOTE: In client-side quiz taking mode, correct answers and explanations 
  // must remain protected until result submission as per security specs.
  correctAnswer?: string | string[]; 
  explanation?: string;
}

export interface QuestionClientView extends Omit<Question, "correctAnswer" | "explanation"> {
  hasAnswerKey: boolean;
}
