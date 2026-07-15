"use client";

import React, { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { pb } from "@/lib/pocketbase";
import { Product } from "@/types";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { AlertTriangle, Package, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const LowStockAlertsWidgetInner: React.FC = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["low-stock-products"],
    queryFn: async () => {
      const res = await pb.collection("products").getFullList<Product>({
        filter: "stock < 10",
        sort: "stock",
        requestKey: "low-stock-widget",
      });
      return res;
    },
  });

  useRealtimeSubscription("products", ["low-stock-products"]);

  return (
    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col h-full min-h-[380px] font-sans">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800/80 mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
            Low Stock Alerts
          </h2>
        </div>
        <Link
          href="/products"
          className="text-xs font-semibold text-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer"
        >
          Manage Stock
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center overflow-y-auto pr-1">
        {isPending ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
          </div>
        ) : error ? (
          <div className="text-center text-xs text-rose-500 font-medium py-8">
            Failed to load stock alerts.
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-center text-xs text-emerald-500 font-semibold py-8">
            ✓ All products have safe stock levels
          </div>
        ) : (
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-0.5 min-h-0">
            {data.slice(0, 5).map((product) => {
              const imageUrl =
                product.images && product.images.length > 0
                  ? pb.files.getURL(product, product.images[0], {
                      thumb: "80x80",
                    })
                  : null;

              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-950/20 hover:bg-zinc-50 dark:hover:bg-zinc-950/40 transition-colors duration-200"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-9 w-9 shrink-0 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center select-none">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <Package className="h-4.5 w-4.5 text-zinc-400 dark:text-zinc-650" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate">
                      {product.name}
                    </span>
                  </div>
                  <Badge variant="warning" className="shrink-0 flex items-center gap-1">
                    <span>{product.stock} left</span>
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export const LowStockAlertsWidget = memo(LowStockAlertsWidgetInner);
export default LowStockAlertsWidget;
