import React from "react";

interface TableSkeletonProps {
  columnsCount?: number;
  rowsCount?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columnsCount = 5,
  rowsCount = 5,
}) => {
  return (
    <div className="w-full border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950/40 shadow-sm animate-pulse font-sans">
      <table className="w-full border-collapse text-left">
        {/* Skeleton Header Row */}
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
            {Array.from({ length: columnsCount }).map((_, idx) => (
              <th key={idx} className="px-6 py-4">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-16" />
              </th>
            ))}
          </tr>
        </thead>

        {/* Skeleton Body Rows */}
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {Array.from({ length: rowsCount }).map((_, rIdx) => (
            <tr key={rIdx}>
              {Array.from({ length: columnsCount }).map((_, cIdx) => (
                <td key={cIdx} className="px-6 py-4">
                  <div className="h-4 bg-zinc-150 dark:bg-zinc-900 rounded w-24" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
