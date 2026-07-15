"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { Table, Column } from "@/components/ui/Table";
import { SearchInput } from "@/components/ui/SearchInput";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { PageHeader } from "@/components/ui/PageHeader";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { EmptyState, ErrorState } from "@/components/ui/FeedbackStates";

interface TablePageLayoutProps<T> {
  title: string;
  count: number;
  isFetching: boolean;
  isPending: boolean;
  error: Error | null;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDesc: string;
  searchPlaceholder: string;
  addLabel: string;
  onRefresh: () => void;
  onAddClick: () => void;
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  totalPages: number;
  currentPage: number;
}

export function TablePageLayout<T>({
  title,
  count,
  isFetching,
  isPending,
  error,
  emptyIcon,
  emptyTitle,
  emptyDesc,
  searchPlaceholder,
  addLabel,
  onRefresh,
  onAddClick,
  data,
  columns,
  keyExtractor,
  totalPages,
  currentPage,
}: TablePageLayoutProps<T>) {
  return (
    <div className="flex flex-col flex-1 h-full w-full overflow-hidden p-1 sm:p-2 font-sans">
      <PageHeader
        title={title}
        count={count}
        isRefreshing={isFetching}
        onRefresh={onRefresh}
        onAddClick={onAddClick}
        addLabel={addLabel}
        search={<SearchInput placeholder={searchPlaceholder} />}
      />

      {isPending ? (
        <div className="flex-1 overflow-y-auto pr-1">
          <TableSkeleton columnsCount={columns.length} rowsCount={5} />
        </div>
      ) : error ? (
        <div className="flex-1 overflow-y-auto pr-1">
          <ErrorState error={error} onRetry={onRefresh} />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="flex-1 overflow-y-auto pr-1">
          <EmptyState
            title={emptyTitle}
            description={emptyDesc}
            icon={emptyIcon}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-1 pb-4">
            <Table
              data={data}
              columns={columns}
              keyExtractor={keyExtractor}
            />
          </div>
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/20 mt-auto shrink-0">
            <PaginationControls
              totalPages={totalPages}
              currentPage={currentPage}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TablePageLayout;
