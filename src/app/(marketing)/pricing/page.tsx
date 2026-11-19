import { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles, Zap, Users, ShieldAlert, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pricing & Early Access — Vibe Quiz",
  description: "Transparent pricing for Vibe Quiz. Free early access currently available for all students and educators.",
};

const TIERS = [
  {
    name: "Early Access",
    status: "Active & Free",
    statusBadge: "green",
    price: "$0",
    period: "during public beta",
    description: "Full access to our AI generation engine, PDF parsing, and interactive quiz sessions.",
    cta: "Start Free Today",
    ctaLink: "/create-quiz",
    ctaVariant: "default" as const,
    featured: true,
    features: [
      "Unlimited AI quiz generation",
      "PDF upload & document parsing (up to 25MB)",
      "All 6 question types included",
      "Full step-by-step AI explanations",
      "Performance analytics & weak topic alerts",
      "Timed examination mode",
      "English, Hindi, and Hinglish language support",
    ],
  },
  {
    name: "Pro Learner",
    status: "Coming Soon",
    statusBadge: "neutral",
    price: "$8",
    period: "per month (planned)",
    description: "Designed for competitive exam candidates requiring advanced adaptive drills.",
    cta: "Join Waitlist",
    ctaLink: "/signup",
    ctaVariant: "outline" as const,
    featured: false,
    features: [
      "Everything in Early Access",
      "Extended PDF parsing (up to 100MB textbooks)",
      "Adaptive spaced-repetition revision cycles",
      "Exportable formatted PDF study sheets with keys",
      "Voice dictation question mode",
      "Priority AI model response latency",
    ],
  },
  {
    name: "Educators & Teams",
    status: "Coming Soon",
    statusBadge: "neutral",
    price: "$29",
    period: "per month (planned)",
    description: "For classroom teachers, coaching institutes, and corporate training teams.",
    cta: "Inquire for Early Beta",
    ctaLink: "/about",
    ctaVariant: "outline" as const,
    featured: false,
    features: [
      "Everything in Pro",
      "Classroom cohort assignment & tracking",
      "Custom branding & question bank exports",
      "Anti-cheating exam link generation",
      "CSV bulk question upload & AI validation",
      "Dedicated educator support",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="py-12 sm:py-20 space-y-16 sm:space-y-24">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <Badge variant="purple" size="lg">
          Transparent & Accessible Pricing
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-heading">
          Free Early Access For Everyone
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          We believe high-quality, personalized learning tools should be accessible to all. During our launch phase, core features are completely free with no credit card required.
        </p>
      </section>

      {/* Tiers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                tier.featured
                  ? "border-2 border-primary-purple bg-white shadow-xl relative ring-4 ring-primary-purple/10"
                  : "border border-slate-200/90 bg-white shadow-sm opacity-90"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-purple text-white shadow-sm">
                    Recommended / Active Now
                  </span>
                </div>
              )}

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-bold text-slate-900">
                    {tier.name}
                  </h3>
                  <Badge variant={tier.statusBadge as any} size="sm">
                    {tier.status}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900">
                      {tier.price}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-500 font-normal">
                      /{tier.period}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                    {tier.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    What&apos;s Included
                  </p>
                  <ul className="space-y-3">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <div className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <Link href={tier.ctaLink} className="w-full">
                  <Button
                    variant={tier.ctaVariant}
                    size="lg"
                    className="w-full justify-center"
                  >
                    {tier.cta}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Clarification Box */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-ground border border-slate-200/90 text-center space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-purple">
            Transparent Policy
          </p>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
            Will free accounts lose their data when paid tiers launch?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            No. Your generated quizzes, past attempts, and analytics history will always remain preserved in your account. Future paid tiers will only apply to expanded limits and institutional collaboration features.
          </p>
        </div>
      </section>
    </div>
  );
}
