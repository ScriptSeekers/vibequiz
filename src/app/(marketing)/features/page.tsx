import { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  FileText,
  Sliders,
  Brain,
  LineChart,
  Target,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Layers,
  Clock,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Features — Intelligent Quiz Generation & Analytics",
  description: "Explore the comprehensive capabilities of Vibe Quiz: AI generation, PDF processing, 6 question formats, and detailed analytics.",
};

const FEATURE_DEEP_DIVES = [
  {
    id: "ai-generation",
    badge: "Core AI Engine",
    color: "purple",
    title: "AI Quiz Generation from Custom Topics",
    description:
      "Whether you are studying Organic Chemistry, Constitutional Law, or Microservices Architecture, Vibe Quiz produces balanced questions aligned to your exact syllabus level.",
    points: [
      "Natural language topic and subtopic inputs",
      "Strict schema enforcement to eliminate hallucinations",
      "Language support in English, Hindi, and Hinglish",
      "Configurable custom instructions (e.g., 'focus on edge cases and numericals')",
    ],
    icon: Sparkles,
  },
  {
    id: "pdf-processing",
    badge: "Smart Ingestion",
    color: "blue",
    title: "PDF Document & Notes Ingestion",
    description:
      "Transform static textbooks, lecture slide decks, and class notes into active evaluation quizzes without manual copy-pasting.",
    points: [
      "Supports files up to 25MB",
      "Client-side verification and parsing status indicators",
      "Extracts definitions, formulas, and conceptual relationships",
      "Option to limit quiz scope to specific sections or chapters",
    ],
    icon: FileText,
  },
  {
    id: "difficulty-levels",
    badge: "Adaptive Rigor",
    color: "orange",
    title: "Tiered Education Levels & Formats",
    description:
      "Calibrate difficulty from basic recall to complex clinical and technical problem-solving.",
    points: [
      "Education tiers: School, Higher Secondary, Undergraduate, Postgraduate, Professional",
      "Difficulty tiers: Easy, Medium, Hard, or Mixed",
      "6 Question formats: Single MCQ, Multi-select, True/False, Blanks, Short Answer, Scenarios",
      "Timed examination mode with realistic pacing constraints",
    ],
    icon: Sliders,
  },
  {
    id: "explanations",
    badge: "Active Learning",
    color: "green",
    title: "Comprehensive AI Explanations",
    description:
      "True learning occurs when you understand your mistakes. Every generated quiz item includes thorough contextual reasoning.",
    points: [
      "Step-by-step breakdown of why the correct option is valid",
      "Identification of common pitfalls and distractors",
      "Direct references back to the key topic concepts",
      "Accessible answer review available immediately after submission",
    ],
    icon: Brain,
  },
  {
    id: "analytics",
    badge: "Growth Tracking",
    color: "pink",
    title: "Topic Mastery & Performance Analytics",
    description:
      "Visualize your academic trajectory over time with interactive, mobile-friendly charts and breakdown tables.",
    points: [
      "Accuracy percentages across subjects and difficulty tiers",
      "Automatic detection of weak topics requiring review",
      "Historical score trendlines and study streaks",
      "Time spent per question analysis to improve exam speed",
    ],
    icon: LineChart,
  },
];

export default function FeaturesPage() {
  return (
    <div className="py-12 sm:py-20 space-y-16 sm:space-y-24">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <Badge variant="purple" size="lg">
          Platform Architecture & Capabilities
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-heading">
          Built for Deeper Understanding, <br />
          <span className="gradient-text">Not Just Memorization</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Discover how Vibe Quiz combines verified pedagogical structures with modern AI to accelerate your learning curve.
        </p>
      </section>

      {/* Feature Deep Dives */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {FEATURE_DEEP_DIVES.map((f, idx) => {
          const Icon = f.icon;
          const isEven = idx % 2 === 0;
          return (
            <div
              key={f.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-10 rounded-3xl border border-slate-200/90 bg-white shadow-xs ${
                isEven ? "" : "lg:flex-row-reverse"
              }`}
            >
              <div className={`lg:col-span-7 space-y-5 ${isEven ? "" : "lg:order-2"}`}>
                <div className="flex items-center gap-2">
                  <Badge variant={f.color as any}>{f.badge}</Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
                  {f.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {f.description}
                </p>
                <ul className="space-y-2.5 pt-2">
                  {f.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`lg:col-span-5 ${isEven ? "" : "lg:order-1"}`}>
                <div className="rounded-2xl border border-slate-200 bg-surface-ground p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-primary-purple shadow-sm">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading font-semibold text-slate-900 text-lg">
                    {f.title.split(" ")[0]} Module
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Optimized for instant feedback, low latency generation, and verified output accuracy.
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* CTA Box */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
          Ready to experience the difference?
        </h2>
        <div className="flex justify-center gap-3">
          <Link href="/create-quiz">
            <Button variant="default" size="lg">
              Create a Quiz Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
