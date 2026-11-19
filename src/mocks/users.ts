import { UserProfile, UserStats } from "@/types/user";

export const MOCK_USER: UserProfile = {
  id: "usr_mock_12345",
  fullName: "AI Study Planner",
  email: "aibasedstudyplanner@gmail.com",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  role: "student",
  educationLevel: "undergraduate",
  preferredLanguage: "english",
  bio: "AI Study Planner student preparing for technical exams and active recall quizzes.",
  createdAt: "2026-01-15T10:00:00Z",
};

export const MOCK_USER_STATS: UserStats = {
  totalQuizzesAttempted: 24,
  totalQuestionsAnswered: 320,
  averageScorePercentage: 78.5,
  completionRatePercentage: 92.0,
  studyStreakDays: 6,
};
