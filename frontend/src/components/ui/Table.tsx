import React from "react";

export interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  SkeletonComponent?: React.ComponentType;
  EmptyStateComponent?: React.ComponentType;
  rowClassName?: (item: T) => string;
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  SkeletonComponent,
  EmptyStateComponent,
  rowClassName,
}: TableProps<T>) {
  if (isLoading && SkeletonComponent) {
    return <SkeletonComponent />;
  }

  if (!data || data.length === 0) {
    if (EmptyStateComponent) {
      return <EmptyStateComponent />;
    }
    return null;
  }

  return (
    <div className="w-full border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950/40 shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left min-w-[650px]">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider select-none">
              {columns.map((column, idx) => (
                <th key={idx} className={`px-6 py-4 ${column.className || ""}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {data.map((item) => {
              const key = keyExtractor(item);

              return (
                <tr
                  key={key}
                  className={`
                    transition-colors duration-200
                    hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20
                    ${rowClassName ? rowClassName(item) : ""}
                  `}
                >
                  {columns.map((column, idx) => (
                    <td
                      key={idx}
                      className={`px-6 py-4 ${column.className || ""}`}
                    >
                      {column.render(item)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
