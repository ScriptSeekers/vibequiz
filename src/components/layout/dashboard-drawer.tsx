"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X, Sparkles, LogOut, ChevronRight } from "lucide-react";
import { DASHBOARD_NAV_ITEMS } from "./dashboard-sidebar";
import { useAuthStore } from "@/features/auth/auth-store";
import { cn } from "@/lib/utils";

interface DashboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardDrawer({ isOpen, onClose }: DashboardDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    onClose();
    await logout();
    router.push("/login");
  };

  const displayName = user?.fullName || (user?.email ? user.email.split("@")[0] : "Learner");
  const displayEmail = user?.email || "Student Account";

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary-purple to-vibe-blue flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-heading font-bold text-slate-900 text-lg">Menu</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 py-6 space-y-1 overflow-y-auto">
          {DASHBOARD_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium min-h-[44px] transition-colors",
                  isActive
                    ? "bg-primary-purple-light text-primary-purple font-semibold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-slate-500" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </Link>
            );
          })}
        </div>

        {/* User Profile & Logout */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50">
            <div className="h-9 w-9 rounded-full bg-primary-purple text-white font-bold text-xs flex items-center justify-center shrink-0">
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
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 min-h-[44px] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
