"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useSearchQuery } from "@/hooks/useSearchQuery";

interface SearchInputProps extends React.ComponentProps<"input"> {
  paramKey?: string;
  delay?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  paramKey = "search",
  delay = 300,
  className,
  value: propValue,
  onChange: propOnChange,
  ...props
}) => {
  const isControlled = propValue !== undefined;
  
  // Call hook unconditionally to satisfy rules of hooks, but we won't use its state if controlled
  const urlSearch = useSearchQuery(paramKey, delay);

  const value = isControlled ? propValue : urlSearch.value;
  const isPending = isControlled ? false : urlSearch.isPending;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isControlled && propOnChange) {
      propOnChange(e);
    } else {
      urlSearch.setValue(e.target.value);
    }
  };

  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-zinc-400 dark:text-zinc-500">
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </div>
      <Input
        value={value}
        onChange={handleChange}
        className="pl-10 pr-4 w-full h-9"
        {...props}
      />
    </div>
  );
};

export default SearchInput;
