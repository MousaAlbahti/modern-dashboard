"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { ShoppingBag } from "lucide-react";
import { Order } from "@/types";

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
import { useOrderForm } from "./useOrderForm";
import SearchInput from "@/components/ui/SearchInput";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  order: Order | null;
}

export const OrderModal = ({
  isOpen,
  onClose,
  onSuccess,
  order,
}: OrderModalProps) => {
  // Delegate all functional states to useOrderForm hook
  const {
    form,
    users,
    products,
    isEditMode,
    watchedProducts,
    productSearchInput,
    setProductSearchInput,
    onSubmit,
  } = useOrderForm({ isOpen, onClose, onSuccess, order });

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
            {isEditMode ? "Modify Order Details" : "Place New Order"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-2">
          {/* Customer Selection Controlled Area */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Customer <span className="text-rose-500 font-bold">*</span>
            </Label>
            <select
              {...register("user")}
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-500 text-zinc-900 dark:text-zinc-50"
            >
              <option value="" disabled>
                Choose customer...
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            {errors.user && (
              <span className="text-xs text-rose-500 font-medium mt-1">
                {errors.user.message}
              </span>
            )}
          </div>

          {/* Status Selection */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Order Status
            </Label>
            <select
              {...register("status")}
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-500 text-zinc-900 dark:text-zinc-50"
            >
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
            {errors.status && (
              <span className="text-xs text-rose-500 font-medium mt-1">
                {errors.status.message}
              </span>
            )}
          </div>

          {/* Products Multi-select Area */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Products <span className="text-rose-500 font-bold">*</span>
              </Label>
              {errors.products && (
                <span className="text-[10px] font-medium text-rose-500">
                  {errors.products.message}
                </span>
              )}
            </div>

            <div className="mb-1.5">
              <SearchInput
                value={productSearchInput}
                onChange={(e) => setProductSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full"
              />
            </div>

            <Controller
              name="products"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-2 p-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl max-h-48 overflow-y-auto">
                  {products.length > 0 ? (
                    products.map((product) => {
                      const isSelected = field.value.includes(product.id);
                      return (
                        <label
                          key={product.id}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900/60 cursor-pointer select-none transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                const updated = isSelected
                                  ? field.value.filter(
                                      (id: string) => id !== product.id,
                                    )
                                  : [...field.value, product.id];
                                field.onChange(updated);
                              }}
                              className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-550 focus:ring-zinc-500 cursor-pointer h-4 w-4"
                            />
                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                              {product.name}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                            ${product.price.toFixed(2)}
                          </span>
                        </label>
                      );
                    })
                  ) : (
                    <span className="text-xs text-zinc-400 dark:text-zinc-600 italic select-none">
                      No products available.
                    </span>
                  )}
                </div>
              )}
            />
          </div>

          {/* calculated Total Price (Manual edits disabled) */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Total Price (Calculated, USD)
            </Label>
            <Input
              type="text"
              {...register("total_price")}
              disabled
              className="bg-zinc-100 dark:bg-zinc-900/60 cursor-not-allowed opacity-80"
            />
            {errors.total_price && (
              <span className="text-xs text-rose-500 font-medium mt-1">
                {errors.total_price.message}
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
              disabled={isSubmitting || watchedProducts.length === 0}
              isLoading={isSubmitting}
            >
              {isEditMode ? "Save Changes" : "Create Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
