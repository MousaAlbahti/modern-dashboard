"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import {
  getProducts,
  deleteProduct,
  PaginatedProducts,
} from "@/services/productService";
import { Product } from "@/types";
import { pb } from "@/lib/pocketbase";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { toast } from "sonner";
import { toastConfigs } from "@/lib/notifications";

export function useProductTable() {
  // 1. Hook into Next.js search parameters for pagination and filtering
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const pageQuery = Number(searchParams.get("page")) || 1;
  const queryKey = ["products", searchQuery, pageQuery];

  // 2. Define local states for UI interactions
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 3. Fetch products via TanStack Query[cite: 25]
  const {
    data: productsData,
    error,
    isPending,
    isFetching,
    refetch,
  } = useQuery<PaginatedProducts, Error>({
    queryKey,
    queryFn: () => getProducts(searchQuery, pageQuery, 10),
  });

  // 4. Bind to PocketBase live SSE stream for real-time updates[cite: 27]
  useRealtimeSubscription("products", ["products"]);

  // 5. Action Handlers for modal, deletion, and file uploading
  const handleAddClick = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    setDeletingId(id);
    const promise = pb.collection("products").delete(id);
    toast.promise(promise, toastConfigs.product.delete);
    try {
      await promise;
      refetch();
    } catch (err) {
      console.error("[Delete Product Error]:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleInlineUpload = async (productId: string, file: File) => {
    setUploadingId(productId);
    try {
      const formData = new FormData();
      formData.append("images", file);
      await pb.collection("products").update(productId, formData);
      refetch(); // Invalidate Query Cache immediately upon successful upload
    } catch (error) {
      console.error("[Upload Failure]:", error);
      alert("Image upload failed.");
    } finally {
      setUploadingId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Return all required properties and functions to the presentation component
  return {
    productsData,
    error,
    isPending,
    isFetching,
    refetch,
    isModalOpen,
    selectedProduct,
    uploadingId,
    deletingId,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleInlineUpload,
    handleModalClose,
  };
}
