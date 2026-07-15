"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "./_component/Sidebar";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If auth state resolved and session is invalid, force login redirect
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Render unified animated loading screen to prevent UI content flashes
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-t-brand-primary border-zinc-200 animate-spin" />
          <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
            Verifying Session...
          </span>
        </div>
      </div>
    );
  }

  // Strictly block rendering anything if not authenticated
  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen w-full max-w-full overflow-hidden p-6 gap-6 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area - Corrected padding/gap structure for pixel-perfect balance */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-9xl mx-auto flex-1 flex flex-col min-h-0">
          {children}
        </div>
      </main>
      <Toaster position="top-right" closeButton theme="system" />
    </div>
  );
}
