"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Menu, X, ArrowRight, BookOpen, Layers, Info, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/", icon: Sparkles },
  { label: "Features", href: "/features", icon: Layers },
  { label: "How It Works", href: "/#how-it-works", icon: BookOpen },
  { label: "About", href: "/about", icon: Info },
  { label: "Pricing", href: "/pricing", icon: CreditCard },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-purple rounded-xl p-1"
          aria-label="Vibe Quiz Home"
        >
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-tr from-primary-purple via-vibe-blue to-vibe-pink flex items-center justify-center text-white shadow-md shadow-primary-purple/20 transition-transform group-hover:scale-105">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-none">
              Vibe<span className="text-primary-purple">Quiz</span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-wide">
              AI Learning Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors hover:text-primary-purple hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-purple/50",
                  isActive ? "text-primary-purple font-semibold bg-primary-purple-light" : "text-slate-600"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="default">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="default" size="default" className="shadow-md shadow-primary-purple/20">
              Get Started
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button (44px min touch target) */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-xs px-2.5">
              Log In
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center h-11 w-11 min-h-[44px] min-w-[44px] rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-purple"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-full bg-white border-b border-slate-200 shadow-xl px-5 py-6 space-y-5 animate-in slide-in-from-top-4 duration-200 max-h-[calc(100vh-4rem)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-base font-medium min-h-[44px] transition-colors",
                      isActive
                        ? "bg-primary-purple-light text-primary-purple font-semibold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <Icon className="w-5 h-5 text-slate-500" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" size="lg" className="w-full justify-center">
                  Create Your First Quiz
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="default" className="w-full justify-center">
                  Sign In to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
