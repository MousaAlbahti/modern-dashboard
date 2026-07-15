import React, { Suspense } from "react";
import TagTable from "./_component/TagTable";
import TableSkeleton from "@/components/ui/TableSkeleton";

export default function TagsPage() {
  return (
    <Suspense fallback={<TableSkeleton columnsCount={2} rowsCount={5} />}>
      <TagTable />
    </Suspense>
  );
}
