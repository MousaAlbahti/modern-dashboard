"use client";

/**
 * @file useSidebar.ts
 * @description State manager hook for Sidebar component. Handles responsive resizing,
 * item drag-and-drop ordering, persistence, and dynamic sub-route path matching.
 */

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { DropResult } from "@hello-pangea/dnd";
import { SidebarItem as SidebarItemType } from "@/types";

const initialItems: SidebarItemType[] = [
  { id: "dashboard", title: "Dashboard", href: "/", icon: "LayoutDashboard" },
  { id: "products", title: "Products", href: "/products", icon: "Boxes" },
  { id: "orders", title: "Orders", href: "/orders", icon: "ClipboardList" },
  { id: "tags", title: "Tags", href: "/tags", icon: "Tags" },
  { id: "users", title: "Users", href: "/users", icon: "Users" },
];

export const useSidebar = () => {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<SidebarItemType[]>(initialItems);
  const [width, setWidth] = useState(260);
  const [activeItemId, setActiveItemId] = useState("dashboard");

  const sidebarRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // Load width and items order preferences safely from localStorage on client mount
  useEffect(() => {
    setMounted(true);
    const savedWidth = localStorage.getItem("sidebar-width");
    if (savedWidth) {
      const parsed = parseInt(savedWidth, 10);
      if (!isNaN(parsed) && parsed >= 220 && parsed <= 380) setWidth(parsed);
    }
    const savedItems = localStorage.getItem("sidebar-items-order");
    if (savedItems) {
      try {
        const parsed = JSON.parse(savedItems) as SidebarItemType[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(
            parsed.map((item) => {
              const orig = initialItems.find((i) => i.id === item.id);
              return {
                ...item,
                title: orig?.title || item.title,
                icon: orig?.icon || item.icon,
                href: orig?.href || item.href,
              };
            }),
          );
        }
      } catch (e) {
        console.error("[Sidebar Hook Error] Failed to parse items order:", e);
      }
    }
  }, []);

  // Flexibly matches active items, including nested dynamic parameters (e.g. /products/new)
  useEffect(() => {
    if (pathname) {
      const matched = items.find((item) => {
        if (item.href === "/") {
          return pathname === "/";
        }
        return pathname.startsWith(item.href);
      });
      if (matched) setActiveItemId(matched.id);
    }
  }, [pathname, items]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, type } = result;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (type === "ITEM") {
      const updated = Array.from(items);
      const [removed] = updated.splice(source.index, 1);
      updated.splice(destination.index, 0, removed);
      setItems(updated);
      localStorage.setItem("sidebar-items-order", JSON.stringify(updated));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarRef.current
      ? sidebarRef.current.getBoundingClientRect().width
      : width;
    let finalWidth = startWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      finalWidth = Math.max(
        220,
        Math.min(380, startWidth + moveEvent.clientX - startX),
      );
      setWidth(finalWidth);
    };
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      localStorage.setItem("sidebar-width", finalWidth.toString());
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleItemClick = (itemId: string) => {
    setActiveItemId(itemId);
  };

  return {
    mounted,
    width,
    items,
    activeItemId,
    sidebarRef,
    theme,
    setTheme,
    handleDragEnd,
    handleMouseDown,
    handleItemClick,
  };
};

export default useSidebar;
