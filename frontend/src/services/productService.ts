import { pb } from "@/lib/pocketbase";
import { Product, Tag } from "@/types";

export interface PaginatedProducts {
  items: Product[];
  totalPages: number;
  page: number;
  totalItems: number;
}

export async function getProducts(
  search?: string,
  page: number = 1,
  perPage: number = 10
): Promise<PaginatedProducts> {
  try {
    const options: Record<string, string> = {
      sort: "-id",
      expand: "tags",
    };

    if (search && search.trim() !== "") {
      const cleanSearch = search.trim();
      // We search across name, description, and the related tag's name using dot notation
      options.filter = `name ~ "${cleanSearch}" || description ~ "${cleanSearch}" || tags.name ?~ "${cleanSearch}"`;
    }

    const result = await pb
      .collection("products")
      .getList<Product>(page, perPage, options);

    return {
      items: result.items,
      totalPages: result.totalPages,
      page: result.page,
      totalItems: result.totalItems,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown database error occurred.";
    console.error("[ProductService Failure]:", errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Deletes a product from the collection by its ID.
 * @param id - The ID of the product to delete
 */
export async function deleteProduct(id: string): Promise<void> {
  try {
    await pb.collection("products").delete(id);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete product.";
    console.error("[ProductService Delete Failure]:", errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Fetches all available tags sorted by name.
 */
export async function fetchTags(search?: string): Promise<Tag[]> {
  try {
    const options: Record<string, string> = {
      sort: "name",
    };
    if (search && search.trim() !== "") {
      options.filter = `name ~ "${search.trim()}"`;
    }
    const records = await pb.collection("tags").getFullList<Tag>(options);
    return records;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown database error occurred.";
    console.error("[TagService Failure]:", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function fetchProductsList(search?: string): Promise<Product[]> {
  try {
    const options: Record<string, string> = {
      sort: "name",
    };
    if (search && search.trim() !== "") {
      options.filter = `name ~ "${search.trim()}" || description ~ "${search.trim()}"`;
    }
    const records = await pb.collection("products").getFullList<Product>(options);
    return records;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown database error occurred.";
    console.error("[ProductService fetchProductsList Failure]:", errorMessage);
    throw new Error(errorMessage);
  }
}
