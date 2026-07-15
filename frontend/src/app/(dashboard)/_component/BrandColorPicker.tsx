"use client";

import React, { useEffect, useState } from "react";

const colors = ["zinc", "blue", "emerald", "violet", "amber"] as const;
type ColorName = (typeof colors)[number];

const bgClasses: Record<ColorName, string> = {
  zinc: "bg-zinc-900 dark:bg-zinc-100",
  blue: "bg-blue-600 dark:bg-blue-400",
  emerald: "bg-emerald-600 dark:bg-emerald-400",
  violet: "bg-violet-600 dark:bg-violet-400",
  amber: "bg-amber-600 dark:bg-amber-400",
};

export const BrandColorPicker: React.FC = () => {
  const [color, setColor] = useState<ColorName>("zinc");

  useEffect(() => {
    const saved = localStorage.getItem("brand-color") as ColorName;
    if (colors.includes(saved)) {
      setColor(saved);
    }
  }, []);

  // Sync state to the HTML data attribute on mount and updates
  useEffect(() => {
    document.documentElement.setAttribute("data-brand", color);
  }, [color]);

  const handleSelect = (name: ColorName) => {
    setColor(name);
    localStorage.setItem("brand-color", name);
  };

  return (
    <div className="flex flex-col gap-2 px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-900/60">
      <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
        Brand Color
      </span>
      <div className="flex items-center gap-2">
        {colors.map((name) => (
          <button
            key={name}
            onClick={() => handleSelect(name)}
            className={`h-5 w-5 rounded-full ${bgClasses[name]} transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95`}
            style={{
              outline:
                color === name ? "2.5px solid var(--brand-primary)" : "none",
              outlineOffset: "2px",
            }}
            title={name.charAt(0).toUpperCase() + name.slice(1)}
            aria-label={`Select ${name} brand color`}
          />
        ))}
      </div>
    </div>
  );
};

export default BrandColorPicker;
