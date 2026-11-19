export type UserRole = "student" | "aspirant" | "teacher" | "professional";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
  bio?: string;
  educationLevel?: string;
  preferredLanguage?: string;
}

export interface UserStats {
  totalQuizzesAttempted: number;
  totalQuestionsAnswered: number;
  averageScorePercentage: number;
  completionRatePercentage: number;
  studyStreakDays: number;
}
