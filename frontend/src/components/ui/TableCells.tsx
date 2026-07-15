"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Package,
  ImagePlus,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

interface BadgeCellProps {
  value: string | number;
  type: "success" | "warning" | "neutral";
  label?: string;
}

interface EditableAvatarCellProps {
  imageUrl: string | null;
  isUploading: boolean;
  onFileSelect: (file: File) => void;
}

export const TextWithSubtitleCell = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <div className="flex flex-col">
    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
      {title}
    </span>
    {subtitle && (
      <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1 max-w-xs">
        {subtitle}
      </span>
    )}
  </div>
);

export const CurrencyCell = ({ value }: { value: number }) => {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
  return (
    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
      {formatted}
    </span>
  );
};

export const BadgeCell = ({ value, type, label }: BadgeCellProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
        {value}
      </span>
      {label && (
        <Badge variant={type}>
          {type === "success" && <CheckCircle2 className="h-2.5 w-2.5" />}
          {type === "warning" && <AlertTriangle className="h-2.5 w-2.5" />}
          <span>{label}</span>
        </Badge>
      )}
    </div>
  );
};

export const DateCell = ({ isoString }: { isoString: string }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
      {mounted && isoString
        ? new Date(isoString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Loading..."}
    </span>
  );
};

export const TagsCell = ({
  items,
}: {
  items?: { id: string; name: string }[];
}) => (
  <div className="flex flex-wrap gap-1">
    {items && items.length > 0 ? (
      items.map((item) => (
        <Badge key={item.id} variant="neutral">
          {item.name}
        </Badge>
      ))
    ) : (
      <span className="text-xs text-zinc-400 dark:text-zinc-600 italic select-none">
        —
      </span>
    )}
  </div>
);

export const EditableAvatarCell = ({
  imageUrl,
  isUploading,
  onFileSelect,
}: EditableAvatarCellProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      className="group relative h-11 w-11 shrink-0 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center cursor-pointer select-none"
    >
      {isUploading ? (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
          <Loader2 className="h-4 w-4 text-white animate-spin" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10">
          <ImagePlus className="h-4 w-4 text-white" />
        </div>
      )}

      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Avatar"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <Package className="h-5 w-5 text-zinc-400 dark:text-zinc-600" />
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};

export const confirmDelete = (onConfirm: () => void) => {
  toast.custom(
    (t) => (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-center w-full max-w-xs animate-scale-in">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
            Confirm Deletion
          </h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Are you sure you want to delete this item? This action is permanent.
          </p>
        </div>
        <div className="flex items-center gap-3 justify-center">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-3.5 py-1.5 rounded-lg text-[11px] font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-750 text-zinc-900 text-zinc-900 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t);
              onConfirm();
            }}
            className="px-3.5 py-1.5 rounded-lg text-[11px] font-semibold bg-red-600 hover:bg-red-750 text-white cursor-pointer transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    ),
    {
      position: "top-center",
      duration: Infinity,
    },
  );
};

export function RowActionsCell<T extends { id: string }>({
  item,
  onEdit,
  onDelete,
  isDeleting = false,
}: {
  item: T;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(item);
        }}
        size="xs"
        variant="secondary"
        className="cursor-pointer"
      >
        Edit
      </Button>
      <Button
        disabled={isDeleting}
        isLoading={isDeleting}
        onClick={(e) => {
          e.stopPropagation();
          confirmDelete(() => onDelete(item.id));
        }}
        size="xs"
        variant="destructive"
        className="cursor-pointer"
      >
        Delete
      </Button>
    </div>
  );
}
