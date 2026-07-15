"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { pb } from "@/lib/pocketbase";
import { User } from "@/types"; // Imported your pre-defined User interface[cite: 26]

export function useAuth() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Determine active token status on client mount
    const verifySession = () => {
      const isValid = pb.authStore.isValid;
      setIsAuthenticated(isValid);
      setIsLoading(false);
    };

    verifySession();

    // Dynamically react to changes (e.g. logouts across other browser tabs)
    const unsubscribe = pb.authStore.onChange(() => {
      setIsAuthenticated(pb.authStore.isValid);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Destroys the active session token and forces redirect to login page.
   */
  const logout = () => {
    pb.authStore.clear();
    router.replace("/login");
  };

  return {
    isLoading,
    isAuthenticated,
    // Cast the auth model strictly to our local User type to enforce Type Safety[cite: 20, 26]
    user: pb.authStore.model as User | null,
    logout,
  };
}
