"use client";

import React from "react";
import { PackageOpen } from "lucide-react";
import { Product } from "@/types";
import { pb } from "@/lib/pocketbase";

import { Column } from "@/components/ui/Table";
import { TablePageLayout } from "@/components/ui/TablePageLayout";

// Import Shared Table Row Cells
import {
  TextWithSubtitleCell,
  CurrencyCell,
  BadgeCell,
  DateCell,
  TagsCell,
  EditableAvatarCell,
  RowActionsCell,
} from "@/components/ui/TableCells";

import ProductModal from "./ProductModal";
import { useProductTable } from "@/hooks/useProductTable"; // Strictly import from the centralized hooks alias

export const ProductTable: React.FC = () => {
  // Bind presentation states and properties directly from the centralized hook
  const {
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
  } = useProductTable();

  // Columns definition using pre-defined table cells mapping
  const columns: Column<Product>[] = [
    {
      header: "Product",
      render: (product: Product) => (
        <div className="flex items-center gap-4">
          <EditableAvatarCell
            imageUrl={
              product.images &&
              product.images.length > 0 &&
              product.collectionId
                ? pb.files.getURL(product, product.images[0], {
                    thumb: "80x80",
                  })
                : null
            }
            isUploading={uploadingId === product.id}
            onFileSelect={(file) => handleInlineUpload(product.id, file)}
          />
          <TextWithSubtitleCell
            title={product.name}
            subtitle={product.description || "No description provided"}
          />
        </div>
      ),
    },
    {
      header: "Price",
      render: (product: Product) => <CurrencyCell value={product.price} />,
      className: "text-sm font-semibold text-zinc-900 dark:text-zinc-100",
    },
    {
      header: "Stock",
      render: (product: Product) => (
        <BadgeCell
          value={product.stock}
          type={product.stock < 10 ? "warning" : "success"}
          label={product.stock < 10 ? "Low Stock" : "Safe"}
        />
      ),
    },
    {
      header: "Tags",
      render: (product: Product) => <TagsCell items={product.expand?.tags} />,
    },
    {
      header: "Created",
      render: (product: Product) => <DateCell isoString={product.created} />,
      className: "text-xs text-zinc-500 dark:text-zinc-400 font-medium",
    },
    {
      header: "Actions",
      className: "text-right",
      render: (product: Product) => (
        <RowActionsCell
          item={product}
          onEdit={handleEditClick}
          onDelete={() => handleDeleteClick(product.id)}
          isDeleting={deletingId === product.id}
        />
      ),
    },
  ];

  return (
    <>
      <TablePageLayout
        title="Products Catalog"
        count={productsData?.totalItems || 0}
        isFetching={isFetching}
        isPending={isPending}
        error={error}
        emptyIcon={PackageOpen}
        emptyTitle="No Products Found"
        emptyDesc="The products catalog is currently empty. Try creating some products in PocketBase to see them listed here."
        searchPlaceholder="Search products..."
        addLabel="Add Product"
        onRefresh={refetch}
        onAddClick={handleAddClick}
        data={productsData?.items || []}
        columns={columns}
        keyExtractor={(product) => product.id}
        totalPages={productsData?.totalPages || 0}
        currentPage={productsData?.page || 1}
      />

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={refetch}
        product={selectedProduct}
      />
    </>
  );
};

export default ProductTable;
