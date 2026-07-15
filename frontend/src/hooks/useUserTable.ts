"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getUsers, deleteUser, PaginatedUsers } from "@/services/dashboardService";
import { User } from "@/types";
import { pb } from "@/lib/pocketbase";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { toast } from "sonner";
import { toastConfigs } from "@/lib/notifications";

export function useUserTable() {
  // 1. Hook into Next.js search parameters for pagination and filtering
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const pageQuery = Number(searchParams.get("page")) || 1;
  const queryKey = ["users", searchQuery, pageQuery];

  // 2. Define local states for UI interactions
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 3. Fetch users via TanStack Query
  const {
    data: usersData,
    error,
    isPending,
    isFetching,
    refetch,
  } = useQuery<PaginatedUsers, Error>({
    queryKey,
    queryFn: () => getUsers(searchQuery, pageQuery, 10),
  });

  // 4. Bind to PocketBase live SSE stream for real-time updates
  useRealtimeSubscription("users", ["users"]);

  // 5. Action Handlers for modal, deletion, and file uploading
  const handleAddClick = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    setDeletingId(id);
    const promise = pb.collection("users").delete(id);
    toast.promise(promise, toastConfigs.user.delete);
    try {
      await promise;
      refetch();
    } catch (err) {
      console.error("[Delete User Error]:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleInlineUpload = async (userId: string, file: File) => {
    setUploadingId(userId);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      await pb.collection("users").update(userId, formData);
      refetch(); // Invalidate Query Cache immediately upon successful upload
    } catch (error) {
      console.error("[Upload Failure]:", error);
      alert("Avatar upload failed.");
    } finally {
      setUploadingId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Return all required properties and functions to the presentation component
  return {
    usersData,
    error,
    isPending,
    isFetching,
    refetch,
    isModalOpen,
    selectedUser,
    uploadingId,
    deletingId,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleInlineUpload,
    handleModalClose,
  };
}
