"use client";

import React, { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { pb } from "@/lib/pocketbase";
import { Order } from "@/types";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { CurrencyCell, BadgeCell } from "@/components/ui/TableCells";
import { ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";

const getStatusBadge = (status: string) => {
  let badgeType: "success" | "warning" | "neutral" = "neutral";
  let statusLabel = "Shipped";

  if (status === "delivered") {
    badgeType = "success";
    statusLabel = "Delivered";
  } else if (status === "pending") {
    badgeType = "warning";
    statusLabel = "Pending";
  }

  return <BadgeCell value="" type={badgeType} label={statusLabel} />;
};

const RecentOrdersWidgetInner: React.FC = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["recent-orders"],
    queryFn: async () => {
      const res = await pb.collection("orders").getList<Order>(1, 5, {
        sort: "-created",
        expand: "user",
        requestKey: "recent-orders-widget",
      });
      return res.items;
    },
  });

  useRealtimeSubscription("orders", ["recent-orders"]);

  return (
    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col h-full min-h-[380px] font-sans">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800/80 mb-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
            Recent Orders
          </h2>
        </div>
        <Link
          href="/orders"
          className="text-xs font-semibold text-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer"
        >
          View All
        </Link>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {isPending ? (
          <div className="flex items-center justify-center py-8 flex-1">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
          </div>
        ) : error ? (
          <div className="text-center text-xs text-rose-500 font-medium py-8 flex-1 flex items-center justify-center">
            Failed to load recent orders.
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-center text-xs text-zinc-400 dark:text-zinc-600 italic py-8 flex-1 flex items-center justify-center">
            No recent orders.
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto pr-0.5 min-h-0">
            {data.map((order) => {
              const userName = order.expand?.user?.name || "Anonymous User";
              const userEmail = order.expand?.user?.email || "No Email";
              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-950/20 hover:bg-zinc-50 dark:hover:bg-zinc-950/40 transition-colors duration-200"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-9 w-9 shrink-0 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-450 dark:text-zinc-500 select-none">
                      <ShoppingBag className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate">
                        {userName}
                      </span>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                        {userEmail}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <CurrencyCell value={order.total_price} />
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export const RecentOrdersWidget = memo(RecentOrdersWidgetInner);
export default RecentOrdersWidget;
