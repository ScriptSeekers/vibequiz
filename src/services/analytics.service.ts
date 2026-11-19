import {
  MOCK_DASHBOARD_STATS,
  MOCK_PERFORMANCE_TREND,
  MOCK_SUBJECT_PERFORMANCE,
  PerformanceTrendPoint,
  SubjectPerformancePoint,
} from "@/mocks/quizzes";

export interface DifficultyBreakdownPoint {
  difficulty: "Easy" | "Medium" | "Hard";
  accuracy: number;
  attemptedCount: number;
}

export interface TopicMasteryItem {
  topic: string;
  subject: string;
  accuracy: number;
  attempts: number;
  status: "strong" | "moderate" | "weak";
}

export interface AnalyticsSummary {
  averageScore: number;
  totalQuizzes: number;
  questionsAttempted: number;
  completionRate: number;
  studyStreakDays: number;
  scoreTrend: PerformanceTrendPoint[];
  subjectPerformance: SubjectPerformancePoint[];
  difficultyBreakdown: DifficultyBreakdownPoint[];
  strongTopics: TopicMasteryItem[];
  weakTopics: TopicMasteryItem[];
}

export interface IAnalyticsService {
  getSummary(): Promise<AnalyticsSummary>;
}

class MockAnalyticsService implements IAnalyticsService {
  async getSummary(): Promise<AnalyticsSummary> {
    await new Promise((r) => setTimeout(r, 200));

    const difficultyBreakdown: DifficultyBreakdownPoint[] = [
      { difficulty: "Easy", accuracy: 92, attemptedCount: 65 },
      { difficulty: "Medium", accuracy: 81, attemptedCount: 120 },
      { difficulty: "Hard", accuracy: 68, attemptedCount: 60 },
    ];

    const strongTopics: TopicMasteryItem[] = [
      {
        topic: "Process Scheduling (FCFS, Round Robin)",
        subject: "Computer Science",
        accuracy: 94,
        attempts: 4,
        status: "strong",
      },
      {
        topic: "Propositional Logic & Truth Tables",
        subject: "General Aptitude",
        accuracy: 91,
        attempts: 3,
        status: "strong",
      },
      {
        topic: "Binary Search Trees & Traversals",
        subject: "Computer Science",
        accuracy: 88,
        attempts: 5,
        status: "strong",
      },
    ];

    const weakTopics: TopicMasteryItem[] = [
      {
        topic: "Deadlock Avoidance & Banker's Algorithm",
        subject: "Computer Science",
        accuracy: 54,
        attempts: 3,
        status: "weak",
      },
      {
        topic: "Eigenvalues & Spectral Decomposition",
        subject: "Mathematics",
        accuracy: 58,
        attempts: 2,
        status: "weak",
      },
      {
        topic: "Carnot Engine & Thermodynamic Cycles",
        subject: "Physics",
        accuracy: 59,
        attempts: 2,
        status: "weak",
      },
    ];

    return {
      averageScore: MOCK_DASHBOARD_STATS.averageScore,
      totalQuizzes: MOCK_DASHBOARD_STATS.totalQuizzes,
      questionsAttempted: MOCK_DASHBOARD_STATS.questionsAttempted,
      completionRate: MOCK_DASHBOARD_STATS.completionRate,
      studyStreakDays: 6,
      scoreTrend: MOCK_PERFORMANCE_TREND,
      subjectPerformance: MOCK_SUBJECT_PERFORMANCE,
      difficultyBreakdown,
      strongTopics,
      weakTopics,
    };
  }
}

export const analyticsService: IAnalyticsService = new MockAnalyticsService();
