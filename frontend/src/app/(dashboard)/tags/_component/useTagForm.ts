"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tag } from "@/types";
import { createTag, updateTag } from "@/services/tagService";
import { toast } from "sonner";
import { toastConfigs } from "@/lib/notifications";

export const tagSchema = z.object({
  name: z.string().min(4, "Tag name must be at least 4 characters"),
});

export type TagFormValues = z.infer<typeof tagSchema>;

interface UseTagFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tag: Tag | null;
}

export const useTagForm = ({
  isOpen,
  onClose,
  onSuccess,
  tag,
}: UseTagFormProps) => {
  const isEditMode = !!tag;

  // Initialize form state
  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
    },
  });

  const { reset, handleSubmit } = form;

  // Sync form values on modal state changes
  useEffect(() => {
    if (isOpen) {
      if (tag) {
        reset({
          name: tag.name || "",
        });
      } else {
        reset({
          name: "",
        });
      }
    }
  }, [tag, isOpen, reset]);

  // Submit handler calling our database tag service
  const onSubmit = async (data: TagFormValues) => {
    const promise =
      isEditMode && tag ? updateTag(tag.id, data.name) : createTag(data.name);

    toast.promise(
      promise,
      isEditMode ? toastConfigs.tag.update : toastConfigs.tag.create,
    );

    await promise;
    onSuccess();
    onClose();
  };

  return {
    form,
    isEditMode,
    onSubmit: handleSubmit(onSubmit),
  };
};
