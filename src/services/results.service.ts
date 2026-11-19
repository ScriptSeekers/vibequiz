import { Quiz } from "@/types/quiz";
import { QuizResult, QuestionResultItem, TopicPerformance, PerformanceGrade } from "@/types/result";
import { quizService } from "./quiz.service";

export interface IResultsService {
  evaluateQuiz(
    quiz: Quiz,
    userAnswers: Record<string, string | string[]>,
    timeSpentSeconds: number,
    attemptId?: string
  ): Promise<QuizResult>;
  getResultById(resultId: string): Promise<QuizResult | null>;
  saveResult(result: QuizResult): Promise<void>;
  getAllResults(): Promise<QuizResult[]>;
}

const STORAGE_RESULTS_KEY = "vibe_quiz_saved_results";

class MockResultsService implements IResultsService {
  private getStoredResults(): Record<string, QuizResult> {
    if (typeof window === "undefined") return {};
    try {
      const data = localStorage.getItem(STORAGE_RESULTS_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private saveStoredResults(results: Record<string, QuizResult>) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_RESULTS_KEY, JSON.stringify(results));
    } catch (e) {
      console.warn("Could not save results to localStorage", e);
    }
  }

  async evaluateQuiz(
    quiz: Quiz,
    userAnswers: Record<string, string | string[]>,
    timeSpentSeconds: number,
    attemptId?: string
  ): Promise<QuizResult> {
    // Deterministic evaluation against authoritative server questions
    const questionResults: QuestionResultItem[] = [];
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let totalScore = 0;
    let maxScore = 0;

    const topicStats: Record<string, { total: number; correct: number }> = {};

    for (const q of quiz.questions) {
      maxScore += q.points;
      const userAns = userAnswers[q.id];

      if (!topicStats[q.topicTag]) {
        topicStats[q.topicTag] = { total: 0, correct: 0 };
      }
      topicStats[q.topicTag].total += 1;

      // Unattempted check
      const isUnattempted =
        userAns === undefined ||
        userAns === null ||
        (Array.isArray(userAns) ? userAns.length === 0 : String(userAns).trim().length === 0);

      if (isUnattempted) {
        unattemptedCount += 1;
        questionResults.push({
          question: q,
          userAnswer: null,
          isCorrect: false,
          scoreAwarded: 0,
          maxScore: q.points,
          explanation: q.explanation || "No explanation recorded.",
        });
        continue;
      }

      // Check correctness by question type
      let isCorrect = false;

      if (q.type === "multiple-select") {
        const correctKeys: string[] = Array.isArray(q.correctAnswer)
          ? q.correctAnswer.filter((k): k is string => Boolean(k))
          : q.correctAnswer
          ? [q.correctAnswer]
          : [];
        const userKeys: string[] = Array.isArray(userAns)
          ? userAns.filter((k): k is string => Boolean(k))
          : userAns
          ? [userAns]
          : [];

        const hasAllCorrect = correctKeys.length > 0 && correctKeys.every((k) => userKeys.includes(k));
        const hasNoExtras = userKeys.every((k) => correctKeys.includes(k));
        isCorrect = hasAllCorrect && hasNoExtras;
      } else if (q.type === "fill-in-the-blank") {
        const targetStr = String(q.correctAnswer).toLowerCase().trim();
        const userStr = String(userAns).toLowerCase().trim();
        isCorrect = targetStr === userStr;
      } else if (q.type === "short-answer") {
        // Conceptual answers evaluated with heuristic keyword matching
        const targetWords = String(q.correctAnswer).toLowerCase().split(/\s+/);
        const userStr = String(userAns).toLowerCase();
        const matches = targetWords.filter((w) => w.length > 3 && userStr.includes(w));
        isCorrect = matches.length >= 2 || userStr.length > 20;
      } else {
        // Single choice, True/False, Scenario
        isCorrect = String(q.correctAnswer) === String(userAns);
      }

      if (isCorrect) {
        correctCount += 1;
        totalScore += q.points;
        topicStats[q.topicTag].correct += 1;
      } else {
        incorrectCount += 1;
      }

      questionResults.push({
        question: q,
        userAnswer: userAns,
        isCorrect,
        scoreAwarded: isCorrect ? q.points : 0,
        maxScore: q.points,
        explanation: q.explanation || "No explanation provided.",
      });
    }

    const scorePercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const attemptedCount = correctCount + incorrectCount;
    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

    // Determine performance grade
    let grade: PerformanceGrade = "F";
    if (scorePercentage >= 90) grade = "A+";
    else if (scorePercentage >= 80) grade = "A";
    else if (scorePercentage >= 70) grade = "B";
    else if (scorePercentage >= 60) grade = "C";
    else if (scorePercentage >= 50) grade = "D";

    // Build topic breakdowns
    const topicBreakdown: TopicPerformance[] = Object.entries(topicStats).map(([topic, stats]) => {
      const acc = Math.round((stats.correct / stats.total) * 100);
      return {
        topic,
        totalQuestions: stats.total,
        correctCount: stats.correct,
        accuracy: acc,
        status: acc >= 75 ? "strong" : acc < 60 ? "weak" : "moderate",
      };
    });

    const strongTopics = topicBreakdown.filter((t) => t.status === "strong").map((t) => t.topic);
    const weakTopics = topicBreakdown.filter((t) => t.status === "weak").map((t) => t.topic);

    // Contextual recommendations
    const recommendations: string[] = [];
    if (weakTopics.length > 0) {
      recommendations.push(
        `Focus revision on '${weakTopics.join(", ")}' where accuracy fell below 60%.`
      );
    }
    if (unattemptedCount > 0) {
      recommendations.push(
        `Practice pacing strategies to avoid leaving ${unattemptedCount} questions unattempted before time expires.`
      );
    }
    if (scorePercentage >= 85) {
      recommendations.push(
        "Outstanding command of foundational concepts. Ready to advance to Hard or Mixed problem tiers."
      );
    } else {
      recommendations.push(
        "Review the step-by-step explanations below to address conceptual misconceptions before attempting your next quiz."
      );
    }

    const result: QuizResult = {
      id: attemptId || `res_${Date.now()}`,
      quizId: quiz.id,
      quizTitle: quiz.title,
      subject: quiz.subject,
      topic: quiz.topic,
      completedAt: new Date().toISOString(),
      timeSpentSeconds,
      totalQuestions: quiz.questions.length,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      unattemptedQuestions: unattemptedCount,
      score: totalScore,
      maxScore,
      scorePercentage,
      accuracy,
      grade,
      topicBreakdown,
      weakTopics,
      strongTopics,
      recommendations,
      questionResults,
    };

    await this.saveResult(result);
    return result;
  }

  async saveResult(result: QuizResult): Promise<void> {
    const all = this.getStoredResults();
    all[result.id] = result;
    this.saveStoredResults(all);
  }

  async getResultById(resultId: string): Promise<QuizResult | null> {
    const all = this.getStoredResults();
    return all[resultId] || null;
  }

  async getAllResults(): Promise<QuizResult[]> {
    const all = this.getStoredResults();
    return Object.values(all).sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
  }
}

export const resultsService: IResultsService = new MockResultsService();
