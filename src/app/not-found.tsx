import Link from "next/link";
import { Sparkles, ArrowLeft, Home, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between selection:bg-primary-purple/20 selection:text-primary-purple">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary-purple via-vibe-blue to-vibe-pink flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-slate-900">
            Vibe<span className="text-primary-purple">Quiz</span>
          </span>
        </Link>
      </header>

      {/* Main 404 Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <Badge variant="purple" size="lg">
            404 Error • Page Not Found
          </Badge>

          <h1 className="text-6xl sm:text-8xl font-black font-heading tracking-tight text-slate-900">
            4<span className="gradient-text">0</span>4
          </h1>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
              Lost in the Curriculum?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
              The page you are looking for does not exist, has been archived, or was moved to another section.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="default" size="default" className="w-full sm:w-auto">
                <Home className="w-4 h-4 mr-1.5" />
                Return Home
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" size="default" className="w-full sm:w-auto">
                <Compass className="w-4 h-4 mr-1.5" />
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-slate-400">
        © 2026 Vibe Quiz. All rights reserved.
      </footer>
    </div>
  );
}
