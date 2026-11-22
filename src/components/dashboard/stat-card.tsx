import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconColor: "purple" | "blue" | "green" | "orange";
}

const COLOR_VARIANTS = {
  purple: "bg-primary-purple-light text-primary-purple",
  blue: "bg-vibe-blue-light text-vibe-blue",
  green: "bg-vibe-green-light text-vibe-green",
  orange: "bg-vibe-orange-light text-vibe-orange",
};

export function StatCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  iconColor,
}: StatCardProps) {
  return (
    <Card className="p-4 sm:p-5 border-slate-200/90 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center shrink-0",
            COLOR_VARIANTS[iconColor]
          )}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>

      {change && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "font-medium",
              isPositive ? "text-emerald-600" : "text-slate-500"
            )}
          >
            {change}
          </span>
        </div>
      )}
    </Card>
  );
}
