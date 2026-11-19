"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { SubjectPerformancePoint } from "@/mocks/quizzes";

interface SubjectChartProps {
  data: SubjectPerformancePoint[];
}

const BAR_COLORS = ["#7655E8", "#477CF4", "#25B98A", "#FFAA55"];

export function SubjectChart({ data }: SubjectChartProps) {
  return (
    <Card className="border-slate-200/90 shadow-xs">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <CardTitle className="text-base sm:text-lg">Subject-Wise Accuracy</CardTitle>
          <span className="text-xs text-vibe-blue font-semibold bg-vibe-blue-light px-2.5 py-0.5 rounded-full self-start sm:self-auto">
            Domain Breakdown
          </span>
        </div>
        <CardDescription>
          Average scores achieved across your most active study subjects.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="subject"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748B", fontSize: 10 }}
                interval={0}
              />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748B", fontSize: 11 }}
                unit="%"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as SubjectPerformancePoint;
                    return (
                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs space-y-1">
                        <p className="font-bold text-slate-800">{item.subject}</p>
                        <p className="text-primary-purple font-semibold">
                          Accuracy: {item.score}%
                        </p>
                        <p className="text-slate-500">
                          Quizzes Attempted: {item.quizzesCount}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={48}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
          {data.map((item, idx) => (
            <div key={item.subject} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: BAR_COLORS[idx % BAR_COLORS.length] }}
              />
              <span>{item.subject}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
