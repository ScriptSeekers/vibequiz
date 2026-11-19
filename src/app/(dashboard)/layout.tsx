"use client";

import * as React from "react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { DashboardBottomNav } from "@/components/layout/dashboard-bottom-nav";
import { useAuthStore } from "@/features/auth/auth-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth, isInitialized } = useAuthStore();

  React.useEffect(() => {
    if (!isInitialized) {
      checkAuth();
    }
  }, [isInitialized, checkAuth]);

  return (
    <div className="min-h-screen bg-surface-ground flex flex-col selection:bg-primary-purple/20 selection:text-primary-purple">
      {/* Desktop Sidebar (w-64) */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <DashboardTopbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-28 lg:pb-12 max-w-7xl mx-auto w-full space-y-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Fixed) */}
      <DashboardBottomNav />
    </div>
  );
}
