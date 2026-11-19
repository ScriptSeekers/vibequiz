"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Vibe Quiz Global Error Caught:", error);
  }, [error]);

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

      {/* Main Error Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="h-16 w-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="pink">Application Error</Badge>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
              Something went wrong
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
              An unexpected client error occurred while loading this view. Your session state is preserved.
            </p>
          </div>

          {error?.message && (
            <div className="p-3 rounded-xl bg-slate-100 text-[11px] font-mono text-slate-600 text-left overflow-x-auto max-h-24">
              {error.message}
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="default"
              size="default"
              onClick={() => reset()}
              className="w-full sm:w-auto font-bold"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Try Again
            </Button>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" size="default" className="w-full sm:w-auto">
                <Home className="w-4 h-4 mr-1.5" />
                Return to Dashboard
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
