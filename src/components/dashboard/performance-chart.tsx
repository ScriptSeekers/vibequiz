"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PerformanceTrendPoint } from "@/mocks/quizzes";

interface PerformanceChartProps {
  data: PerformanceTrendPoint[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <Card className="border-slate-200/90 shadow-xs">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <CardTitle className="text-base sm:text-lg">Performance Over Time</CardTitle>
          <span className="text-xs text-primary-purple font-semibold bg-primary-purple-light px-2.5 py-0.5 rounded-full self-start sm:self-auto">
            Score Progression
          </span>
        </div>
        <CardDescription>
          Tracking your quiz scores and accuracy over your recent study sessions.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7655E8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7655E8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="avgGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#477CF4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#477CF4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748B", fontSize: 11 }}
              />
              <YAxis
                domain={[50, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748B", fontSize: 11 }}
                unit="%"
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs space-y-1">
                        <p className="font-bold text-slate-800">{label}</p>
                        <p className="text-primary-purple font-semibold">
                          Your Score: {payload[0]?.value}%
                        </p>
                        {payload[1] && (
                          <p className="text-vibe-blue font-medium">
                            Platform Avg: {payload[1]?.value}%
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#7655E8"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#scoreGradient)"
                name="Your Score"
              />
              <Area
                type="monotone"
                dataKey="platformAvg"
                stroke="#477CF4"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#avgGradient)"
                name="Platform Average"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary-purple" />
            <span>Your Score</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-vibe-blue" />
            <span>Cohort Average</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
