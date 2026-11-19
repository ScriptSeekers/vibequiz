import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, Clock, Zap, BookOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 gradient-hero-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex">
              <Badge variant="purple" size="lg" className="shadow-xs">
                <Sparkles className="w-4 h-4 text-primary-purple" />
                Next-Gen AI Quiz Generation & Learning
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 font-heading leading-[1.12]">
              Make Learning Smarter. <br />
              <span className="gradient-text">Make Quizzes Better.</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Create personalized AI-powered quizzes, test your knowledge and understand your progress — all in one place.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link href="/create-quiz" className="w-full sm:w-auto">
                <Button variant="default" size="lg" className="w-full sm:w-auto text-base shadow-lg shadow-primary-purple/25">
                  Create Your First Quiz
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/features" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                  Explore Features
                </Button>
              </Link>
            </div>

            {/* Trust Points (real, factual platform capabilities) */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600">
                <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Custom Topics & PDFs</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600">
                <div className="h-5 w-5 rounded-full bg-primary-purple-light flex items-center justify-center text-primary-purple shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>6 Question Formats</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600">
                <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-vibe-blue shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Step-by-Step AI Explanations</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Mockup */}
          <div className="lg:col-span-5 relative">
            {/* Background Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary-purple/20 via-vibe-blue/15 to-vibe-pink/15 rounded-3xl blur-2xl -z-10" />

            {/* Realistic Interactive Quiz Preview Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-5 sm:p-6 shadow-xl backdrop-blur-sm space-y-4">
              {/* Quiz Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-700">Live AI Quiz Session</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-medium">
                  <Clock className="w-3.5 h-3.5 text-primary-purple" />
                  <span>14:28</span>
                </div>
              </div>

              {/* Quiz Metadata Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="purple" size="sm">Computer Science</Badge>
                <Badge variant="blue" size="sm">Algorithms</Badge>
                <Badge variant="orange" size="sm">Undergraduate</Badge>
              </div>

              {/* Question Preview */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Question 4 of 15</span>
                  <span className="text-primary-purple font-semibold">25% Completed</span>
                </div>
                {/* Progress Line */}
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-purple to-vibe-blue w-1/4 rounded-full" />
                </div>
                <p className="text-sm sm:text-base font-semibold text-slate-900 font-heading pt-2">
                  What is the worst-case time complexity of QuickSort when the pivot chosen is consistently the smallest or largest element?
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2 pt-1">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs sm:text-sm text-slate-700">
                  <span>A) O(n log n)</span>
                </div>
                <div className="p-3 rounded-xl border-2 border-primary-purple bg-primary-purple-light/50 flex items-center justify-between text-xs sm:text-sm font-medium text-primary-purple shadow-xs">
                  <span>B) O(n²)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-purple text-white">Selected</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs sm:text-sm text-slate-700">
                  <span>C) O(log n)</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs sm:text-sm text-slate-700">
                  <span>D) O(1)</span>
                </div>
              </div>

              {/* Floating feature pills */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-primary-purple font-medium">
                  <Zap className="w-3.5 h-3.5" /> Instant AI Feedback
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <FileText className="w-3.5 h-3.5" /> Generated from PDF
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
