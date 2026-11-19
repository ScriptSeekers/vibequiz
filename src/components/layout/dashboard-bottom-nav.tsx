"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Plus, BarChart3, User } from "lucide-react";
import { cn } from "@/lib/utils";

const BOTTOM_ITEMS = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Quizzes", href: "/my-quizzes", icon: BookOpen },
  { label: "Create", href: "/create-quiz", icon: Plus, isCenter: true },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Profile", href: "/profile", icon: User },
];

export function DashboardBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 pb-[env(safe-area-inset-bottom)] select-none shadow-lg"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        {BOTTOM_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isCenter) {
            return (
              <div key={item.label} className="flex justify-center -mt-5">
                <Link
                  href={item.href}
                  className="h-12 w-12 min-h-[48px] min-w-[48px] rounded-full bg-gradient-to-r from-primary-purple to-vibe-blue text-white flex items-center justify-center shadow-lg shadow-primary-purple/35 focus:outline-none focus:ring-2 focus:ring-primary-purple active:scale-95 transition-transform"
                  aria-label="Create New Quiz"
                >
                  <Plus className="w-6 h-6" />
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center h-full min-h-[44px] transition-colors focus:outline-none",
                isActive ? "text-primary-purple font-semibold" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "text-primary-purple stroke-[2.5]")} />
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
