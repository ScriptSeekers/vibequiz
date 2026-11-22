import Link from "next/link";
import { ArrowRight, Clock, CheckCircle2, Play, BookOpen, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RecentQuizItem } from "@/mocks/quizzes";

interface RecentQuizzesProps {
  quizzes: RecentQuizItem[];
}

const DIFFICULTY_VARIANTS = {
  easy: "green",
  medium: "orange",
  hard: "pink",
  mixed: "purple",
} as const;

export function RecentQuizzes({ quizzes }: RecentQuizzesProps) {
  return (
    <Card className="border-slate-200/90 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="space-y-0.5">
          <CardTitle className="text-base sm:text-lg">Recent Quizzes</CardTitle>
          <CardDescription>
            Your generated assessments and recent test sessions.
          </CardDescription>
        </div>
        {quizzes.length > 0 && (
          <Link href="/my-quizzes">
            <Button variant="ghost" size="sm" className="text-xs text-primary-purple">
              View All
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {quizzes.length === 0 ? (
          <div className="py-10 text-center space-y-3 rounded-2xl bg-surface-ground/40 border border-slate-100 p-6">
            <BookOpen className="w-9 h-9 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800">No quizzes yet</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Generate your first quiz using AI to see your test history here.
              </p>
            </div>
            <Link href="/create-quiz">
              <Button variant="default" size="sm" className="text-xs font-semibold shadow-xs min-h-[38px] mt-2">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Create Quiz
              </Button>
            </Link>
          </div>
        ) : (
          quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-3.5 sm:p-4 rounded-2xl border border-slate-100 bg-surface-ground/60 hover:bg-white hover:border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4"
            >
              {/* Left: Info */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={(DIFFICULTY_VARIANTS as any)[quiz.difficulty] || "purple"} size="sm">
                    {quiz.difficulty.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-slate-500 font-medium">{quiz.subject}</span>
                  {quiz.completedAt && (
                    <span className="text-[11px] text-slate-400">• {quiz.completedAt}</span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {quiz.title}
                </h4>
                <p className="text-xs text-slate-500">
                  {quiz.questionCount} Questions • Topic: {quiz.topic}
                </p>
              </div>

              {/* Right: Score & Action Button */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {quiz.status === "completed" && quiz.lastScore !== undefined ? (
                  <div className="text-right">
                    <div className="text-sm font-extrabold font-heading text-emerald-600">
                      {quiz.lastScore}%
                    </div>
                    <span className="text-[10px] text-slate-400">Score</span>
                  </div>
                ) : (
                  <Badge variant="blue" size="sm">
                    Ready to Attempt
                  </Badge>
                )}

                <Link href={`/quiz-attempt?id=${quiz.id}`}>
                  <Button
                    variant={quiz.status === "completed" ? "outline" : "default"}
                    size="sm"
                    className="text-xs min-h-[38px]"
                  >
                    <Play className="w-3.5 h-3.5 mr-1" />
                    {quiz.status === "completed" ? "Retake" : "Start"}
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
