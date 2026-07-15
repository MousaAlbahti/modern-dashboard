import { pb } from "@/lib/pocketbase";
import { Order, User } from "@/types";

export async function fetchOrders(): Promise<Order[]> {
  try {
    const records = await pb.collection("orders").getFullList<Order>({
      sort: "-created",
      requestKey: "dashboard-stats-orders",
    });
    return records;
  } catch (error) {
    console.error("Failed to fetch orders from PocketBase:", error);
    throw error;
  }
}

export async function fetchUsers(): Promise<User[]> {
  try {
    const records = await pb.collection("users").getFullList<User>({
      sort: "-created",
      requestKey: "dashboard-stats-users",
    });
    return records;
  } catch (error) {
    console.error("Failed to fetch users from PocketBase:", error);
    throw error;
  }
}

export interface PaginatedUsers {
  items: User[];
  totalPages: number;
  page: number;
  totalItems: number;
}

export async function getUsers(
  search?: string,
  page: number = 1,
  perPage: number = 10,
): Promise<PaginatedUsers> {
  try {
    const options: Record<string, string> = {
      sort: "-created",
    };

    if (search && search.trim() !== "") {
      const cleanSearch = search.trim();
      options.filter = `name ~ "${cleanSearch}" || email ~ "${cleanSearch}"`;
    }

    const result = await pb
      .collection("users")
      .getList<User>(page, perPage, options);

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
    console.error("[DashboardService getUsers Failure]:", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await pb.collection("users").delete(id);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete user.";
    console.error("[DashboardService Delete User Failure]:", errorMessage);
    throw new Error(errorMessage);
  }
}

export interface PaginatedOrders {
  items: Order[];
  totalPages: number;
  page: number;
  totalItems: number;
}

export async function getOrders(
  search?: string,
  page: number = 1,
  perPage: number = 10,
): Promise<PaginatedOrders> {
  try {
    const options: Record<string, string> = {
      sort: "-created",
      expand: "user,products",
    };

    if (search && search.trim() !== "") {
      const cleanSearch = search.trim();
      options.filter = `id ~ "${cleanSearch}" || user.name ~ "${cleanSearch}" || user.email ~ "${cleanSearch}"`;
    }

    const result = await pb
      .collection("orders")
      .getList<Order>(page, perPage, options);

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
    console.error("[DashboardService getOrders Failure]:", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function deleteOrder(id: string): Promise<void> {
  try {
    await pb.collection("orders").delete(id);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete order.";
    console.error("[DashboardService Delete Order Failure]:", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function updateOrderStatus(
  id: string,
  status: "pending" | "shipped" | "delivered",
): Promise<void> {
  try {
    await pb.collection("orders").update(id, { status });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update order status.";
    console.error(
      "[DashboardService Update Order Status Failure]:",
      errorMessage,
    );
    throw new Error(errorMessage);
  }
}
