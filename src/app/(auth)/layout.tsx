import Link from "next/link";
import { Sparkles, ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between selection:bg-primary-purple/20 selection:text-primary-purple">
      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-purple rounded-xl p-1"
          aria-label="Back to Vibe Quiz Home"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary-purple via-vibe-blue to-vibe-pink flex items-center justify-center text-white shadow-md shadow-primary-purple/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-heading text-xl font-extrabold tracking-tight text-slate-900">
            Vibe<span className="text-primary-purple">Quiz</span>
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md space-y-6">
          {children}

          {/* Demo Mode Notice */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-2.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-primary-purple shrink-0" />
            <span>
              <strong>Frontend Evaluation Mode:</strong> Demonstrates complete auth flows with mock service adapter. Ready for Supabase Auth in production.
            </span>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full py-6 text-center text-xs text-slate-400">
        © 2026 Vibe Quiz. Encrypted & privacy-conscious learning.
      </footer>
    </div>
  );
}
