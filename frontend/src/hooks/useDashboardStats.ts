"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders, fetchUsers } from "@/services/dashboardService";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

const calculateGrowth = (current: number, previous: number): number => {
  if (previous > 0) return ((current - previous) / previous) * 100;
  return current > 0 ? 100 : 0;
};

const formatChange = (value: number) =>
  `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;

export function useDashboardStats() {
  const { data: orders, isPending: ordersPending } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const { data: users, isPending: usersPending } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Bind to real-time database updates for live stats recalculation
  useRealtimeSubscription("orders", ["orders"]);
  useRealtimeSubscription("users", ["users"]);

  const isPending = ordersPending || usersPending;

  const statsData = useMemo(() => {
    const safeOrders = orders || [];
    const safeUsers = users || [];

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // 1. Total Revenue
    const totalRevenueVal = safeOrders.reduce((sum, o) => sum + o.total_price, 0);
    const formattedRevenue = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(totalRevenueVal);

    // 2. New Customers
    const totalCustomers = safeUsers.length;

    // 3. Active Accounts
    const activeUserIds = new Set(safeOrders.map((o) => o.user));
    const activeAccountsCount = activeUserIds.size;

    // Period slices
    const currentPeriodOrders = safeOrders.filter(
      (o) => new Date(o.created) >= thirtyDaysAgo
    );
    const previousPeriodOrders = safeOrders.filter((o) => {
      const d = new Date(o.created);
      return d >= sixtyDaysAgo && d < thirtyDaysAgo;
    });

    const currentRevenue = currentPeriodOrders.reduce((sum, o) => sum + o.total_price, 0);
    const previousRevenue = previousPeriodOrders.reduce((sum, o) => sum + o.total_price, 0);
    const revenueGrowthPercent = calculateGrowth(currentRevenue, previousRevenue);

    const currentPeriodUsers = safeUsers.filter(
      (u) => new Date(u.created) >= thirtyDaysAgo
    ).length;
    const previousPeriodUsers = safeUsers.filter((u) => {
      const d = new Date(u.created);
      return d >= sixtyDaysAgo && d < thirtyDaysAgo;
    }).length;
    const customerGrowthPercent = calculateGrowth(currentPeriodUsers, previousPeriodUsers);

    const currentPeriodActive = new Set(currentPeriodOrders.map((o) => o.user)).size;
    const previousPeriodActive = new Set(previousPeriodOrders.map((o) => o.user)).size;
    const activeGrowthPercent = calculateGrowth(currentPeriodActive, previousPeriodActive);

    // Growth rate
    const growthRatePercent = totalCustomers > 0 ? (activeAccountsCount / totalCustomers) * 100 : 0;
    const prevPeriodGrowthRate =
      previousPeriodUsers > 0 ? (previousPeriodActive / previousPeriodUsers) * 100 : 0;
    const overallGrowthChangePercent = calculateGrowth(growthRatePercent, prevPeriodGrowthRate);

    return {
      revenue: {
        value: formattedRevenue,
        change: formatChange(revenueGrowthPercent),
        trend: (revenueGrowthPercent >= 0 ? "up" : "down") as "up" | "down",
      },
      customers: {
        value: new Intl.NumberFormat("en-US").format(totalCustomers),
        change: formatChange(customerGrowthPercent),
        trend: (customerGrowthPercent >= 0 ? "up" : "down") as "up" | "down",
      },
      active: {
        value: new Intl.NumberFormat("en-US").format(activeAccountsCount),
        change: formatChange(activeGrowthPercent),
        trend: (activeGrowthPercent >= 0 ? "up" : "down") as "up" | "down",
      },
      growth: {
        value: `${growthRatePercent.toFixed(1)}%`,
        change: formatChange(overallGrowthChangePercent),
        trend: (overallGrowthChangePercent >= 0 ? "up" : "down") as "up" | "down",
      },
    };
  }, [orders, users]);

  return { isPending, statsData };
}
