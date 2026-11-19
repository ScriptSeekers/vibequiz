import { BookOpen, Sliders, Sparkles, CheckSquare, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  {
    step: "01",
    title: "Choose Your Subject",
    description:
      "Select any discipline or upload your PDF study document, notes, or chapter syllabus.",
    icon: BookOpen,
    color: "purple",
  },
  {
    step: "02",
    title: "Customize Your Quiz",
    description:
      "Tune question count, difficulty, formats (MCQs, blanks, scenarios), language, and timer limits.",
    icon: Sliders,
    color: "blue",
  },
  {
    step: "03",
    title: "Generate With AI",
    description:
      "Watch our intelligent engine create structured, balanced questions with full contextual explanations.",
    icon: Sparkles,
    color: "pink",
  },
  {
    step: "04",
    title: "Attempt The Quiz",
    description:
      "Engage with a focused, distraction-free examination screen with autosave and question navigator.",
    icon: CheckSquare,
    color: "orange",
  },
  {
    step: "05",
    title: "Analyze Your Results",
    description:
      "Review your score, study weak topics, read step-by-step explanations, and monitor progress.",
    icon: BarChart3,
    color: "green",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-surface-ground border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="blue" size="default">
            5 Simple Steps
          </Badge>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-heading tracking-tight">
            How Vibe Quiz Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            From raw study materials to verified retention in under two minutes.
          </p>
        </div>

        {/* Steps Flow Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-4 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="relative p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 transition-all hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                      STEP {step.step}
                    </span>
                    <div className="h-10 w-10 rounded-xl bg-primary-purple-light text-primary-purple flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center text-[11px] font-semibold text-slate-400">
                  Phase {idx + 1} of 5
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
