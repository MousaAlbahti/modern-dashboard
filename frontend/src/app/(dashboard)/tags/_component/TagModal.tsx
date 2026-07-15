"use client";

import React from "react";
import { Tag } from "@/types";

// Import core Tailwind v4 / Base UI styled primitives
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { useTagForm } from "./useTagForm";

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tag: Tag | null;
}

export const TagModal = ({
  isOpen,
  onClose,
  onSuccess,
  tag,
}: TagModalProps) => {
  // Delegate form states and validation handlers to useTagForm hook
  const { form, isEditMode, onSubmit } = useTagForm({
    isOpen,
    onClose,
    onSuccess,
    tag,
  });

  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Tag Name" : "Add New Tag"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-2">
          {/* Tag Name Input Field */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Tag Name
            </Label>
            <Input
              type="text"
              {...register("name")}
              placeholder="e.g. Premium"
            />
            {errors.name && (
              <span className="text-xs text-rose-500 font-medium mt-1">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Submit Actions */}
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              {isEditMode ? "Save Changes" : "Create Tag"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TagModal;
