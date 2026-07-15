import { ClientResponseError } from "pocketbase";

/**
 * Centrally parses PocketBase and standard Javascript errors to extract clean, readable feedback.
 */
export function parseApiError(error: unknown, fallbackMessage = "Database action failed."): string {
  if (error instanceof ClientResponseError) {
    if (error.data && typeof error.data === "object" && Object.keys(error.data).length > 0) {
      const details = Object.entries(error.data)
        .map(([field, detail]) => {
          const detailMsg = detail && typeof detail === "object" && "message" in detail
            ? (detail as { message: string }).message
            : JSON.stringify(detail);
          return `${field}: ${detailMsg}`;
        })
        .join(", ");
      return `${error.message} (${details})`;
    }
    return error.message;
  }
  return error instanceof Error ? error.message : fallbackMessage;
}
