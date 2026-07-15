"use client";

import React from "react";
import { Users as UsersIcon } from "lucide-react";
import { User } from "@/types";
import { pb } from "@/lib/pocketbase";

import { Column } from "@/components/ui/Table";
import { TablePageLayout } from "@/components/ui/TablePageLayout";

// Import Shared Table Row Cells
import {
  TextWithSubtitleCell,
  BadgeCell,
  DateCell,
  EditableAvatarCell,
  RowActionsCell,
} from "@/components/ui/TableCells";

import UserModal from "./UserModal";
import { useUserTable } from "@/hooks/useUserTable";

export const UserTable: React.FC = () => {
  // Bind presentation states and properties directly from the centralized hook
  const {
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
  } = useUserTable();

  // Columns definition using pre-defined table cells mapping
  const columns: Column<User>[] = [
    {
      header: "User",
      render: (user: User) => (
        <div className="flex items-center gap-4">
          <EditableAvatarCell
            imageUrl={
              user.avatar && user.collectionId
                ? pb.files.getURL(user, user.avatar, {
                    thumb: "80x80",
                  })
                : null
            }
            isUploading={uploadingId === user.id}
            onFileSelect={(file) => handleInlineUpload(user.id, file)}
          />
          <TextWithSubtitleCell title={user.name} subtitle={user.email} />
        </div>
      ),
    },
    {
      header: "Status",
      render: (user: User) => (
        <BadgeCell
          value=""
          type={user.verified ? "success" : "warning"}
          label={user.verified ? "Verified" : "Pending"}
        />
      ),
    },
    {
      header: "Created",
      render: (user: User) => <DateCell isoString={user.created} />,
      className: "text-xs text-zinc-500 dark:text-zinc-400 font-medium",
    },
    {
      header: "Actions",
      className: "text-right",
      render: (user: User) => (
        <RowActionsCell
          item={user}
          onEdit={handleEditClick}
          onDelete={() => handleDeleteClick(user.id)}
          isDeleting={deletingId === user.id}
        />
      ),
    },
  ];

  return (
    <>
      <TablePageLayout
        title="Users List"
        count={usersData?.totalItems || 0}
        isFetching={isFetching}
        isPending={isPending}
        error={error}
        emptyIcon={UsersIcon}
        emptyTitle="No Users Found"
        emptyDesc="The users list is currently empty. Try creating some users in PocketBase to see them listed here."
        searchPlaceholder="Search users by name or email..."
        addLabel="Add User"
        onRefresh={refetch}
        onAddClick={handleAddClick}
        data={usersData?.items || []}
        columns={columns}
        keyExtractor={(user) => user.id}
        totalPages={usersData?.totalPages || 0}
        currentPage={usersData?.page || 1}
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={refetch}
        user={selectedUser}
      />
    </>
  );
};

export default UserTable;
