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
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 rounded-2xl bg-primary-purple-light text-primary-purple flex items-center justify-center mx-auto animate-pulse">
          <BarChart3 className="w-5 h-5 animate-spin" />
        </div>
        <p className="text-sm font-semibold text-slate-700">Loading performance analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="purple">Academic Analytics</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
            Performance Analytics & Mastery
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track your retention trajectory, subject strengths, and difficulty progression.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="purple" size="default">
            Demo Metrics Active
          </Badge>
          <Link href="/create-quiz">
            <Button variant="default" size="sm" className="font-bold">
              Practice Weak Areas
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row (1 col on 320px-375px, 2 col on tablet, 5 col on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <Card className="p-4 border-slate-200/90 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Average Score</p>
          <p className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1">
            {data.averageScore}%
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">+4.8% vs last week</span>
        </Card>

        <Card className="p-4 border-slate-200/90 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Quizzes Attempted</p>
          <p className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1">
            {data.totalQuizzes}
          </p>
          <span className="text-[11px] text-primary-purple font-semibold">18 completed</span>
        </Card>

        <Card className="p-4 border-slate-200/90 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Questions Answered</p>
          <p className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1">
            {data.questionsAttempted}
          </p>
          <span className="text-[11px] text-vibe-blue font-semibold">+35 this week</span>
        </Card>

        <Card className="p-4 border-slate-200/90 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Completion Rate</p>
          <p className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1">
            {data.completionRate}%
          </p>
          <span className="text-[11px] text-slate-500 font-medium">On-time submissions</span>
        </Card>

        <Card className="p-4 border-slate-200/90 shadow-xs col-span-2 sm:col-span-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Study Streak</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Flame className="w-6 h-6 text-amber-500 fill-amber-500 animate-pulse" />
            <p className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
              {data.studyStreakDays} Days
            </p>
          </div>
          <span className="text-[11px] text-amber-600 font-semibold">Active streak</span>
        </Card>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Progression Trendline */}
        <Card className="border-slate-200/90 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Score Progression Over Time</CardTitle>
            <CardDescription>
              Comparing your scores across dates vs. platform cohort average.
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
                  <YAxis domain={[50, 100]} tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} unit="%" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs space-y-1">
                            <p className="font-bold text-slate-800">{label}</p>
                            <p className="text-primary-purple font-semibold">Your Score: {payload[0]?.value}%</p>
                            {payload[1] && <p className="text-vibe-blue font-medium">Cohort Avg: {payload[1]?.value}%</p>}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#7655E8" strokeWidth={2.5} fill="url(#scoreArea)" />
                  <Area type="monotone" dataKey="platformAvg" stroke="#477CF4" strokeWidth={1.5} strokeDasharray="4 4" fill="transparent" />
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
                            <p className="text-slate-500">Questions: {item.attemptedCount}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="accuracy" radius={[8, 8, 0, 0]} maxBarSize={52}>
                    {data.difficultyBreakdown.map((entry) => (
                      <Cell key={entry.difficulty} fill={DIFFICULTY_COLORS[entry.difficulty]} />
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
            <CardDescription>Concepts where your accuracy consistently exceeds 85%.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.strongTopics.map((item) => (
              <div
                key={item.topic}
                className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{item.topic}</p>
                  <p className="text-[11px] text-slate-500">{item.subject} • {item.attempts} sessions</p>
                </div>
                <Badge variant="green" size="sm" className="font-bold shrink-0">
                  {item.accuracy}%
                </Badge>
              </div>
            ))}
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
            {data.weakTopics.map((item) => (
              <div
                key={item.topic}
                className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{item.topic}</p>
                  <p className="text-[11px] text-slate-500">{item.subject} • {item.attempts} sessions</p>
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
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
