"use client";

import Link from "next/link";
import { Sparkles, Mail, Globe, Code2 } from "lucide-react";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="border-t border-slate-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary-purple via-vibe-blue to-vibe-pink flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-slate-900">
                Vibe<span className="text-primary-purple">Quiz</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              An intelligent, responsive SaaS platform that empowers students, educators, and professionals to generate AI-powered quizzes, master challenging topics, and track real academic growth.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/vibequiz"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors"
                aria-label="Source Code"
              >
                <Code2 className="w-4 h-4" />
              </a>
              <a
                href="https://vibequiz.app"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors"
                aria-label="Vibe Quiz Website"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@vibequiz.app"
                className="h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors"
                aria-label="Email Support"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-semibold text-slate-900 tracking-wider uppercase">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/features" className="hover:text-primary-purple transition-colors">
                  Features Overview
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-primary-purple transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/create-quiz" className="hover:text-primary-purple transition-colors">
                  Quiz Generator
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary-purple transition-colors">
                  Pricing & Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Learning & Modes */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-semibold text-slate-900 tracking-wider uppercase">
              Learning
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/features" className="hover:text-primary-purple transition-colors">
                  PDF to Quiz
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-primary-purple transition-colors">
                  Competitive Exam Mode
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-primary-purple transition-colors">
                  AI Explanations
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-primary-purple transition-colors">
                  Performance Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-semibold text-slate-900 tracking-wider uppercase">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/about" className="hover:text-primary-purple transition-colors">
                  About Vibe Quiz
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary-purple transition-colors">
                  Early Access
                </Link>
              </li>
              <li>
                <span className="text-slate-400 text-xs">Privacy Policy (Compliant)</span>
              </li>
              <li>
                <span className="text-slate-400 text-xs">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} Vibe Quiz. Designed for focused, verifiable learning.</p>
          <p className="flex items-center gap-1.5">
            Built with Next.js, TypeScript & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
