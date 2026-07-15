"use client";

import React from "react";
import { Upload, User as UserIcon } from "lucide-react";
import { User } from "@/types";
import { pb } from "@/lib/pocketbase";
import { Switch } from "@/components/ui/Switch";

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
import { useUserForm } from "./useUserForm";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

export const UserModal = ({
  isOpen,
  onClose,
  onSuccess,
  user,
}: UserModalProps) => {
  const { form, avatarPreview, isEditMode, onSubmit, setValue } = useUserForm({
    isOpen,
    onClose,
    onSuccess,
    user,
  });

  const {
    register,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const watchedChangePassword = watch("changePassword");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit User Details" : "Add New User"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-2">
          {/* User Name Input Field */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              User Name
            </Label>
            <Input
              type="text"
              {...register("name")}
              placeholder="e.g. Jane Doe"
            />
            {errors.name && (
              <span className="text-xs text-rose-500 font-medium mt-1">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Email Input Field */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Email Address
            </Label>
            <Input
              type="email"
              {...register("email")}
              placeholder="e.g. jane.doe@example.com"
            />
            {errors.email && (
              <span className="text-xs text-rose-500 font-medium mt-1">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Change Password Toggle Switch (Only shown when editing) */}
          {isEditMode && (
            <Switch label="Change Password" {...register("changePassword")} />
          )}

          {/* Password Input Fields */}
          {watchedChangePassword && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Password <span className="text-rose-500 font-bold">*</span>
                </Label>
                <Input
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <span className="text-xs text-rose-500 font-medium mt-1">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Confirm Password{" "}
                  <span className="text-rose-500 font-bold">*</span>
                </Label>
                <Input
                  type="password"
                  {...register("passwordConfirm")}
                  placeholder="••••••••"
                />
                {errors.passwordConfirm && (
                  <span className="text-xs text-rose-500 font-medium mt-1">
                    {errors.passwordConfirm.message}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Verified Toggle Switch */}
          <div className="flex flex-col gap-1.5 py-1">
            <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
              Verification Status
            </Label>
            <Switch
              label="Mark account as Verified"
              error={errors.verified?.message}
              {...register("verified")}
            />
          </div>

          {/* Avatar Image Upload Box */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Avatar Image (Optional)
            </Label>

            <div className="flex items-center gap-4">
              <label className="flex flex-col items-center justify-center h-20 w-full rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 hover:bg-zinc-100 dark:hover:bg-zinc-900/40 transition-colors duration-150 cursor-pointer select-none">
                <div className="flex flex-col items-center justify-center pt-3 pb-3">
                  <Upload className="h-4 w-4 text-zinc-400 dark:text-zinc-500 mb-1" />
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    {avatarPreview ? "Change Avatar" : "Upload Picture"}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setValue("avatar", e.target.files[0], {
                        shouldValidate: true,
                      });
                    }
                  }}
                  className="hidden"
                />
              </label>

              {avatarPreview ? (
                <div className="h-20 w-20 shrink-0 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-20 w-20 shrink-0 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                  <UserIcon className="h-6 w-6" />
                </div>
              )}
            </div>
            {errors.avatar && (
              <span className="text-xs text-rose-500 font-medium mt-1">
                {errors.avatar.message}
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
              {isEditMode ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
