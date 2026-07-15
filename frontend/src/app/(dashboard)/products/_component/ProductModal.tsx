"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { Upload, FileImage } from "lucide-react";
import { Product } from "@/types";

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
import { useProductForm } from "./useProductForm";
import SearchInput from "@/components/ui/SearchInput";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: Product | null;
}

export const ProductModal = ({
  isOpen,
  onClose,
  onSuccess,
  product,
}: ProductModalProps) => {
  // Delegate all functional states to useProductForm hook
  const {
    form,
    tags,
    imagePreview,
    isEditMode,
    watchedTags,
    tagSearchInput,
    setTagSearchInput,
    onSubmit,
    setValue,
  } = useProductForm({ isOpen, onClose, onSuccess, product });

  const {
    register,
    control,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Product Details" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-2">
          {/* Product Name Input Field */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Product Name
            </Label>
            <Input
              type="text"
              {...register("name")}
              placeholder="e.g. Leather Wallet"
            />
            {errors.name && (
              <span className="text-xs text-rose-500 font-medium mt-1">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Pricing and Stock Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Price (USD)
              </Label>
              <Input
                type="number"
                step="0.01"
                {...register("price")}
                placeholder="59.99"
              />
              {errors.price && (
                <span className="text-xs text-rose-500 font-medium mt-1">
                  {errors.price.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Stock Quantity
              </Label>
              <Input type="number" {...register("stock")} placeholder="100" />
              {errors.stock && (
                <span className="text-xs text-rose-500 font-medium mt-1">
                  {errors.stock.message}
                </span>
              )}
            </div>
          </div>

          {/* Description Field */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Description (Optional)
            </Label>
            <textarea
              rows={3}
              {...register("description")}
              placeholder="Provide product description..."
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-500 text-zinc-900 dark:text-zinc-50 resize-none"
            />
            {errors.description && (
              <span className="text-xs text-rose-500 font-medium mt-1">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Tags Selection Controlled Area */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Product Tags <span className="text-rose-500 font-bold">*</span>
              </Label>
              {errors.tags && (
                <span className="text-[10px] font-medium text-rose-500">
                  {errors.tags.message}
                </span>
              )}
            </div>

            <div className="mb-1.5">
              <SearchInput
                value={tagSearchInput}
                onChange={(e) => setTagSearchInput(e.target.value)}
                placeholder="Search tags..."
                className="w-full"
              />
            </div>

            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2 p-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl max-h-32 overflow-y-auto">
                  {tags.length > 0 ? (
                    tags.map((tag) => {
                      const isSelected = field.value.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => {
                            const updated = isSelected
                              ? field.value.filter(
                                  (id: string) => id !== tag.id,
                                )
                              : [...field.value, tag.id];
                            field.onChange(updated);
                          }}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all duration-150 cursor-pointer select-none ${
                            isSelected
                              ? "bg-primary border-primary text-primary-foreground shadow-sm"
                              : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-900/60 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
                          }`}
                        >
                          {tag.name}
                        </button>
                      );
                    })
                  ) : (
                    <span className="text-xs text-zinc-400 dark:text-zinc-600 italic select-none">
                      No tags available.
                    </span>
                  )}
                </div>
              )}
            />
          </div>

          {/* Dynamic Product Image Upload Controlled Area */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Product Image (Optional)
            </Label>

            <div className="flex items-center gap-4">
              <label className="flex flex-col items-center justify-center h-20 w-full rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 hover:bg-zinc-100 dark:hover:bg-zinc-900/40 transition-colors duration-150 cursor-pointer select-none">
                <div className="flex flex-col items-center justify-center pt-3 pb-3">
                  <Upload className="h-4 w-4 text-zinc-400 dark:text-zinc-500 mb-1" />
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    {imagePreview ? "Change Image" : "Upload Picture"}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setValue("image", e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </label>

              {imagePreview ? (
                <div className="h-20 w-20 shrink-0 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-20 w-20 shrink-0 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                  <FileImage className="h-6 w-6" />
                </div>
              )}
            </div>
            {errors.image && (
              <span className="text-xs text-rose-500 font-medium mt-1">
                {errors.image.message}
              </span>
            )}
          </div>

          {/* Submit Actions Button Box */}
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={isSubmitting || watchedTags.length === 0}
              isLoading={isSubmitting}
            >
              {isEditMode ? "Save Changes" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
