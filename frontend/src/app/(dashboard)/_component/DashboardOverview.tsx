"use client";

import React from "react";
import RecentOrdersWidget from "./RecentOrdersWidget";
import LowStockAlertsWidget from "./LowStockAlertsWidget";
import StatCardWidget from "./StatCardWidget";
import DashboardCustomizer from "./DashboardCustomizer";
import ServerStatusWidget from "./ServerStatusWidget";
import { useDashboardLayout } from "@/hooks/useDashboardLayout";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  DollarSign,
  Users as UsersIcon,
  Activity,
  TrendingUp,
  Loader2,
} from "lucide-react";

/* ─── Stat card config ────────────────────────────────────────── */
const STAT_META: Record<
  string,
  {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    key: "revenue" | "customers" | "active" | "growth";
  }
> = {
  "total-revenue": {
    title: "Total Revenue",
    icon: DollarSign,
    color: "text-emerald-500",
    key: "revenue",
  },
  "new-customers": {
    title: "New Customers",
    icon: UsersIcon,
    color: "text-blue-500",
    key: "customers",
  },
  "active-accounts": {
    title: "Active Accounts",
    icon: Activity,
    color: "text-indigo-500",
    key: "active",
  },
  "growth-rate": {
    title: "Growth Rate",
    icon: TrendingUp,
    color: "text-amber-500",
    key: "growth",
  },
};

/* ─── Component ───────────────────────────────────────────────── */
export const DashboardOverview: React.FC = () => {
  const { isMounted, statsWidgets, largeWidgets, toggleVisibility, onDragEnd } =
    useDashboardLayout();
  const { statsData } = useDashboardStats();

  const visibleStats = React.useMemo(
    () => statsWidgets.filter((w) => w.visible),
    [statsWidgets]
  );
  const visibleLarge = React.useMemo(
    () => largeWidgets.filter((w) => w.visible),
    [largeWidgets]
  );

  /* ── Pre-mount skeleton (hydration guard) ─────────────────── */
  if (!isMounted) {
    return (
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto overflow-x-hidden pr-1 h-full">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Dashboard Overview
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Monitor your e-commerce operations and performance trends.
          </p>
        </div>
        <div className="flex-1 flex flex-col gap-6 min-h-0">
          <div className="flex flex-col sm:flex-row gap-6 w-full shrink-0">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-1 min-w-0 bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-xl p-5 h-[130px] flex items-center justify-center animate-pulse"
              >
                <Loader2 className="h-5 w-5 animate-spin text-zinc-300 dark:text-zinc-700" />
              </div>
            ))}
          </div>
          <div className="flex flex-col lg:flex-row gap-6 w-full flex-1 min-h-[380px]">
            <div className="lg:flex-[2] flex-1 min-w-0 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl h-full animate-pulse" />
            <div className="lg:flex-[1] flex-1 min-w-0 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl h-full animate-pulse" />
            <div className="lg:flex-[1] flex-1 min-w-0 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl h-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Widget renderers ─────────────────────────────────────── */
  const renderStat = (id: string) => {
    const meta = STAT_META[id];
    if (!meta) return null;
    const data = statsData[meta.key];
    return (
      <StatCardWidget
        title={meta.title}
        value={data.value}
        change={data.change}
        trend={data.trend}
        icon={meta.icon}
        color={meta.color}
      />
    );
  };

  const renderLarge = (id: string) => {
    if (id === "recent-orders") return <RecentOrdersWidget />;
    if (id === "low-stock-alerts") return <LowStockAlertsWidget />;
    if (id === "server-status") return <ServerStatusWidget />;
    return null;
  };

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-y-auto overflow-x-hidden pr-1 h-full">
      {/* Header + widget visibility panel */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Dashboard Overview
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Monitor your e-commerce operations and performance trends.
          </p>
        </div>

        <DashboardCustomizer
          statsWidgets={statsWidgets}
          largeWidgets={largeWidgets}
          toggleVisibility={toggleVisibility}
        />
      </div>

      {/* ── Drag-and-drop grid ─────────────────────────────────── */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex flex-col gap-6 pb-6 min-h-0">

          {/* Stats row */}
          <Droppable droppableId="stats-row" direction="horizontal" type="STATS">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col sm:flex-row gap-6 w-full"
                style={{ minHeight: 130 }}
              >
                {visibleStats.length === 0 ? (
                  <div className="flex-1 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-6 text-center text-xs font-semibold text-zinc-400">
                    All stat cards are hidden.
                  </div>
                ) : (
                  visibleStats.map((widget, index) => (
                    <Draggable key={widget.id} draggableId={widget.id} index={index}>
                      {(drag) => (
                        <div
                          ref={drag.innerRef}
                          {...drag.draggableProps}
                          {...drag.dragHandleProps}
                          className="flex-1 min-w-0 focus:outline-none"
                          style={drag.draggableProps.style}
                        >
                          {renderStat(widget.id)}
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {/* Normal placeholder — DND needs this to calculate drop positions correctly */}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Large widgets row */}
          <Droppable droppableId="large-row" direction="horizontal" type="LARGE">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex-1 flex flex-col lg:flex-row gap-6 w-full min-h-[380px]"
                style={{ minHeight: 380 }}
              >
                {visibleLarge.length === 0 ? (
                  <div className="flex-1 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center text-sm font-semibold text-zinc-400">
                    All widgets are hidden.
                  </div>
                ) : (
                  visibleLarge.map((widget, index) => {
                    const isOrders = widget.id === "recent-orders";
                    const flexCls =
                      visibleLarge.length === 1
                        ? "flex-1"
                        : isOrders
                        ? "lg:flex-[2] flex-1"
                        : "lg:flex-[1] flex-1";

                    return (
                      <Draggable key={widget.id} draggableId={widget.id} index={index}>
                        {(drag) => (
                          <div
                            ref={drag.innerRef}
                            {...drag.draggableProps}
                            {...drag.dragHandleProps}
                            className={`${flexCls} min-w-0 focus:outline-none h-full`}
                            style={drag.draggableProps.style}
                          >
                            {renderLarge(widget.id)}
                          </div>
                        )}
                      </Draggable>
                    );
                  })
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

        </div>
      </DragDropContext>
    </div>
  );
};

export default DashboardOverview;
