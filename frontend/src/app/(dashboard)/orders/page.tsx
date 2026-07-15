import React, { Suspense } from "react";
import OrderTable from "./_component/OrderTable";
import TableSkeleton from "@/components/ui/TableSkeleton";

export default function OrdersPage() {
  return (
    <Suspense fallback={<TableSkeleton columnsCount={6} rowsCount={5} />}>
      <OrderTable />
    </Suspense>
  );
}
