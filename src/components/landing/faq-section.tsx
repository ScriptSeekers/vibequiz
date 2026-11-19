"use client";

import * as React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "How does AI quiz generation work in Vibe Quiz?",
    answer:
      "Vibe Quiz uses advanced language models trained to understand academic curricula and domain-specific texts. You input your subject, topic, and difficulty level, or upload your own PDF notes. The system validates the output against a strict schema to deliver balanced, verified questions with step-by-step explanations.",
  },
  {
    question: "Can I upload my own PDF documents and textbooks?",
    answer:
      "Yes. You can upload study guides, syllabus documents, lecture presentations, or research papers up to 25MB. Vibe Quiz extracts the core concepts and formulates questions directly from the provided source material.",
  },
  {
    question: "What question types are supported?",
    answer:
      "Vibe Quiz supports 6 distinct assessment types: Single-choice MCQs, Multiple-select MCQs, True/False statements, Fill in the blanks, Short conceptual answers, and Scenario-based case studies.",
  },
  {
    question: "Are questions and explanations available in Hindi or Hinglish?",
    answer:
      "Yes. You can select English, Hindi, or Hinglish (conversational Hindi-English blend commonly used in coaching institutes and colleges across India) during quiz setup.",
  },
  {
    question: "How are quizzes scored and evaluated?",
    answer:
      "Objective questions (MCQ, True/False) are scored deterministically against strict server keys so accuracy is completely tamper-proof. For conceptual answers, detailed AI explanations explain key missing points.",
  },
  {
    question: "What is the pricing model for Vibe Quiz?",
    answer:
      "Vibe Quiz is currently in Free Early Access. All registered users receive unlimited quiz generation, PDF uploads, and full analytics. Advanced team and institutional plans will be introduced transparently in the future.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-surface-ground border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="orange" size="default">
            Got Questions?
          </Badge>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-heading tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Everything you need to know about AI generation, document processing, and quiz grading.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-purple min-h-[52px]"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-sm sm:text-base font-bold text-slate-900">
                    {faq.question}
                  </span>
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180 bg-primary-purple-light text-primary-purple"
                    )}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in-50 duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
