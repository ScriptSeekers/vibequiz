import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Shield, Compass, Target, Code, Heart, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us — Vibe Quiz Mission & Architecture",
  description: "Learn about Vibe Quiz's mission to make active testing and AI-powered learning accessible, transparent, and verified.",
};

const VALUES = [
  {
    icon: Target,
    title: "Active Recall Over Passive Skimming",
    description:
      "Cognitive science shows that testing yourself produces up to 50% better long-term retention than re-reading notes. We build tools that make active retrieval effortless.",
  },
  {
    icon: Shield,
    title: "Truth & Schema Verification",
    description:
      "We strictly validate every AI-generated question, option, and explanation against rigorous educational schemas to prevent misleading distractors or inaccurate answer keys.",
  },
  {
    icon: Compass,
    title: "Universal Accessibility",
    description:
      "Whether on a low-bandwidth 320px mobile screen on a bus or a 4K desktop monitor in a library, Vibe Quiz provides a fast, touch-friendly, accessible experience.",
  },
  {
    icon: Code,
    title: "Developer & Production Rigor",
    description:
      "Engineered with clean architectural separation: typed domain entities, decoupled service adapters, deterministic grading, and zero compromises on mobile performance.",
  },
];

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20 space-y-16 sm:space-y-24">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <Badge variant="purple" size="lg">
          Our Philosophy
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-heading">
          Empowering Every Learner with <br />
          <span className="gradient-text">Verifiable Knowledge</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Vibe Quiz was born out of a simple observation: students spend hundreds of hours re-reading notes without knowing what they will actually remember under exam pressure.
        </p>
      </section>

      {/* Story & Mission */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-slate-200 bg-white space-y-6 shadow-xs">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            The Mission Behind Vibe Quiz
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            <p>
              Traditional study methods focus heavily on passive ingestion: highlight textbooks, re-watch lecture recordings, or flip through flashcards without context. But when high-stakes exams arrive, students are tested on synthetic reasoning and problem solving under time limits.
            </p>
            <p>
              Vibe Quiz harnesses the power of modern Large Language Models and strict structural schemas to generate custom assessment suites instantly. By converting your course syllabus, lecture PDFs, or specific curiosity into timed, interactive quizzes with instant reasoning, you identify gaps in real time.
            </p>
            <p className="font-semibold text-slate-900">
              No generic question banks. No fake engagement tricks. Just active learning calibrated to your level.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            Our Core Principles
          </h2>
          <p className="text-sm text-slate-600">
            The values that guide every design decision and algorithm in Vibe Quiz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 bg-white space-y-4 hover:shadow-md transition-all"
              >
                <div className="h-12 w-12 rounded-2xl bg-primary-purple-light text-primary-purple flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  {v.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {v.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Open Source & Feedback */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="p-8 rounded-3xl bg-surface-ground border border-slate-200 space-y-4">
          <Heart className="w-8 h-8 text-vibe-pink mx-auto" />
          <h3 className="text-xl font-bold font-heading text-slate-900">
            Built with transparency
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Have questions, feature requests, or feedback on question calibration? We read every message and continuously refine our generation models.
          </p>
          <div className="pt-2">
            <Link href="/create-quiz">
              <Button variant="default">
                Try Vibe Quiz Free
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
