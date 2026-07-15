import React from "react";
import Link from "next/link";
import { SidebarItem as SidebarItemType } from "@/types";
import { LayoutDashboard, Boxes, ClipboardList, Tags, Users, HelpCircle } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Boxes,
  ClipboardList,
  Tags,
  Users,
};

interface SidebarItemProps {
  item: SidebarItemType;
  isActive: boolean;
  onClick: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ item, isActive, onClick }) => {
  const IconComponent = iconMap[item.icon] || HelpCircle;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`
        flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out text-left select-none
        ${
          isActive
            ? "bg-brand-primary text-brand-primary-foreground"
            : "text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40"
        }
      `}
    >
      <IconComponent
        className={`h-4 w-4 shrink-0 transition-colors ${
          isActive ? "text-brand-primary-foreground" : "text-zinc-400 dark:text-zinc-500"
        }`}
      />
      <span className="truncate">{item.title}</span>
    </Link>
  );
};

export default SidebarItem;
