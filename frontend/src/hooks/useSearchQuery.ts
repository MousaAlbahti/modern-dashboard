"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export function useSearchQuery(key: string = "search", delay: number = 300) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [value, setValue] = useState<string>(() => {
    return searchParams.get(key) || "";
  });

  // Keep state in sync with external search param modifications
  useEffect(() => {
    setValue(searchParams.get(key) || "");
  }, [searchParams, key]);

  // Handle URL sync with debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      const currentParam = searchParams.get(key) || "";
      if (value === currentParam) {
        return;
      }

      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        const trimmed = value.trim();
        if (trimmed !== "") {
          params.set(key, trimmed);
        } else {
          params.delete(key);
        }

        // Reset pagination page on search value change
        params.delete("page");

        const newQueryString = params.toString();
        const path =
          newQueryString !== "" ? `${pathname}?${newQueryString}` : pathname;
        router.replace(path);
      });
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, key, delay, pathname, router, searchParams]);

  return {
    value,
    setValue,
    isPending,
  };
}

export default useSearchQuery;
