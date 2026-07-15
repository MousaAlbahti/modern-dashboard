import React from "react";
import { AlertCircle, RefreshCcw, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

/* Generic Fallback Empty View Component */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
}) => (
  <div className="flex flex-col items-center justify-center p-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950/40 text-center shadow-sm font-sans">
    <div className="h-12 w-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-600 mb-4">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
      {title}
    </h3>
    <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
      {description}
    </p>
  </div>
);

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}

/* Generic Connection/Fetch Error Boundary View */
export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-12 border border-rose-100 dark:border-rose-950/40 rounded-xl bg-rose-50/50 dark:bg-rose-950/10 text-center shadow-sm max-w-2xl mx-auto font-sans">
    <div className="h-12 w-12 rounded-xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
      <AlertCircle className="h-6 w-6" />
    </div>
    <h3 className="text-base font-semibold text-rose-900 dark:text-rose-200 mb-2">
      Connection Failure
    </h3>
    <p className="text-sm text-rose-700/80 dark:text-rose-300/80 mb-4 max-w-md">
      We encountered an error connecting to the backend database.
    </p>

    {/* Scrollable Error Trace Details */}
    <div className="p-3 bg-rose-100/40 dark:bg-rose-950/30 border border-rose-200/40 dark:border-rose-900/40 rounded-lg text-left text-xs font-mono text-rose-800 dark:text-rose-400 max-w-full overflow-x-auto mb-6 w-full">
      {error.message || "Unknown Connection Error"}
    </div>

    <Button
      variant="outline"
      className="border-rose-200 text-rose-700 hover:bg-rose-100/50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
      onClick={onRetry}
      icon={<RefreshCcw className="h-3.5 w-3.5" />}
    >
      Retry Connection
    </Button>
  </div>
);
