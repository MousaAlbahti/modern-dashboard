"use client";

import { useEffect } from "react";
import { useQueryClient, QueryKey } from "@tanstack/react-query";
import { pb } from "@/lib/pocketbase";

export function useRealtimeSubscription(
  collection: string,
  queryKey: QueryKey,
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Graceful guard clause if PocketBase is not initialized
    if (!pb) return;

    // Establish live SSE subscription
    pb.collection(collection)
      .subscribe("*", (e) => {
        console.log(
          `[PocketBase Stream] Live update detected on ${collection}:`,
          e.action,
        );

        // Strictly invalidate queries using the official QueryKey type safety
        queryClient.invalidateQueries({ queryKey });
      })
      .catch((err) => {
        console.error(
          `[PocketBase Stream Error] Subscription failed for ${collection}:`,
          err,
        );
      });

    // Clean up subscription channel on component unmount
    return () => {
      pb.collection(collection)
        .unsubscribe("*")
        .catch((err) => {
          console.error(
            `[PocketBase Stream Error] Unsubscription failed for ${collection}:`,
            err,
          );
        });
    };
  }, [collection, queryKey, queryClient]);
}
