"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getTags, deleteTag, PaginatedTags } from "@/services/tagService";
import { Tag } from "@/types";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { pb } from "@/lib/pocketbase";
import { toast } from "sonner";
import { toastConfigs } from "@/lib/notifications";

export function useTagTable() {
  // 1. Hook into Next.js search parameters for pagination and filtering
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const pageQuery = Number(searchParams.get("page")) || 1;
  const queryKey = ["tags", searchQuery, pageQuery];

  // 2. Define local states for UI interactions
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 3. Fetch tags via TanStack Query
  const {
    data: tagsData,
    error,
    isPending,
    isFetching,
    refetch,
  } = useQuery<PaginatedTags, Error>({
    queryKey,
    queryFn: () => getTags(searchQuery, pageQuery, 10),
  });

  // 4. Bind to PocketBase live SSE stream for real-time updates
  useRealtimeSubscription("tags", ["tags"]);

  // 5. Action Handlers for modal and deletion
  const handleAddClick = () => {
    setSelectedTag(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (tag: Tag) => {
    setSelectedTag(tag);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    setDeletingId(id);
    const promise = pb.collection("tags").delete(id);
    toast.promise(promise, toastConfigs.tag.delete);
    try {
      await promise;
      refetch();
    } catch (err) {
      console.error("[Delete Tag Error]:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTag(null);
  };

  // Return all required properties and functions to the presentation component
  return {
    tagsData,
    error,
    isPending,
    isFetching,
    refetch,
    isModalOpen,
    selectedTag,
    deletingId,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleModalClose,
  };
}
