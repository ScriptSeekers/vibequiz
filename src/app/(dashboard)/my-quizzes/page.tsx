"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Plus,
  Play,
  Trash2,
  Clock,
  Sparkles,
  FileUp,
} from "lucide-react";
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
import { quizService } from "@/services/quiz.service";
import { resultsService } from "@/services/results.service";
import { Quiz } from "@/types/quiz";

const DIFFICULTY_MAP = {
  easy: "green",
  medium: "orange",
  hard: "pink",
  mixed: "purple",
} as const;

interface QuizListItem {
  id: string;
  title: string;
  subject: string;
  topic: string;
  questionCount: number;
  difficulty: "easy" | "medium" | "hard" | "mixed";
  lastScore?: number;
  createdAt: string;
}

const STARTER_TOPICS = [
  { subject: "Computer Science", topic: "Operating Systems & Concurrency" },
  { subject: "Mathematics", topic: "Calculus & Differential Equations" },
  { subject: "Biology", topic: "Cellular Respiration & Genetics" },
  { subject: "World History", topic: "Industrial Revolution & Modern Era" },
];

export default function MyQuizzesPage() {
  const [quizzes, setQuizzes] = React.useState<QuizListItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<string>("all");
  const [selectedSubject, setSelectedSubject] = React.useState<string>("all");
  const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(null);

  const loadQuizzes = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const storedQuizzes = await quizService.getAllQuizzes();
      const results = await resultsService.getAllResults();

      // Build map of latest score per quizId
      const scoreMap: Record<string, number> = {};
      for (const res of results) {
        if (scoreMap[res.quizId] === undefined) {
          scoreMap[res.quizId] = Math.round(res.scorePercentage);
        }
      }

      const list: QuizListItem[] = storedQuizzes.map((q) => ({
        id: q.id,
        title: q.title,
        subject: q.subject,
        topic: q.topic,
        questionCount: q.questionCount || q.questions?.length || 0,
        difficulty: (q.difficulty as any) || "medium",
        lastScore: scoreMap[q.id],
        createdAt: q.createdAt,
      }));

      setQuizzes(list);
    } catch (err) {
      console.error("Failed to load quizzes:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

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

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      await quizService.deleteQuiz(deleteTargetId);
      setQuizzes((prev) => prev.filter((q) => q.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  const uniqueSubjects = Array.from(new Set(quizzes.map((q) => q.subject)));

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="purple" size="sm">Library</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
            My Quiz Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Browse, manage, and attempt your AI-generated assessments and practice suites.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/create-quiz" className="w-full sm:w-auto">
            <Button
              variant="default"
              size="default"
              className="w-full sm:w-auto font-bold shadow-md shadow-primary-purple/20 min-h-[44px]"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Create Quiz
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-primary-purple-light text-primary-purple flex items-center justify-center mx-auto animate-pulse">
            <BookOpen className="w-5 h-5 animate-spin" />
          </div>
          <p className="text-sm font-semibold text-slate-600">Loading your quizzes...</p>
        </div>
      ) : quizzes.length === 0 ? (
        /* Fresh Empty State for New Users */
        <div className="p-6 sm:p-12 text-center rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-primary-purple-light text-primary-purple flex items-center justify-center mx-auto shadow-xs">
            <BookOpen className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-heading font-extrabold text-slate-900 text-xl sm:text-2xl">
              Your Quiz Library is Empty
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Generate an assessment from any topic or upload your syllabus to build your personal question bank.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/create-quiz" className="w-full sm:w-auto">
              <Button variant="default" size="default" className="w-full sm:w-auto font-bold shadow-md shadow-primary-purple/20 min-h-[46px]">
                <Plus className="w-4 h-4 mr-1.5" />
                Generate New Quiz
              </Button>
            </Link>
            <Link href="/create-quiz?mode=pdf" className="w-full sm:w-auto">
              <Button variant="outline" size="default" className="w-full sm:w-auto text-slate-700 min-h-[46px]">
                <FileUp className="w-4 h-4 mr-1.5" />
                Upload PDF Notes
              </Button>
            </Link>
          </div>

          {/* Quick-Start Topic Chips */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5 text-left">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Sparkles className="w-3.5 h-3.5 text-primary-purple" />
              <span>Or try one of these popular starter topics:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {STARTER_TOPICS.map((item) => (
                <Link
                  key={item.topic}
                  href={`/create-quiz?subject=${encodeURIComponent(item.subject)}&topic=${encodeURIComponent(item.topic)}`}
                  className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-primary-purple-light/50 border border-slate-200/80 text-xs font-medium text-slate-700 hover:text-primary-purple transition-colors flex items-center gap-1.5"
                >
                  <span>{item.subject}:</span>
                  <span className="font-semibold text-slate-900">{item.topic}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
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
                  className="border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between p-4 sm:p-5"
                >
                  <div className="space-y-2 pb-3">
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
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
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
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
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
                      <Button variant="default" size="sm" className="font-semibold text-xs min-h-[38px]">
                        <Play className="w-3.5 h-3.5 mr-1" />
                        Attempt Quiz
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-3xl bg-white border border-slate-200/80 space-y-3">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="font-heading font-bold text-slate-900 text-base">No Matching Quizzes</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No assessments match your filter query.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDifficulty("all");
                  setSelectedSubject("all");
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <DialogHeader onClose={() => setDeleteTargetId(null)}>
          <DialogTitle>Confirm Quiz Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this quiz? This will remove it from your library.
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
