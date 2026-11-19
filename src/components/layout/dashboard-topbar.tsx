"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Menu, Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardDrawer } from "./dashboard-drawer";

export function DashboardTopbar() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Mobile Left: Logo & Home Link */}
        <div className="flex items-center gap-3 lg:hidden">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary-purple via-vibe-blue to-vibe-pink flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-heading text-lg font-extrabold tracking-tight text-slate-900">
              Vibe<span className="text-primary-purple">Quiz</span>
            </span>
          </Link>
        </div>

        {/* Desktop Left: Breadcrumb / Workspace context */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Workspace
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-semibold text-slate-800">
            Student Dashboard
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Create Quiz Button (Prominent) */}
          <Link href="/create-quiz">
            <Button
              variant="default"
              size="sm"
              className="hidden sm:inline-flex shadow-sm shadow-primary-purple/20 font-bold"
            >
              <Plus className="w-4 h-4 mr-1" />
              Create Quiz
            </Button>
          </Link>

          {/* Mobile Quick Create Icon Button */}
          <Link href="/create-quiz" className="sm:hidden">
            <Button
              variant="default"
              size="iconSm"
              className="shadow-sm shadow-primary-purple/20"
              aria-label="Create Quiz"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </Link>

          {/* Mobile Drawer Trigger (Hamburger) */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 min-h-[44px] min-w-[44px] rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Drawer */}
      <DashboardDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
