"use client";

import React from "react";
import { Tags } from "lucide-react";
import { Tag } from "@/types";

// Import Shared UI Layout Elements
import { Column } from "@/components/ui/Table";
import { TablePageLayout } from "@/components/ui/TablePageLayout";

// Import Shared Table Row Cells
import {
  TextWithSubtitleCell,
  RowActionsCell,
} from "@/components/ui/TableCells";

import TagModal from "./TagModal";
import { useTagTable } from "@/hooks/useTagTable";

export const TagTable = () => {
  // Bind presentation states and properties directly from the centralized hook
  const {
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
  } = useTagTable();

  // Columns definition using pre-defined table cells mapping
  const columns: Column<Tag>[] = [
    {
      header: "Tag Name",
      render: (tag: Tag) => (
        <TextWithSubtitleCell title={tag.name} subtitle={`ID: ${tag.id}`} />
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      render: (tag: Tag) => (
        <RowActionsCell
          item={tag}
          onEdit={handleEditClick}
          onDelete={() => handleDeleteClick(tag.id)}
          isDeleting={deletingId === tag.id}
        />
      ),
    },
  ];

  return (
    <>
      <TablePageLayout
        title="Tags Inventory"
        count={tagsData?.totalItems || 0}
        isFetching={isFetching}
        isPending={isPending}
        error={error}
        emptyIcon={Tags}
        emptyTitle="No Tags Found"
        emptyDesc="The tags inventory is currently empty. Try adding a new tag to get started."
        searchPlaceholder="Search tags by name..."
        addLabel="Add Tag"
        onRefresh={refetch}
        onAddClick={handleAddClick}
        data={tagsData?.items || []}
        columns={columns}
        keyExtractor={(tag) => tag.id}
        totalPages={tagsData?.totalPages || 0}
        currentPage={tagsData?.page || 1}
      />

      <TagModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={refetch}
        tag={selectedTag}
      />
    </>
  );
};

export default TagTable;
