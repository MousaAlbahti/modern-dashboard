import React from "react";
import { Button } from "@/components/ui/Button";
import { RefreshCw, Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  count: number;
  countLabel?: string;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onAddClick?: () => void;
  addLabel?: string;
  search?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  count,
  countLabel = "item",
  isRefreshing = false,
  onRefresh,
  onAddClick,
  addLabel = "Add New",
  search,
}) => {
  const hasActions = !!(onRefresh || onAddClick || search);

  return (
    <div className="flex flex-col gap-6 mb-6 font-sans">
      {/* Title & Counter Metadata */}
      <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>
        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
          {count} {count === 1 ? countLabel : `${countLabel}s`}
        </span>
      </div>

      {/* Global Control Actions & Search Row */}
      {hasActions && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 max-w-md">
            {search}
          </div>

          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                isLoading={isRefreshing}
                onClick={onRefresh}
                icon={
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                }
              >
                Refresh
              </Button>
            )}
            {onAddClick && (
              <Button
                variant="default"
                size="sm"
                onClick={onAddClick}
                icon={<Plus className="h-4 w-4" />}
              >
                {addLabel}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PageHeader;
