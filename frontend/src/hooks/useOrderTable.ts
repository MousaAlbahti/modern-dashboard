"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import {
  getOrders,
  deleteOrder,
  updateOrderStatus,
  PaginatedOrders,
} from "@/services/dashboardService";
import { Order } from "@/types";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { pb } from "@/lib/pocketbase";
import { toast } from "sonner";
import { toastConfigs } from "@/lib/notifications";

export function useOrderTable() {
  // 1. Hook into Next.js search parameters for pagination and filtering
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const pageQuery = Number(searchParams.get("page")) || 1;
  const queryKey = ["orders", searchQuery, pageQuery];

  // 2. Define local states for UI interactions
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 3. Fetch orders via TanStack Query
  const {
    data: ordersData,
    error,
    isPending,
    isFetching,
    refetch,
  } = useQuery<PaginatedOrders, Error>({
    queryKey,
    queryFn: () => getOrders(searchQuery, pageQuery, 10),
  });

  // 4. Bind to PocketBase live SSE stream for real-time updates
  useRealtimeSubscription("orders", ["orders"]);

  // 5. Action Handlers for modal, deletion, and status change
  const handleAddClick = () => {
    setSelectedOrder(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    setDeletingId(id);
    const promise = pb.collection("orders").delete(id);
    toast.promise(promise, toastConfigs.order.delete);
    try {
      await promise;
      refetch();
    } catch (err) {
      console.error("[Delete Order Error]:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (id: string, status: "pending" | "shipped" | "delivered") => {
    const promise = pb.collection("orders").update(id, { status });
    toast.promise(promise, toastConfigs.order.update);
    try {
      await promise;
      refetch();
    } catch (err) {
      console.error("[Update Order Status Error]:", err);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Return all required properties and functions to the presentation component
  return {
    ordersData,
    error,
    isPending,
    isFetching,
    refetch,
    isModalOpen,
    selectedOrder,
    deletingId,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleStatusChange,
    handleModalClose,
  };
}
