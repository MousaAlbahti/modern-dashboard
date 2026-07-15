"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product, Tag } from "@/types";
import { pb } from "@/lib/pocketbase";
import { fetchTags } from "@/services/productService";
import { toast } from "sonner";
import { toastConfigs } from "@/lib/notifications";

// Strict validation schema using Zod
export const productSchema = z.object({
  name: z.string().min(4, "Product name must be at least 4 characters"),
  price: z.string().refine(
    (val) => {
      const parsed = parseFloat(val);
      return !isNaN(parsed) && parsed > 0;
    },
    { message: "Price must be a positive float" },
  ),
  stock: z.string().refine(
    (val) => {
      const parsed = parseFloat(val);
      return !isNaN(parsed) && Number.isInteger(parsed) && parsed >= 0;
    },
    { message: "Stock must be a non-negative integer" },
  ),
  description: z.string().optional(),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  image: z.instanceof(File).nullable().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface UseProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: Product | null;
}

export const useProductForm = ({
  isOpen,
  onClose,
  onSuccess,
  product,
}: UseProductFormProps) => {
  const isEditMode = !!product;
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [tagSearchInput, setTagSearchInput] = useState("");
  const [tagSearchQuery, setTagSearchQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setTagSearchQuery(tagSearchInput);
    }, 300);
    return () => clearTimeout(handler);
  }, [tagSearchInput]);

  useEffect(() => {
    if (isOpen) {
      setTagSearchInput("");
      setTagSearchQuery("");
    }
  }, [isOpen]);

  // Fetch product tags via TanStack Query
  const { data: tags = [] } = useQuery<Tag[], Error>({
    queryKey: ["tags", tagSearchQuery],
    queryFn: () => fetchTags(tagSearchQuery),
    enabled: isOpen,
  });

  // Initialize form state and resolver bindings
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: "",
      stock: "",
      description: "",
      tags: [],
      image: null,
    },
  });

  const { reset, watch, setValue, handleSubmit } = form;
  const watchedTags = watch("tags") || [];
  const watchedImage = watch("image");

  // Sync form values with active product on change or open
  useEffect(() => {
    if (isOpen) {
      if (product) {
        reset({
          name: product.name,
          price: product.price.toString(),
          stock: product.stock.toString(),
          description: product.description || "",
          tags: product.tags || [],
          image: null,
        });
      } else {
        reset({
          name: "",
          price: "",
          stock: "",
          description: "",
          tags: [],
          image: null,
        });
      }
    }
  }, [product, isOpen, reset]);

  // Handle browser blob URL generation for immediate image previews
  useEffect(() => {
    if (watchedImage) {
      const url = URL.createObjectURL(watchedImage);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreview(null);
    }
  }, [watchedImage]);

  // Execute database mutations directly on PocketBase
  const onSubmit = async (data: ProductFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", (parseFloat(data.price) || 0).toString());
    formData.append("stock", (parseInt(data.stock, 10) || 0).toString());
    formData.append("description", data.description || "");

    data.tags.forEach((tagId) => formData.append("tags", tagId));
    if (data.image) {
      formData.append("images", data.image);
    }

    const promise =
      isEditMode && product
        ? pb.collection("products").update(product.id, formData)
        : pb.collection("products").create(formData);

    toast.promise(
      promise,
      isEditMode ? toastConfigs.product.update : toastConfigs.product.create,
    );

    await promise;
    onSuccess();
    onClose();
  };

  return {
    form,
    tags,
    imagePreview,
    isEditMode,
    watchedTags,
    tagSearchInput,
    setTagSearchInput,
    onSubmit: handleSubmit(onSubmit),
    setValue,
  };
};
