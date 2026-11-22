"use client";

import * as React from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowRight,
  Flame,
  Percent,
  Plus,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { analyticsService, AnalyticsSummary } from "@/services/analytics.service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DIFFICULTY_COLORS = {
  Easy: "#25B98A",
  Medium: "#FFAA55",
  Hard: "#F06C9B",
};

export default function AnalyticsPage() {
  const [data, setData] = React.useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await analyticsService.getSummary();
        setData(res);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 rounded-2xl bg-primary-purple-light text-primary-purple flex items-center justify-center mx-auto animate-pulse">
          <BarChart3 className="w-5 h-5 animate-spin" />
        </div>
        <p className="text-sm font-semibold text-slate-700">Loading performance analytics...</p>
      </div>
    );
  }

  const hasData = data.totalQuizzes > 0;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="purple" size="sm">Academic Analytics</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
            Performance & Mastery
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track your score trajectory, subject strengths, and difficulty progression.
          </p>
        </div>

        <Link href="/create-quiz" className="w-full sm:w-auto">
          <Button variant="default" size="default" className="w-full sm:w-auto font-bold shadow-md shadow-primary-purple/20 min-h-[44px]">
            <Plus className="w-4 h-4 mr-1.5" />
            Create Quiz
          </Button>
        </Link>
      </div>

      {/* KPI Cards Row (2 col on mobile, 3 on tablet, 5 on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <Card className="p-3.5 sm:p-4 border-slate-200/90 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Average Score</p>
          <p className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1">
            {data.averageScore}%
          </p>
          <span className="text-[11px] text-slate-400">
            {hasData ? "Overall accuracy" : "No attempts yet"}
          </span>
        </Card>

        <Card className="p-3.5 sm:p-4 border-slate-200/90 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Quizzes Attempted</p>
          <p className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1">
            {data.totalQuizzes}
          </p>
          <span className="text-[11px] text-primary-purple font-medium">
            {hasData ? `${data.totalQuizzes} completed` : "Ready to start"}
          </span>
        </Card>

        <Card className="p-3.5 sm:p-4 border-slate-200/90 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Questions Solved</p>
          <p className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1">
            {data.questionsAttempted}
          </p>
          <span className="text-[11px] text-vibe-blue font-medium">
            {hasData ? "Total submitted" : "0 attempted"}
          </span>
        </Card>

        <Card className="p-3.5 sm:p-4 border-slate-200/90 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Completion Rate</p>
          <p className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1">
            {data.completionRate}%
          </p>
          <span className="text-[11px] text-slate-400">
            {hasData ? "Submitted quizzes" : "No sessions"}
          </span>
        </Card>

        <Card className="p-3.5 sm:p-4 border-slate-200/90 shadow-xs col-span-2 sm:col-span-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Study Streak</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 fill-amber-500" />
            <p className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
              {data.studyStreakDays} {data.studyStreakDays === 1 ? "Day" : "Days"}
            </p>
          </div>
          <span className="text-[11px] text-amber-600 font-medium">
            {data.studyStreakDays > 0 ? "Active streak" : "Start today"}
          </span>
        </Card>
      </div>

      {!hasData ? (
        /* Fresh Empty State for New Users */
        <div className="p-6 sm:p-12 text-center rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-primary-purple-light text-primary-purple flex items-center justify-center mx-auto shadow-xs">
            <BarChart3 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-heading font-extrabold text-slate-900 text-xl sm:text-2xl">
              Analytics Unlock After Your First Quiz
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Once you complete an assessment, real-time score progression trends, domain mastery breakdowns, and difficulty tier analytics will appear here automatically.
            </p>
          </div>

          <div className="pt-2">
            <Link href="/create-quiz">
              <Button variant="default" size="default" className="font-bold shadow-md shadow-primary-purple/20 min-h-[46px] px-6">
                <Plus className="w-4 h-4 mr-1.5" />
                Take Your First Quiz Now
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Visual Analytics Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Progression Trendline */}
            <Card className="border-slate-200/90 shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg">Score Progression Over Time</CardTitle>
                <CardDescription>
                  Your quiz accuracy trajectory across completed study sessions.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.scoreTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="scoreArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7655E8" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#7655E8" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} unit="%" />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs space-y-1">
                                <p className="font-bold text-slate-800">{label}</p>
                                <p className="text-primary-purple font-semibold">Your Score: {payload[0]?.value}%</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#7655E8" strokeWidth={2.5} fill="url(#scoreArea)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Difficulty Tier Accuracy */}
            <Card className="border-slate-200/90 shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg">Difficulty-Wise Accuracy</CardTitle>
                <CardDescription>
                  Comparing accuracy percentages between Easy, Medium, and Hard tiers.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.difficultyBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="difficulty" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} unit="%" />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const item = payload[0].payload as any;
                            return (
                              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs space-y-1">
                                <p className="font-bold text-slate-800">{item.difficulty} Tier</p>
                                <p className="text-primary-purple font-semibold">Accuracy: {item.accuracy}%</p>
                                <p className="text-slate-500">Estimated Questions: {item.attemptedCount}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="accuracy" radius={[8, 8, 0, 0]} maxBarSize={52}>
                        {data.difficultyBreakdown.map((entry) => (
                          <Cell key={entry.difficulty} fill={(DIFFICULTY_COLORS as any)[entry.difficulty] || "#7655E8"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Strong vs Weak Concepts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strong Topics */}
            <Card className="border-slate-200/90 shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <CardTitle className="text-base sm:text-lg">Strong Mastery Topics</CardTitle>
                </div>
                <CardDescription>Concepts where your accuracy consistently exceeds 75%.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.strongTopics.length > 0 ? (
                  data.strongTopics.map((item) => (
                    <div
                      key={item.topic}
                      className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{item.topic}</p>
                        <p className="text-[11px] text-slate-500">{item.subject} • {item.attempts} attempts</p>
                      </div>
                      <Badge variant="green" size="sm" className="font-bold shrink-0">
                        {item.accuracy}%
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    Keep practicing! Strong concepts will be highlighted here as your scores improve.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Weak Topics */}
            <Card className="border-slate-200/90 shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <CardTitle className="text-base sm:text-lg">High-Priority Weak Areas</CardTitle>
                </div>
                <CardDescription>Topics requiring focused active recall reinforcement.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.weakTopics.length > 0 ? (
                  data.weakTopics.map((item) => (
                    <div
                      key={item.topic}
                      className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{item.topic}</p>
                        <p className="text-[11px] text-slate-500">{item.subject} • {item.attempts} attempts</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="pink" size="sm" className="font-bold bg-rose-100 text-rose-800 border-rose-200">
                          {item.accuracy}%
                        </Badge>
                        <Link href={`/create-quiz?subject=${encodeURIComponent(item.subject)}&topic=${encodeURIComponent(item.topic)}`}>
                          <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs text-primary-purple font-semibold">
                            Practice
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    No critical weak spots detected. Great work!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
