"use client";

import React, { memo } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardWidgetProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const StatCardWidget = memo<StatCardWidgetProps>(
  function StatCardWidget({ title, value, change, trend, icon: Icon, color }) {
    return (
      <div className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-xl p-5 shadow-sm transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-800 h-[130px] flex flex-col justify-between font-sans">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {title}
          </span>
          <div
            className={`p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border  dark:border-zinc-850/60 ${color}`}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between mt-auto">
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            {value}
          </span>
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend === "up"
                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-100 border border-emerald-200/50 dark:border-emerald-900/30"
                : "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/30"
            }`}
          >
            {trend === "up" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {change}
          </span>
        </div>
      </div>
    );
  },
);

export default StatCardWidget;
