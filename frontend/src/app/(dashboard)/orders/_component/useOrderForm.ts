"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Order, User, Product } from "@/types";
import { pb } from "@/lib/pocketbase";
import { fetchUsers } from "@/services/dashboardService";
import { fetchProductsList } from "@/services/productService";
import { toast } from "sonner";
import { toastConfigs } from "@/lib/notifications";

export const orderSchema = z.object({
  user: z.string().min(1, "Customer selection is required"),
  status: z.enum(["pending", "shipped", "delivered"]),
  total_price: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Price must be non-negative",
    }),
  products: z.array(z.string()).min(1, "At least one product is required"),
});

export type OrderFormValues = z.infer<typeof orderSchema>;

interface UseOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  order: Order | null;
}

export const useOrderForm = ({
  isOpen,
  onClose,
  onSuccess,
  order,
}: UseOrderFormProps) => {
  const isEditMode = !!order;

  // 1. Fetch available customers (users) and products via TanStack Query
  const { data: users = [] } = useQuery<User[], Error>({
    queryKey: ["users-list"],
    queryFn: fetchUsers,
    enabled: isOpen,
  });

  const [productSearchInput, setProductSearchInput] = useState("");
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productsCache, setProductsCache] = useState<Record<string, Product>>(
    {},
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setProductSearchQuery(productSearchInput);
    }, 300);
    return () => clearTimeout(handler);
  }, [productSearchInput]);

  useEffect(() => {
    if (isOpen) {
      setProductSearchInput("");
      setProductSearchQuery("");
    }
  }, [isOpen]);

  const { data: products = [] } = useQuery<Product[], Error>({
    queryKey: ["products-list", productSearchQuery],
    queryFn: () => fetchProductsList(productSearchQuery),
    enabled: isOpen,
  });

  // Keep a local lookup cache of products to calculate the total price correctly
  // even if selected products are hidden from the current search results.
  useEffect(() => {
    if (products.length > 0) {
      setProductsCache((prev) => {
        const next = { ...prev };
        products.forEach((p) => {
          next[p.id] = p;
        });
        return next;
      });
    }
  }, [products]);

  // Seed cache with selected order products on load (edit mode)
  useEffect(() => {
    const existingProducts = order?.expand?.products;
    if (existingProducts) {
      setProductsCache((prev) => {
        const next = { ...prev };
        existingProducts.forEach((p) => {
          next[p.id] = p;
        });
        return next;
      });
    }
  }, [order]);

  // 2. Initialize React Hook Form
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      user: "",
      status: "pending",
      total_price: "0.00",
      products: [],
    },
  });

  const { reset, watch, setValue, handleSubmit } = form;
  const watchedProducts = watch("products") || [];

  // 3. Sync form values when the modal opens or selected order changes
  useEffect(() => {
    if (isOpen) {
      if (order) {
        reset({
          user: order.user || "",
          status: order.status || "pending",
          total_price: order.total_price.toFixed(2),
          products: order.products || [],
        });
      } else {
        reset({
          user: "",
          status: "pending",
          total_price: "0.00",
          products: [],
        });
      }
    }
  }, [order, isOpen, reset]);

  // 4. CRITICAL: Automatically calculate the sum of selected products' prices
  // and dynamically update the total_price field whenever selected products change.
  useEffect(() => {
    const sum = watchedProducts.reduce((acc, productId) => {
      const prod = productsCache[productId];
      return acc + (prod ? prod.price : 0);
    }, 0);
    setValue("total_price", sum.toFixed(2), { shouldValidate: true });
  }, [watchedProducts, productsCache, setValue]);

  // 5. Submit callback to create/update records on PocketBase
  const onSubmit = async (data: OrderFormValues) => {
    const orderData = {
      user: data.user,
      status: data.status,
      total_price: parseFloat(data.total_price) || 0,
      products: data.products,
    };

    const promise =
      isEditMode && order
        ? pb.collection("orders").update(order.id, orderData)
        : pb.collection("orders").create(orderData);

    toast.promise(
      promise,
      isEditMode ? toastConfigs.order.update : toastConfigs.order.create,
    );

    await promise;
    onSuccess();
    onClose();
  };

  return {
    form,
    users,
    products,
    isEditMode,
    watchedProducts,
    productSearchInput,
    setProductSearchInput,
    onSubmit: handleSubmit(onSubmit),
    setValue,
  };
};
