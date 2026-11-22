"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  PlusCircle,
  BookOpen,
  History,
  BarChart3,
  User,
  Settings,
  LogOut,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/features/auth/auth-store";
import { Badge } from "@/components/ui/badge";

export const DASHBOARD_NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Create Quiz", href: "/create-quiz", icon: PlusCircle, isPrimary: true },
  { label: "My Quizzes", href: "/my-quizzes", icon: BookOpen },
  { label: "Quiz History", href: "/quiz-history", icon: History },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const displayName = user?.fullName || (user?.email ? user.email.split("@")[0] : "Learner");
  const displayEmail = user?.email || "Student Account";

  return (
    <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 z-30 bg-white border-r border-slate-200/90 select-none">
      {/* Top Logo */}
      <div className="h-20 px-6 flex items-center border-b border-slate-100">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-purple rounded-xl"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary-purple via-vibe-blue to-vibe-pink flex items-center justify-center text-white shadow-md shadow-primary-purple/20 transition-transform group-hover:scale-105">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-xl font-extrabold tracking-tight text-slate-900 leading-none">
              Vibe<span className="text-primary-purple">Quiz</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
              Workspace
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Platform
        </div>

        {DASHBOARD_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isPrimary) {
            return (
              <div key={item.label} className="pt-1 pb-2">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all shadow-sm",
                    isActive
                      ? "bg-primary-purple text-white shadow-primary-purple/25"
                      : "bg-primary-purple-light text-primary-purple hover:bg-primary-purple hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <Badge variant="purple" size="sm" className="bg-white/20 text-current border-none">
                    AI
                  </Badge>
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group min-h-[42px]",
                isActive
                  ? "bg-slate-100 text-primary-purple font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  isActive ? "text-primary-purple" : "text-slate-400 group-hover:text-slate-700"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Bottom User Profile Section */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary-purple to-vibe-blue flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
            {displayName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
            <p className="text-[11px] text-slate-500 truncate">{displayEmail}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
