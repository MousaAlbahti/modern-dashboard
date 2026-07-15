"use client";

import React from "react";
import { LayoutGrid, Eye, EyeOff } from "lucide-react";
import { WidgetConfig } from "@/hooks/useDashboardLayout";

interface DashboardCustomizerProps {
  statsWidgets: WidgetConfig[];
  largeWidgets: WidgetConfig[];
  toggleVisibility: (id: string) => void;
}

const STAT_LABELS: Record<string, string> = {
  "total-revenue": "Revenue",
  "new-customers": "Customers",
  "active-accounts": "Active",
  "growth-rate": "Growth",
};

const LARGE_LABELS: Record<string, string> = {
  "recent-orders": "Recent Orders",
  "low-stock-alerts": "Low Stock",
  "server-status": "Server Status",
};

export const DashboardCustomizer: React.FC<DashboardCustomizerProps> = ({
  statsWidgets,
  largeWidgets,
  toggleVisibility,
}) => {
  const [showToggles, setShowToggles] = React.useState(false);

  return (
    <div className="flex items-center gap-2 self-start xl:self-center">
      <button
        onClick={() => setShowToggles(!showToggles)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 cursor-pointer text-xs font-semibold select-none shadow-xs hover:scale-[1.02] active:scale-[0.98] ${
          showToggles
            ? "bg-brand-primary/10 text-brand-primary border-brand-primary/20"
            : "bg-white dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-850 text-zinc-550 dark:text-zinc-400 hover:bg-zinc-550/5 dark:hover:bg-zinc-900/60"
        }`}
        title="Customize active widgets"
      >
        <LayoutGrid className="h-3.5 w-3.5 shrink-0" />
        <span>Customize Widgets</span>
      </button>

      <div
        className={`overflow-hidden flex items-center transition-all duration-300 ease-in-out border rounded-xl shadow-xs bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800/80 ${
          showToggles
            ? "max-w-[800px] opacity-100 px-3 py-1.5 translate-x-0"
            : "max-w-0 opacity-0 px-0 py-1.5 translate-x-4 pointer-events-none border-transparent"
        }`}
      >
        <div className="flex items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-zinc-650 dark:text-zinc-400 whitespace-nowrap">
          {statsWidgets.map((w) => (
            <button
              key={w.id}
              onClick={() => toggleVisibility(w.id)}
              className={`flex items-center gap-1.5 py-0.5 px-2 rounded-lg transition-all duration-200 cursor-pointer select-none ${
                w.visible
                  ? "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/15 font-semibold"
                  : "text-zinc-400 hover:text-zinc-550 hover:bg-zinc-150 dark:hover:text-zinc-300 dark:hover:bg-zinc-800/40"
              }`}
            >
              {w.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              <span>{STAT_LABELS[w.id]}</span>
            </button>
          ))}
          <div className="h-3 w-px bg-zinc-200 dark:bg-zinc-800/60" />
          {largeWidgets.map((w) => (
            <button
              key={w.id}
              onClick={() => toggleVisibility(w.id)}
              className={`flex items-center gap-1.5 py-0.5 px-2 rounded-lg transition-all duration-200 cursor-pointer select-none ${
                w.visible
                  ? "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/15 font-semibold"
                  : "text-zinc-400 hover:text-zinc-550 hover:bg-zinc-150 dark:hover:text-zinc-300 dark:hover:bg-zinc-800/40"
              }`}
            >
              {w.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              <span>{LARGE_LABELS[w.id]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardCustomizer;
