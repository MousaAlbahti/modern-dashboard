"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  totalPages: number;
  currentPage: number;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  totalPages,
  currentPage,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1; // number of neighbor pages to show around active page

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2 py-4 border-t border-zinc-200 dark:border-zinc-800">
      <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="xs"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          icon={<ChevronLeft className="h-3.5 w-3.5" />}
          className="cursor-pointer font-semibold"
        >
          Prev
        </Button>

        {getPageNumbers().map((page, idx) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-1.5 text-zinc-400 dark:text-zinc-500 text-xs font-semibold select-none"
              >
                ...
              </span>
            );
          }
          const isCurrent = page === currentPage;
          return (
            <Button
              key={`page-${page}`}
              variant={isCurrent ? "default" : "outline"}
              size="xs"
              onClick={() => handlePageChange(page as number)}
              className="cursor-pointer font-semibold min-w-8"
            >
              {page}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="xs"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          icon={<ChevronRight className="h-3.5 w-3.5" />}
          className="cursor-pointer font-semibold"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;
