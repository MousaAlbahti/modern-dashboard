"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { pb } from "@/lib/pocketbase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

// Schema validation requires a valid email and minimum password length
const loginSchema = z.object({
  email: z.string().min(8, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    try {
      try {
        // Step 1: Attempt dynamic system admin/superuser auth first
        if (pb.admins) {
          await pb.admins.authWithPassword(data.email, data.password);
        } else {
          await pb
            .collection("_superusers")
            .authWithPassword(data.email, data.password);
        }
      } catch (adminErr) {
        // Step 2: Fallback to regular collection user auth if admin fails
        await pb
          .collection("users")
          .authWithPassword(data.email, data.password);
      }

      interface SuperuserRecord {
        collectionName?: string;
        verified?: boolean;
      }

      const model = (pb.authStore.record || pb.authStore.model) as SuperuserRecord | null;
      const isSuperuser = "isSuperuser" in pb.authStore 
        ? Boolean((pb.authStore as { isSuperuser: unknown }).isSuperuser) 
        : false;
      const isSystemAdmin = pb.authStore.isAdmin || isSuperuser || model?.collectionName === "_superusers";

      // Step 3: Enforce verified check only for collection users
      if (!isSystemAdmin && model) {
        const isVerified = model.verified ?? false;
        if (!isVerified) {
          // Immediately wipe local tokens if account is not verified
          pb.authStore.clear();
          throw new Error(
            "Access denied: Please verify your email address to log in.",
          );
        }
      }

      router.replace("/");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Authentication failed.";
      console.warn("[Login Form Authentication Warning]:", errorMessage);
      setError(errorMessage || "Double check your email and password.");
    }
  };

  return (
    <div className="w-full">
      {/* Dynamic Error Box */}
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl text-rose-800 dark:text-rose-400 text-xs mb-6">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Dynamic Shadcn Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            <Input
              id="email"
              type="email"
              placeholder="name@promage.com"
              className="pl-10"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <span className="text-xs text-rose-500 font-medium mt-1">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              {...register("password")}
            />
          </div>
          {errors.password && (
            <span className="text-xs text-rose-500 font-medium mt-1">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Utilizing Pre-built Shadcn Button */}
        <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
