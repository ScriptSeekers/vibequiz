"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Percent,
  Plus,
  FileUp,
  ArrowRight,
  Flame,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/auth-store";
import { resultsService } from "@/services/results.service";
import { quizService } from "@/services/quiz.service";
import {
  MOCK_SUGGESTED_TOPICS,
  RecentQuizItem,
  PerformanceTrendPoint,
  SubjectPerformancePoint,
} from "@/mocks/quizzes";
import { StatCard } from "@/components/dashboard/stat-card";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { SubjectChart } from "@/components/dashboard/subject-chart";
import { RecentQuizzes } from "@/components/dashboard/recent-quizzes";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { SuggestedTopics } from "@/components/dashboard/suggested-topics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const POPULAR_STARTER_TOPICS = [
  { subject: "Computer Science", topic: "Python & Data Structures", icon: "💻" },
  { subject: "Biology", topic: "Genetics & Cell Biology", icon: "🧬" },
  { subject: "Mathematics", topic: "Calculus & Linear Algebra", icon: "📐" },
  { subject: "World History", topic: "Modern Civilization & Cold War", icon: "🌍" },
  { subject: "Economics", topic: "Microeconomics & Supply Chains", icon: "📊" },
  { subject: "Physics", topic: "Mechanics & Wave Dynamics", icon: "⚡" },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    totalQuizzes: 0,
    questionsAttempted: 0,
    averageScore: 0,
    studyStreakDays: 0,
  });
  const [recentQuizzes, setRecentQuizzes] = React.useState<RecentQuizItem[]>([]);
  const [scoreTrend, setScoreTrend] = React.useState<PerformanceTrendPoint[]>([]);
  const [subjectPerformance, setSubjectPerformance] = React.useState<SubjectPerformancePoint[]>([]);

  const userName =
    user?.fullName ||
    (user?.email ? user.email.split("@")[0] : null) ||
    "Learner";

  React.useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      try {
        const results = await resultsService.getAllResults();
        const storedQuizzes = await quizService.getAllQuizzes();

        const totalQuizzes = results.length;
        const questionsAttempted = results.reduce(
          (sum, r) => sum + (r.totalQuestions || 0),
          0
        );
        const averageScore =
          totalQuizzes > 0
            ? Math.round(
                results.reduce((sum, r) => sum + (r.scorePercentage || 0), 0) /
                  totalQuizzes
              )
            : 0;

        // Calculate study streak
        const attemptDates = Array.from(
          new Set(
            results.map((r) => new Date(r.completedAt).toISOString().split("T")[0])
          )
        ).sort().reverse();

        let streak = 0;
        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

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

        setStats({
          totalQuizzes,
          questionsAttempted,
          averageScore,
          studyStreakDays: streak,
        });

        // Build recent quiz items from user's quizzes and results
        const scoreMap: Record<string, number> = {};
        for (const res of results) {
          if (scoreMap[res.quizId] === undefined) {
            scoreMap[res.quizId] = Math.round(res.scorePercentage);
          }
        }

        const recentList: RecentQuizItem[] = storedQuizzes.slice(0, 5).map((q) => ({
          id: q.id,
          title: q.title,
          subject: q.subject,
          topic: q.topic,
          questionCount: q.questionCount || q.questions?.length || 0,
          difficulty: (q.difficulty as any) || "medium",
          status: scoreMap[q.id] !== undefined ? "completed" : "not-attempted",
          lastScore: scoreMap[q.id],
          createdAt: q.createdAt || new Date().toISOString(),
          completedAt: q.createdAt
            ? new Date(q.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : undefined,
        }));
        setRecentQuizzes(recentList);

        // Score trend for charts (chronological order)
        if (results.length > 0) {
          const chronological = [...results].reverse();
          const trend: PerformanceTrendPoint[] = chronological.slice(-7).map((r) => {
            const d = new Date(r.completedAt);
            return {
              date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              score: Math.round(r.scorePercentage),
              platformAvg: 75,
            };
          });
          setScoreTrend(trend);

          // Subject-wise performance
          const subjMap: Record<string, { totalScore: number; count: number }> = {};
          for (const r of results) {
            const s = r.subject || "General";
            if (!subjMap[s]) subjMap[s] = { totalScore: 0, count: 0 };
            subjMap[s].totalScore += r.scorePercentage;
            subjMap[s].count += 1;
          }
          const subjs: SubjectPerformancePoint[] = Object.entries(subjMap).map(
            ([subject, info]) => ({
              subject,
              score: Math.round(info.totalScore / info.count),
              quizzesCount: info.count,
            })
          );
          setSubjectPerformance(subjs);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const hasAttempts = stats.totalQuizzes > 0;
  const hasQuizzes = recentQuizzes.length > 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
              {hasAttempts ? `Welcome back, ${userName}!` : `Welcome to VibeQuiz, ${userName}!`}
            </h1>
            <span className="hidden sm:inline-block">👋</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            {hasAttempts
              ? "Track your progress, review past mistakes, and test yourself with new AI quizzes."
              : "Generate interactive AI assessments from any topic or your own study materials."}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/create-quiz" className="w-full sm:w-auto">
            <Button
              variant="default"
              size="default"
              className="w-full sm:w-auto shadow-md shadow-primary-purple/20 font-bold min-h-[44px]"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Create Quiz
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Core Statistics (Responsive Grid: 2 cols on mobile, 4 cols on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Quizzes"
          value={stats.totalQuizzes}
          change={hasAttempts ? `${stats.totalQuizzes} completed` : "Take your first quiz"}
          isPositive={hasAttempts}
          icon={BookOpen}
          iconColor="purple"
        />
        <StatCard
          title="Questions Solved"
          value={stats.questionsAttempted}
          change={hasAttempts ? "Total submitted" : "Ready when you are"}
          isPositive={hasAttempts}
          icon={CheckCircle2}
          iconColor="blue"
        />
        <StatCard
          title="Average Score"
          value={`${stats.averageScore}%`}
          change={hasAttempts ? "Overall accuracy" : "No attempts yet"}
          isPositive={stats.averageScore >= 70}
          icon={TrendingUp}
          iconColor="green"
        />
        <StatCard
          title="Study Streak"
          value={`${stats.studyStreakDays} ${stats.studyStreakDays === 1 ? "Day" : "Days"}`}
          change={stats.studyStreakDays > 0 ? "Active streak" : "Start today"}
          isPositive={stats.studyStreakDays > 0}
          icon={Percent}
          iconColor="orange"
        />
      </div>

      {/* Quick Actions Bar */}
      <QuickActions />

      {/* Conditional Dashboard Body: Fresh Start vs Active Analytics */}
      {!hasAttempts && !hasQuizzes ? (
        /* Fresh User Starter Hub: Clean, uncluttered, action-oriented */
        <div className="space-y-6">
          <Card className="border-primary-purple/20 bg-gradient-to-br from-primary-purple-light/30 via-white to-vibe-blue-light/20 shadow-xs p-5 sm:p-7">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-purple-light text-primary-purple text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick-Start Assessment Launcher</span>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-lg sm:text-xl font-extrabold font-heading text-slate-900">
                  Ready to test your knowledge?
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Select a starter subject below to instantly generate a tailored assessment, or upload your own notes and syllabus to build custom questions.
                </p>
              </div>

              {/* Starter Topic Chips (Touch-friendly, high contrast) */}
              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Popular Topics to Try
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {POPULAR_STARTER_TOPICS.map((item) => (
                    <Link
                      key={item.topic}
                      href={`/create-quiz?subject=${encodeURIComponent(item.subject)}&topic=${encodeURIComponent(item.topic)}`}
                      className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 hover:border-primary-purple/50 hover:bg-primary-purple-light/40 shadow-2xs text-xs font-medium text-slate-700 hover:text-primary-purple transition-all flex items-center gap-2 min-h-[42px]"
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span>{item.topic}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Main Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                <Link href="/create-quiz" className="w-full sm:w-auto">
                  <Button variant="default" size="default" className="w-full sm:w-auto font-bold shadow-md shadow-primary-purple/20 min-h-[44px]">
                    <Plus className="w-4 h-4 mr-1.5" />
                    Create Custom Quiz
                  </Button>
                </Link>
                <Link href="/create-quiz?mode=pdf" className="w-full sm:w-auto">
                  <Button variant="outline" size="default" className="w-full sm:w-auto text-slate-700 min-h-[44px]">
                    <FileUp className="w-4 h-4 mr-1.5" />
                    Upload PDF / Syllabus
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Curated Suggested Focus Topics */}
          <SuggestedTopics topics={MOCK_SUGGESTED_TOPICS} />
        </div>
      ) : (
        /* Active User: Render real charts, recent quizzes, and suggestions */
        <div className="space-y-6 sm:space-y-8">
          {/* Charts Grid: Performance Over Time & Subject Accuracy */}
          {hasAttempts && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceChart data={scoreTrend} />
              <SubjectChart data={subjectPerformance} />
            </div>
          )}

          {/* Bottom Grid: Recent Quizzes & Suggested Focus Topics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <RecentQuizzes quizzes={recentQuizzes} />
            </div>
            <div className="lg:col-span-5">
              <SuggestedTopics topics={MOCK_SUGGESTED_TOPICS} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
