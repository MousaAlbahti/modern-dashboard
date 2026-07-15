"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { pb } from "@/lib/pocketbase";
import LoginHeader from "./_component/LoginHeader";
import LoginForm from "./_component/LoginForm";

export default function LoginPage() {
  const [mounted, setMounted] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Secure guard check: Skip login screen if session is active
    if (pb.authStore.isValid) {
      router.replace("/");
    }
  }, [router]);

  // Prevent dynamic CSS or DOM mismatches on client hydrate phase
  if (!mounted) return null;

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
        <LoginHeader />
        <LoginForm />
      </div>
    </div>
  );
}
