"use client";

import React, { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { pb } from "@/lib/pocketbase";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { Activity, Database, ShoppingBag, Users, Package, Loader2 } from "lucide-react";

interface DBTotals {
  orders: number;
  products: number;
  users: number;
}

const ServerStatusWidgetInner: React.FC = () => {
  // 1. PB Health pulse check with refetch interval of 10s
  const { data: healthData, isPending: isHealthPending } = useQuery({
    queryKey: ["pb-health"],
    queryFn: async () => {
      const startTime = Date.now();
      try {
        await pb.health.check();
        const latency = Date.now() - startTime;
        return { online: true, latency };
      } catch (err) {
        return { online: false, latency: 0 };
      }
    },
    refetchInterval: 10000,
  });

  // 2. Database Totals
  const { data: totals, isPending: isTotalsPending } = useQuery<DBTotals>({
    queryKey: ["db-totals"],
    queryFn: async () => {
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        pb.collection("orders").getList(1, 1, { requestKey: "db-totals-orders" }),
        pb.collection("products").getList(1, 1, { requestKey: "db-totals-products" }),
        pb.collection("users").getList(1, 1, { requestKey: "db-totals-users" }),
      ]);
      return {
        orders: ordersRes.totalItems,
        products: productsRes.totalItems,
        users: usersRes.totalItems,
      };
    },
  });

  // Bind to SSE subscriptions for real-time counts updates
  useRealtimeSubscription("orders", ["db-totals"]);
  useRealtimeSubscription("products", ["db-totals"]);
  useRealtimeSubscription("users", ["db-totals"]);

  const isOnline = healthData?.online ?? false;
  const latency = healthData?.latency ?? 0;

  const getLatencyColor = (ms: number) => {
    if (ms < 50) return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30";
    if (ms < 150) return "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30";
    return "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/30";
  };

  return (
    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col h-full min-h-[380px] font-sans hover:scale-[1.01] transition-transform duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800/80 mb-4">
        <div className="flex items-center gap-2.5">
          <Database className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
            Server Status & DB Pulse
          </h2>
        </div>
        
        {/* Real-time Status indicator */}
        <div className="flex items-center gap-2">
          {isHealthPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative flex h-2.5 w-2.5 items-center justify-center">
                {isOnline ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-primary"></span>
                  </>
                ) : (
                  <>
                    <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  </>
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Info */}
      <div className="flex-1 flex flex-col justify-between gap-4">
        {/* Real-time Live Sync Row */}
        <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
              <Activity className="h-4 w-4 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-300">
                Real-time Live Sync
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                Connected via SSE
              </span>
            </div>
          </div>
          
          <div>
            {isHealthPending ? (
              <span className="text-xs text-zinc-400 animate-pulse">Checking...</span>
            ) : isOnline ? (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${getLatencyColor(latency)}`}>
                {latency}ms
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/30">
                Offline
              </span>
            )}
          </div>
        </div>

        {/* Database Totals Sub-Grid */}
        {isTotalsPending ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 flex-1 py-1">
            {/* Products Total */}
            <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-900/80 rounded-xl py-8 flex flex-col items-center justify-center text-center hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-colors duration-150">
              <Package className="h-5 w-5 text-zinc-400 mb-1.5" />
              <span className="text-2xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">
                {totals?.products ?? 0}
              </span>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1.5">
                Products
              </span>
            </div>

            {/* Orders Total */}
            <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-900/80 rounded-xl py-8 flex flex-col items-center justify-center text-center hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-colors duration-150">
              <ShoppingBag className="h-5 w-5 text-zinc-400 mb-1.5" />
              <span className="text-2xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">
                {totals?.orders ?? 0}
              </span>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1.5">
                Orders
              </span>
            </div>

            {/* Users Total */}
            <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-900/80 rounded-xl py-8 flex flex-col items-center justify-center text-center hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-colors duration-150">
              <Users className="h-5 w-5 text-zinc-400 mb-1.5" />
              <span className="text-2xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">
                {totals?.users ?? 0}
              </span>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1.5">
                Active Users
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ServerStatusWidget = memo(ServerStatusWidgetInner);
export default ServerStatusWidget;
