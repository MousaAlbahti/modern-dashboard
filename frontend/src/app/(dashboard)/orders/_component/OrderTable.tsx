"use client";

import React from "react";
import { ClipboardList } from "lucide-react";
import { Order } from "@/types";

// Import Shared UI Layout Elements
import { Column } from "@/components/ui/Table";
import { TablePageLayout } from "@/components/ui/TablePageLayout";

// Import Shared Table Row Cells
import {
  TextWithSubtitleCell,
  CurrencyCell,
  BadgeCell,
  DateCell,
  RowActionsCell,
} from "@/components/ui/TableCells";

import OrderModal from "./OrderModal";
import { useOrderTable } from "@/hooks/useOrderTable";

export const OrderTable: React.FC = () => {
  // Bind presentation states and properties directly from the centralized hook
  const {
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
    handleModalClose,
  } = useOrderTable();

  // Columns definition using pre-defined table cells mapping
  const columns: Column<Order>[] = [
    {
      header: "Order ID",
      render: (order: Order) => (
        <TextWithSubtitleCell
          title={`Order #${order.id.slice(0, 8).toUpperCase()}`}
          subtitle={`${order.products?.length || 0} product${order.products?.length === 1 ? "" : "s"}`}
        />
      ),
    },
    {
      header: "Customer",
      render: (order: Order) => (
        <TextWithSubtitleCell
          title={order.expand?.user?.name || "Anonymous Customer"}
          subtitle={order.expand?.user?.email || `ID: ${order.user}`}
        />
      ),
    },
    {
      header: "Total Price",
      render: (order: Order) => <CurrencyCell value={order.total_price} />,
      className: "text-sm font-semibold text-zinc-900 dark:text-zinc-100",
    },
    {
      header: "Status",
      render: (order: Order) => {
        let badgeType: "success" | "warning" | "neutral" = "neutral";
        let statusLabel = "Shipped";

        if (order.status === "delivered") {
          badgeType = "success";
          statusLabel = "Delivered";
        } else if (order.status === "pending") {
          badgeType = "warning";
          statusLabel = "Pending";
        }

        return <BadgeCell value="" type={badgeType} label={statusLabel} />;
      },
    },
    {
      header: "Created",
      render: (order: Order) => <DateCell isoString={order.created} />,
      className: "text-xs text-zinc-500 dark:text-zinc-400 font-medium",
    },
    {
      header: "Actions",
      className: "text-right",
      render: (order: Order) => (
        <RowActionsCell
          item={order}
          onEdit={handleEditClick}
          onDelete={() => handleDeleteClick(order.id)}
          isDeleting={deletingId === order.id}
        />
      ),
    },
  ];

  return (
    <>
      <TablePageLayout
        title="Orders Manager"
        count={ordersData?.totalItems || 0}
        isFetching={isFetching}
        isPending={isPending}
        error={error}
        emptyIcon={ClipboardList}
        emptyTitle="No Orders Found"
        emptyDesc="No orders have been recorded. Try adding a new order to get started."
        searchPlaceholder="Search orders by ID, customer name, or email..."
        addLabel="Add Order"
        onRefresh={refetch}
        onAddClick={handleAddClick}
        data={ordersData?.items || []}
        columns={columns}
        keyExtractor={(order) => order.id}
        totalPages={ordersData?.totalPages || 0}
        currentPage={ordersData?.page || 1}
      />

      <OrderModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={refetch}
        order={selectedOrder}
      />
    </>
  );
};

export default OrderTable;
