import { parseApiError } from "./errors";

export interface ToastConfig {
  loading: string;
  success: string;
  error: (err: unknown) => string;
}

export interface ResourceToastConfigs {
  create: ToastConfig;
  update: ToastConfig;
  delete: ToastConfig;
}

export const toastConfigs: Record<
  "user" | "product" | "order" | "tag",
  ResourceToastConfigs
> = {
  user: {
    create: {
      loading: "Creating new user profile...",
      success: "User profile has been created successfully.",
      error: (err: unknown) => parseApiError(err, "Failed to create user."),
    },
    update: {
      loading: "Saving user modifications...",
      success: "User updates saved successfully.",
      error: (err: unknown) => parseApiError(err, "Failed to save changes."),
    },
    delete: {
      loading: "Removing user from system...",
      success: "User has been deleted successfully.",
      error: (err: unknown) => parseApiError(err, "Failed to delete user."),
    },
  },
  product: {
    create: {
      loading: "Creating new product...",
      success: "Product has been created successfully.",
      error: (err: unknown) => parseApiError(err, "Failed to create product."),
    },
    update: {
      loading: "Saving product modifications...",
      success: "Product updates saved successfully.",
      error: (err: unknown) => parseApiError(err, "Failed to save product changes."),
    },
    delete: {
      loading: "Removing product from system...",
      success: "Product has been deleted successfully.",
      error: (err: unknown) => parseApiError(err, "Failed to delete product."),
    },
  },
  order: {
    create: {
      loading: "Creating new order...",
      success: "Order has been created successfully.",
      error: (err: unknown) => parseApiError(err, "Failed to create order."),
    },
    update: {
      loading: "Saving order modifications...",
      success: "Order updates saved successfully.",
      error: (err: unknown) => parseApiError(err, "Failed to save order changes."),
    },
    delete: {
      loading: "Removing order from system...",
      success: "Order has been deleted successfully.",
      error: (err: unknown) => parseApiError(err, "Failed to delete order."),
    },
  },
  tag: {
    create: {
      loading: "Creating new tag...",
      success: "Tag has been created successfully.",
      error: (err: unknown) => parseApiError(err, "Failed to create tag."),
    },
    update: {
      loading: "Saving tag modifications...",
      success: "Tag updates saved successfully.",
      error: (err: unknown) => parseApiError(err, "Failed to save tag changes."),
    },
    delete: {
      loading: "Removing tag from system...",
      success: "Tag has been deleted successfully.",
      error: (err: unknown) => parseApiError(err, "Failed to delete tag."),
    },
  },
};
