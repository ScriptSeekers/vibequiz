import Link from "next/link";
import { PlusCircle, FileUp, BookOpen, History } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function QuickActions() {
  return (
    <Card className="border-slate-200/90 shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
        <CardDescription>
          Common workflows to create quizzes and manage your study path.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Create Quiz */}
          <Link href="/create-quiz" className="block focus:outline-none">
            <div className="p-3 sm:p-4 rounded-2xl border border-primary-purple/20 bg-primary-purple-light/40 hover:bg-primary-purple-light/70 hover:border-primary-purple/40 transition-all text-center space-y-1.5 sm:space-y-2 group min-h-[96px] sm:min-h-[110px] flex flex-col items-center justify-center">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-primary-purple text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <PlusCircle className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">New AI Quiz</p>
              <p className="text-[10px] text-slate-500 hidden sm:block">From topic prompt</p>
            </div>
          </Link>

          {/* Upload PDF */}
          <Link href="/create-quiz?mode=pdf" className="block focus:outline-none">
            <div className="p-3 sm:p-4 rounded-2xl border border-vibe-blue/20 bg-vibe-blue-light/40 hover:bg-vibe-blue-light/70 hover:border-vibe-blue/40 transition-all text-center space-y-1.5 sm:space-y-2 group min-h-[96px] sm:min-h-[110px] flex flex-col items-center justify-center">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-vibe-blue text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <FileUp className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">Upload PDF</p>
              <p className="text-[10px] text-slate-500 hidden sm:block">Generate from notes</p>
            </div>
          </Link>

          {/* Quiz Library */}
          <Link href="/my-quizzes" className="block focus:outline-none">
            <div className="p-3 sm:p-4 rounded-2xl border border-vibe-pink/20 bg-vibe-pink-light/40 hover:bg-vibe-pink-light/70 hover:border-vibe-pink/40 transition-all text-center space-y-1.5 sm:space-y-2 group min-h-[96px] sm:min-h-[110px] flex flex-col items-center justify-center">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-vibe-pink text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">Quiz Library</p>
              <p className="text-[10px] text-slate-500 hidden sm:block">Saved assessments</p>
            </div>
          </Link>

          {/* Past Attempts */}
          <Link href="/quiz-history" className="block focus:outline-none">
            <div className="p-3 sm:p-4 rounded-2xl border border-vibe-orange/20 bg-vibe-orange-light/40 hover:bg-vibe-orange-light/70 hover:border-vibe-orange/40 transition-all text-center space-y-1.5 sm:space-y-2 group min-h-[96px] sm:min-h-[110px] flex flex-col items-center justify-center">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-vibe-orange text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <History className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">Past Attempts</p>
              <p className="text-[10px] text-slate-500 hidden sm:block">Review scores</p>
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
