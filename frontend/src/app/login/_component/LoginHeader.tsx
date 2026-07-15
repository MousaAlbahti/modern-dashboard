import React from "react";

export const LoginHeader = () => {
  return (
    <div className="flex flex-col items-center gap-2 mb-8 select-none">
      <div className="h-10 w-10 rounded-full border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center">
        <div className="h-4 w-4 rounded-full bg-zinc-900 dark:bg-zinc-100 animate-pulse" />
      </div>
      <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Welcome to MOUSAdash
      </h1>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Securely access your dynamic business stats.
      </p>
    </div>
  );
};

export default LoginHeader;
