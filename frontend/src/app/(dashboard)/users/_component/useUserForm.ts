"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User } from "@/types";
import { pb } from "@/lib/pocketbase";
import { toast } from "sonner";
import { toastConfigs } from "@/lib/notifications";

export const userSchema = z
  .object({
    name: z.string().min(5, "Name must be at least 5 characters"),
    email: z.string().email("Invalid email format"),
    verified: z.boolean(),
    avatar: z.instanceof(File).nullable().optional(),
    changePassword: z.boolean().optional(),
    password: z.string().optional(),
    passwordConfirm: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.changePassword) {
      if (!data.password || data.password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must be at least 8 characters",
          path: ["password"],
        });
      }
      if (!data.passwordConfirm) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Confirm password is required",
          path: ["passwordConfirm"],
        });
      } else if (data.password !== data.passwordConfirm) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match",
          path: ["passwordConfirm"],
        });
      }
    }
  });

export type UserFormValues = z.infer<typeof userSchema>;

interface UseUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

export const useUserForm = ({
  isOpen,
  onClose,
  onSuccess,
  user,
}: UseUserFormProps) => {
  const isEditMode = !!user;
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Initialize form state and resolver bindings
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      verified: false,
      avatar: null,
      changePassword: false,
      password: "",
      passwordConfirm: "",
    },
  });

  const { reset, watch, setValue, handleSubmit } = form;
  const watchedAvatar = watch("avatar");

  // Sync form values with active user on change or open
  useEffect(() => {
    if (isOpen) {
      if (user) {
        reset({
          name: user.name || "",
          email: user.email || "",
          verified: !!user.verified,
          avatar: null,
          changePassword: false,
          password: "",
          passwordConfirm: "",
        });
      } else {
        reset({
          name: "",
          email: "",
          verified: false,
          avatar: null,
          changePassword: true,
          password: "",
          passwordConfirm: "",
        });
      }
    }
  }, [user, isOpen, reset]);

  // Handle browser blob URL generation for immediate avatar previews
  useEffect(() => {
    if (watchedAvatar) {
      const url = URL.createObjectURL(watchedAvatar);
      setAvatarPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setAvatarPreview(null);
    }
  }, [watchedAvatar]);

  // Execute database mutations directly on PocketBase
  const onSubmit = async (data: UserFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (!isEditMode || (user && user.email !== data.email)) {
      formData.append("email", data.email);
    }
    formData.append("verified", data.verified.toString());

    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }

    if (data.changePassword && data.password) {
      formData.append("password", data.password);
      formData.append("passwordConfirm", data.passwordConfirm || "");
    }

    if (!isEditMode) {
      // Enable email visibility for created records
      formData.append("emailVisibility", "true");
    }

    const promise =
      isEditMode && user
        ? pb.collection("users").update(user.id, formData)
        : pb.collection("users").create(formData);

    toast.promise(
      promise,
      isEditMode ? toastConfigs.user.update : toastConfigs.user.create,
    );

    await promise;
    onSuccess();
    onClose();
  };

  return {
    form,
    avatarPreview,
    isEditMode,
    onSubmit: handleSubmit(onSubmit),
    setValue,
  };
};
