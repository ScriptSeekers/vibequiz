import { resultsService } from "@/services/results.service";
import { PerformanceTrendPoint, SubjectPerformancePoint } from "@/mocks/quizzes";

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

class DynamicAnalyticsService implements IAnalyticsService {
  async getSummary(): Promise<AnalyticsSummary> {
    const results = await resultsService.getAllResults();

    if (!results || results.length === 0) {
      return {
        averageScore: 0,
        totalQuizzes: 0,
        questionsAttempted: 0,
        completionRate: 0,
        studyStreakDays: 0,
        scoreTrend: [],
        subjectPerformance: [],
        difficultyBreakdown: [
          { difficulty: "Easy", accuracy: 0, attemptedCount: 0 },
          { difficulty: "Medium", accuracy: 0, attemptedCount: 0 },
          { difficulty: "Hard", accuracy: 0, attemptedCount: 0 },
        ],
        strongTopics: [],
        weakTopics: [],
      };
    }

    const totalQuizzes = results.length;
    const questionsAttempted = results.reduce(
      (sum, r) => sum + (r.totalQuestions || 0),
      0
    );
    const averageScore = Math.round(
      results.reduce((sum, r) => sum + (r.scorePercentage || 0), 0) / totalQuizzes
    );
    const completionRate = 100;

    // Calculate streak from unique attempt dates
    const attemptDates = Array.from(
      new Set(
        results.map((r) => new Date(r.completedAt).toISOString().split("T")[0])
      )
    ).sort().reverse();

    let streak = 0;
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    // If attempted today or yesterday, count streak
    if (attemptDates.length > 0 && (attemptDates[0] === today || attemptDates[0] === yesterday)) {
      let cur = new Date(attemptDates[0]);
      for (const dateStr of attemptDates) {
        const d = new Date(dateStr);
        const diffDays = Math.round((cur.getTime() - d.getTime()) / 86400000);
        if (diffDays <= 1) {
          streak += 1;
          cur = d;
        } else {
          break;
        }
      }
    }

    // Chronological score trend (last 10 attempts)
    const chronological = [...results].reverse();
    const scoreTrend: PerformanceTrendPoint[] = chronological.slice(-10).map((r) => {
      const d = new Date(r.completedAt);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return {
        date: label,
        score: Math.round(r.scorePercentage),
        platformAvg: 75,
      };
    });

    // Subject performance breakdown
    const subjMap: Record<string, { totalScore: number; count: number }> = {};
    for (const r of results) {
      const s = r.subject || "General";
      if (!subjMap[s]) subjMap[s] = { totalScore: 0, count: 0 };
      subjMap[s].totalScore += r.scorePercentage;
      subjMap[s].count += 1;
    }
    const subjectPerformance: SubjectPerformancePoint[] = Object.entries(subjMap).map(
      ([subject, info]) => ({
        subject,
        score: Math.round(info.totalScore / info.count),
        quizzesCount: info.count,
      })
    );

    // Topic mastery & weak spots
    const topicStats: Record<
      string,
      { subject: string; correct: number; total: number; attempts: number }
    > = {};
    for (const r of results) {
      for (const tb of r.topicBreakdown || []) {
        if (!topicStats[tb.topic]) {
          topicStats[tb.topic] = {
            subject: r.subject || "General",
            correct: 0,
            total: 0,
            attempts: 0,
          };
        }
        topicStats[tb.topic].correct += tb.correctCount;
        topicStats[tb.topic].total += tb.totalQuestions;
        topicStats[tb.topic].attempts += 1;
      }
    }

    const allTopics: TopicMasteryItem[] = Object.entries(topicStats).map(([topic, stats]) => {
      const acc = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      return {
        topic,
        subject: stats.subject,
        accuracy: acc,
        attempts: stats.attempts,
        status: acc >= 75 ? "strong" : acc < 60 ? "weak" : "moderate",
      };
    });

    const strongTopics = allTopics.filter((t) => t.status === "strong").slice(0, 5);
    const weakTopics = allTopics.filter((t) => t.status === "weak").slice(0, 5);

    const difficultyBreakdown: DifficultyBreakdownPoint[] = [
      {
        difficulty: "Easy",
        accuracy: averageScore >= 70 ? Math.min(100, averageScore + 10) : averageScore,
        attemptedCount: Math.round(questionsAttempted * 0.4),
      },
      {
        difficulty: "Medium",
        accuracy: averageScore,
        attemptedCount: Math.round(questionsAttempted * 0.4),
      },
      {
        difficulty: "Hard",
        accuracy: Math.max(0, averageScore - 15),
        attemptedCount: Math.round(questionsAttempted * 0.2),
      },
    ];

    return {
      averageScore,
      totalQuizzes,
      questionsAttempted,
      completionRate,
      studyStreakDays: streak,
      scoreTrend,
      subjectPerformance,
      difficultyBreakdown,
      strongTopics,
      weakTopics,
    };
  }
}

export const analyticsService: IAnalyticsService = new DynamicAnalyticsService();
