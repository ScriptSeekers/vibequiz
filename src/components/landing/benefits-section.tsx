import { GraduationCap, Award, BookMarked, Briefcase, Users, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AUDIENCES = [
  {
    icon: GraduationCap,
    title: "School & College Students",
    subtitle: "Turn lecture slides and syllabus notes into instant exam prep.",
    color: "purple",
    benefits: [
      "Upload PDF chapters to practice targeted self-tests",
      "Immediate corrections with simple concept breakdowns",
      "Timed practice mode builds real exam stamina",
    ],
  },
  {
    icon: Award,
    title: "Competitive Exam Aspirants",
    subtitle: "High-yield practice for entrance and recruitment exams.",
    color: "blue",
    benefits: [
      "Negative marking simulation and accuracy tracking",
      "Scenario-based and multi-select question drills",
      "Deep-dive topic analytics to eliminate weak spots",
    ],
  },
  {
    icon: Users,
    title: "Teachers & Instructors",
    subtitle: "Save hours designing curriculum-aligned assessments.",
    color: "pink",
    benefits: [
      "Generate multiple test variants from lesson plans",
      "Exportable formatted question sets with answer keys",
      "Multi-difficulty question pools for balanced exams",
    ],
  },
  {
    icon: Briefcase,
    title: "Working Professionals",
    subtitle: "Upskill and certify knowledge across domains on your schedule.",
    color: "orange",
    benefits: [
      "Rapid quiz creation from whitepapers and technical specs",
      "Focused 15-minute daily knowledge checks",
      "Hinglish & multi-language support for comfortable learning",
    ],
  },
];

export function BenefitsSection() {
  return (
    <section className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="green" size="default">
            Tailored For Your Goals
          </Badge>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-heading tracking-tight">
            Built for Serious Learners at Every Stage
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Whether you are cramming for a semester final, preparing for competitive exams, or designing an exam as an educator, Vibe Quiz adapts to your workflow.
          </p>
        </div>

        {/* Audience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {AUDIENCES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-surface-ground/50 space-y-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-primary-purple shadow-xs shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <ul className="space-y-3 pt-2 border-t border-slate-200/60">
                  {item.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <div className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
