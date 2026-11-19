"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Play,
  Trash2,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";
import { MOCK_RECENT_QUIZZES, RecentQuizItem } from "@/mocks/quizzes";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";

const DIFFICULTY_MAP = {
  easy: "green",
  medium: "orange",
  hard: "pink",
  mixed: "purple",
} as const;

export default function MyQuizzesPage() {
  const [quizzes, setQuizzes] = React.useState<RecentQuizItem[]>(MOCK_RECENT_QUIZZES);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<string>("all");
  const [selectedSubject, setSelectedSubject] = React.useState<string>("all");
  const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(null);

  const filteredQuizzes = quizzes.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDiff =
      selectedDifficulty === "all" || q.difficulty === selectedDifficulty;

    const matchesSubj =
      selectedSubject === "all" || q.subject === selectedSubject;

    return matchesSearch && matchesDiff && matchesSubj;
  });

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      setQuizzes((prev) => prev.filter((q) => q.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  const uniqueSubjects = Array.from(new Set(quizzes.map((q) => q.subject)));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="purple">Library</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
            My Quiz Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Browse, manage, and attempt your AI-generated assessments and practice suites.
          </p>
        </div>

        <Link href="/create-quiz">
          <Button variant="default" size="default" className="font-bold shadow-md shadow-primary-purple/20">
            <Plus className="w-4 h-4 mr-1.5" />
            Create New Quiz
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by quiz title, topic, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-xs sm:text-sm h-11"
          />
        </div>

        {/* Subject Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-purple/20 min-h-[44px]"
          >
            <option value="all">All Subjects</option>
            {uniqueSubjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-purple/20 min-h-[44px]"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>

      {/* Quizzes Grid */}
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuizzes.map((quiz) => (
            <Card
              key={quiz.id}
              className="border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <CardHeader className="space-y-2 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={DIFFICULTY_MAP[quiz.difficulty] as any} size="sm">
                      {quiz.difficulty.toUpperCase()}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-500">{quiz.subject}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(quiz.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Delete Quiz"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <CardTitle className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2">
                  {quiz.title}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Topic: {quiz.topic} • {quiz.questionCount} Questions
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  {quiz.lastScore !== undefined ? (
                    <span className="font-semibold text-emerald-600">
                      Last Score: {quiz.lastScore}%
                    </span>
                  ) : (
                    <span className="text-slate-400">Not attempted yet</span>
                  )}
                </div>

                <Link href={`/quiz-attempt?id=${quiz.id}`}>
                  <Button variant="default" size="sm" className="font-semibold text-xs">
                    <Play className="w-3.5 h-3.5 mr-1" />
                    Attempt Quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200/80 space-y-4">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-slate-900 text-lg">No Quizzes Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No assessments match your current search or filter query. Try resetting filters or create a new quiz.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedDifficulty("all");
              setSelectedSubject("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <DialogHeader onClose={() => setDeleteTargetId(null)}>
          <DialogTitle>Confirm Quiz Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this quiz? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteTargetId(null)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteConfirm}>
            Delete Quiz
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
