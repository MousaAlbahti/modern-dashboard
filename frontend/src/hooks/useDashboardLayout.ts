"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DropResult } from "@hello-pangea/dnd";

export interface WidgetConfig {
  id: string;
  visible: boolean;
}

const DEFAULT_STATS: WidgetConfig[] = [
  { id: "total-revenue", visible: true },
  { id: "new-customers", visible: true },
  { id: "active-accounts", visible: true },
  { id: "growth-rate", visible: true },
];

const DEFAULT_LARGE: WidgetConfig[] = [
  { id: "recent-orders", visible: true },
  { id: "low-stock-alerts", visible: true },
  { id: "server-status", visible: true },
];

const STATS_KEY = "dashboard-stats-layout";
const LARGE_KEY = "dashboard-widget-layout";

/** Merge saved layout with defaults: preserve order, restore visibility, add new items. */
function loadLayout(key: string, defaults: WidgetConfig[]): WidgetConfig[] {
  try {
    let raw = localStorage.getItem(key);
    if (!raw && key === "dashboard-widget-layout") {
      raw = localStorage.getItem("dashboard-large-layout");
    }
    if (!raw) return defaults;
    const saved: WidgetConfig[] = JSON.parse(raw);
    if (!Array.isArray(saved) || saved.length === 0) return defaults;

    // Re-order by saved order, then append any new defaults not in saved
    const ordered: WidgetConfig[] = [];
    for (const s of saved) {
      const def = defaults.find((d) => d.id === s.id);
      if (def) ordered.push({ ...def, visible: s.visible });
    }
    for (const d of defaults) {
      if (!ordered.some((o) => o.id === d.id)) ordered.push(d);
    }
    return ordered;
  } catch {
    return defaults;
  }
}

function reorder<T>(list: T[], from: number, to: number): T[] {
  const result = [...list];
  const [removed] = result.splice(from, 1);
  result.splice(to, 0, removed);
  return result;
}

export function useDashboardLayout() {
  const [isMounted, setIsMounted] = useState(false);
  const [statsLayout, setStatsLayout] = useState<WidgetConfig[]>(DEFAULT_STATS);
  const [largeLayout, setLargeLayout] = useState<WidgetConfig[]>(DEFAULT_LARGE);

  // Keep refs in sync for use inside stable callbacks (avoids stale closure)
  const statsRef = useRef(statsLayout);
  const largeRef = useRef(largeLayout);
  statsRef.current = statsLayout;
  largeRef.current = largeLayout;

  useEffect(() => {
    setStatsLayout(loadLayout(STATS_KEY, DEFAULT_STATS));
    setLargeLayout(loadLayout(LARGE_KEY, DEFAULT_LARGE));
    setIsMounted(true);
  }, []);

  /** Stable reference — safe to pass to DragDropContext without causing re-renders. */
  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (
      source.droppableId === "stats-row" &&
      destination.droppableId === "stats-row"
    ) {
      const next = reorder(statsRef.current, source.index, destination.index);
      setStatsLayout(next);
      localStorage.setItem(STATS_KEY, JSON.stringify(next));
    } else if (
      source.droppableId === "large-row" &&
      destination.droppableId === "large-row"
    ) {
      const next = reorder(largeRef.current, source.index, destination.index);
      setLargeLayout(next);
      localStorage.setItem(LARGE_KEY, JSON.stringify(next));
    }
  }, []); // no deps — reads from refs

  /** Stable reference — uses functional updater so no state dependency needed. */
  const toggleVisibility = useCallback((id: string) => {
    const isStat = DEFAULT_STATS.some((d) => d.id === id);
    if (isStat) {
      setStatsLayout((prev) => {
        const next = prev.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w));
        localStorage.setItem(STATS_KEY, JSON.stringify(next));
        return next;
      });
    } else {
      setLargeLayout((prev) => {
        const next = prev.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w));
        localStorage.setItem(LARGE_KEY, JSON.stringify(next));
        return next;
      });
    }
  }, []); // no deps — uses setState functional updater

  return {
    isMounted,
    statsWidgets: statsLayout,
    largeWidgets: largeLayout,
    toggleVisibility,
    onDragEnd,
  };
}

export default useDashboardLayout;
