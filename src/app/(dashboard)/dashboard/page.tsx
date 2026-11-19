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
  Info,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/auth-store";
import {
  MOCK_DASHBOARD_STATS,
  MOCK_PERFORMANCE_TREND,
  MOCK_SUBJECT_PERFORMANCE,
  MOCK_RECENT_QUIZZES,
  MOCK_SUGGESTED_TOPICS,
} from "@/mocks/quizzes";
import { StatCard } from "@/components/dashboard/stat-card";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { SubjectChart } from "@/components/dashboard/subject-chart";
import { RecentQuizzes } from "@/components/dashboard/recent-quizzes";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { SuggestedTopics } from "@/components/dashboard/suggested-topics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const userName = user?.fullName || "Alex Johnson";

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
              Welcome back, {userName}!
            </h1>
            <span className="hidden sm:inline-block">👋</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Track your progress, review past mistakes, and test yourself with new AI quizzes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="purple" size="default" className="hidden sm:inline-flex">
            <Info className="w-3.5 h-3.5" /> Demo Metrics Active
          </Badge>
          <Link href="/create-quiz">
            <Button
              variant="default"
              size="default"
              className="w-full sm:w-auto shadow-md shadow-primary-purple/20 font-bold"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Create Quiz
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Core Statistics (Responsive Grid: 1 col on <=375px, 2 col on tablet, 4 col on desktop) */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Quizzes"
          value={MOCK_DASHBOARD_STATS.totalQuizzes}
          change={MOCK_DASHBOARD_STATS.quizzesChange}
          isPositive={true}
          icon={BookOpen}
          iconColor="purple"
        />
        <StatCard
          title="Questions Attempted"
          value={MOCK_DASHBOARD_STATS.questionsAttempted}
          change="+35 questions this week"
          isPositive={true}
          icon={CheckCircle2}
          iconColor="blue"
        />
        <StatCard
          title="Average Score"
          value={`${MOCK_DASHBOARD_STATS.averageScore}%`}
          change={MOCK_DASHBOARD_STATS.scoreChange}
          isPositive={true}
          icon={TrendingUp}
          iconColor="green"
        />
        <StatCard
          title="Completion Rate"
          value={`${MOCK_DASHBOARD_STATS.completionRate}%`}
          change="94% submitted on time"
          isPositive={true}
          icon={Percent}
          iconColor="orange"
        />
      </div>

      {/* Quick Actions Bar */}
      <QuickActions />

      {/* Charts Grid: Performance Over Time & Subject Accuracy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart data={MOCK_PERFORMANCE_TREND} />
        <SubjectChart data={MOCK_SUBJECT_PERFORMANCE} />
      </div>

      {/* Bottom Grid: Recent Quizzes & Suggested Focus Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <RecentQuizzes quizzes={MOCK_RECENT_QUIZZES} />
        </div>
        <div className="lg:col-span-5">
          <SuggestedTopics topics={MOCK_SUGGESTED_TOPICS} />
        </div>
      </div>
    </div>
  );
}
