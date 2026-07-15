import { pb } from "@/lib/pocketbase";
import { Tag } from "@/types";

export interface PaginatedTags {
  items: Tag[];
  totalPages: number;
  page: number;
  totalItems: number;
}

export async function getTags(
  search?: string,
  page: number = 1,
  perPage: number = 10
): Promise<PaginatedTags> {
  try {
    const options: Record<string, string> = {
      sort: "-id",
    };

    if (search && search.trim() !== "") {
      const cleanSearch = search.trim();
      options.filter = `name ~ "${cleanSearch}"`;
    }

    const result = await pb
      .collection("tags")
      .getList<Tag>(page, perPage, options);

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
    console.error("[TagService getTags Failure]:", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function createTag(name: string): Promise<Tag> {
  try {
    const record = await pb.collection("tags").create<Tag>({ name });
    return record;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create tag.";
    console.error("[TagService Create Tag Failure]:", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function updateTag(id: string, name: string): Promise<Tag> {
  try {
    const record = await pb.collection("tags").update<Tag>(id, { name });
    return record;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update tag.";
    console.error("[TagService Update Tag Failure]:", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function deleteTag(id: string): Promise<void> {
  try {
    await pb.collection("tags").delete(id);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete tag.";
    console.error("[TagService Delete Tag Failure]:", errorMessage);
    throw new Error(errorMessage);
  }
}
