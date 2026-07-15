"use client";

import React, { forwardRef } from "react";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 py-1">
        <label className="flex items-center gap-3 cursor-pointer group select-none">
          <div className="relative">
            <input
              type="checkbox"
              ref={ref}
              className="sr-only peer"
              {...props}
            />
            <div
              className="w-10 h-6 bg-zinc-200 peer-focus:outline-none dark:bg-zinc-800 rounded-full 
              peer-checked:after:translate-x-full 
              rtl:peer-checked:after:-translate-x-full 
              peer-checked:after:border-white 
              after:content-[''] 
              after:absolute 
              after:top-[2px] 
              after:start-[2px] 
              after:bg-white 
              after:border-zinc-300 
              after:border 
              after:rounded-full 
              after:h-5 
              after:w-5 
              after:transition-all 
              dark:border-zinc-700 
              transition-colors
              
              /* Zinc Brand Color */
              [html[data-brand=zinc]_&]:peer-checked:bg-zinc-900 
              dark:[html[data-brand=zinc]_&]:peer-checked:bg-zinc-100
              
              /* Blue Brand Color */
              [html[data-brand=blue]_&]:peer-checked:bg-blue-600 
              dark:[html[data-brand=blue]_&]:peer-checked:bg-blue-400
              
              /* Emerald Brand Color */
              [html[data-brand=emerald]_&]:peer-checked:bg-emerald-600 
              dark:[html[data-brand=emerald]_&]:peer-checked:bg-emerald-400
              
              /* Violet Brand Color */
              [html[data-brand=violet]_&]:peer-checked:bg-violet-600 
              dark:[html[data-brand=violet]_&]:peer-checked:bg-violet-400
              
              /* Amber Brand Color */
              [html[data-brand=amber]_&]:peer-checked:bg-amber-600 
              dark:[html[data-brand=amber]_&]:peer-checked:bg-amber-400"
            />
          </div>
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-300 transition-colors">
            {label}
          </span>
        </label>
        {error && (
          <span className="text-xs text-rose-500 font-medium mt-1">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Switch.displayName = "Switch";

export default Switch;
