import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-purple via-[#6240DA] to-vibe-blue p-8 sm:p-12 lg:p-16 text-center text-white shadow-2xl">
          {/* Subtle background decorative shapes */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-vibe-pink/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>Ready to transform your study routine?</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight text-white leading-tight">
              Start Generating Personalized AI Quizzes Today
            </h2>

            <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto leading-relaxed">
              Join students, aspirants, and educators who use Vibe Quiz to test knowledge, identify blind spots, and learn faster.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link href="/create-quiz" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-primary-purple hover:bg-slate-50 hover:text-primary-purple-hover font-bold shadow-lg"
                >
                  Create Your First Quiz
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
