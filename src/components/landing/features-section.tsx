import { Sparkles, FileText, Sliders, Brain, LineChart, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  {
    icon: Sparkles,
    color: "purple",
    badge: "Intelligent Generation",
    title: "AI Quiz Generation",
    description:
      "Generate tailored, curriculum-accurate quizzes in seconds. Specify subject, topic, and custom instructions in English, Hindi, or Hinglish.",
    borderClass: "hover:border-primary-purple/40",
    iconBg: "bg-primary-purple-light text-primary-purple",
  },
  {
    icon: FileText,
    color: "blue",
    badge: "Document Parsing",
    title: "PDF-Based Quiz Generation",
    description:
      "Upload lecture slides, research papers, or syllabus chapters. Our parser extracts key concepts and builds comprehensive assessment questions directly from your materials.",
    borderClass: "hover:border-vibe-blue/40",
    iconBg: "bg-vibe-blue-light text-vibe-blue",
  },
  {
    icon: Sliders,
    color: "orange",
    badge: "Flexible Calibration",
    title: "Multi-Tier Difficulty & Formats",
    description:
      "Configure quizzes for School through Professional levels. Choose from MCQs, multiple-select, True/False, fill-in-the-blanks, short answer, and scenario-based case questions.",
    borderClass: "hover:border-vibe-orange/40",
    iconBg: "bg-vibe-orange-light text-vibe-orange",
  },
  {
    icon: Brain,
    color: "green",
    badge: "Deep Understanding",
    title: "Detailed AI Explanations",
    description:
      "Don't just see the right answer. Every question includes step-by-step reasoning explaining why the correct choice is right and where common misconceptions lie.",
    borderClass: "hover:border-vibe-green/40",
    iconBg: "bg-vibe-green-light text-vibe-green",
  },
  {
    icon: LineChart,
    color: "pink",
    badge: "Data-Driven Growth",
    title: "Performance Analytics",
    description:
      "Monitor your accuracy rates, study streaks, time spent per question, and historical score progression with responsive, interactive visual charts.",
    borderClass: "hover:border-vibe-pink/40",
    iconBg: "bg-vibe-pink-light text-vibe-pink",
  },
  {
    icon: Target,
    color: "purple",
    badge: "Adaptive Strategy",
    title: "Personalized Learning",
    description:
      "Identify high-priority weak topics automatically. The platform highlights targeted subject areas and suggests tailored quiz follow-ups for maximum retention.",
    borderClass: "hover:border-primary-purple/40",
    iconBg: "bg-primary-purple-light text-primary-purple",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="purple" size="default">
            Comprehensive Capabilities
          </Badge>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-heading tracking-tight">
            Designed for Genuine Academic <br className="hidden sm:inline" />
            & Professional Mastery
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Every feature in Vibe Quiz is engineered to bridge the gap between passive reading and active, verifiable recall.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group p-6 sm:p-7 rounded-3xl border border-slate-200/90 bg-white transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${feature.borderClass}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${feature.iconBg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant={feature.color as any} size="sm">
                      {feature.badge}
                    </Badge>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 group-hover:text-primary-purple transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
