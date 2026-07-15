"use client";

import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Sun, Moon, LogOut, GripVertical } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import SidebarItem from "./SidebarItem";
import BrandColorPicker from "./BrandColorPicker";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

export const Sidebar = () => {
  const {
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
  } = useSidebar();

  const { user, logout } = useAuth();

  const getInitials = () => {
    if (!user) return "AD";
    if ("name" in user && user.name) {
      const parts = user.name.split(" ");
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return user.name.slice(0, 2).toUpperCase();
    }
    return user.email.slice(0, 2).toUpperCase();
  };

  if (!mounted)
    return (
      <div
        className="h-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 animate-pulse shrink-0"
        style={{ width }}
      />
    );

  return (
    <div
      ref={sidebarRef}
      style={{ width }}
      className="h-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col gap-6 relative select-none shrink-0"
    >
      <div className="flex items-center gap-3 px-3 py-2 border-b border-zinc-100 dark:border-zinc-900 pb-4">
        <div className="h-5 w-5 rounded-full border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-zinc-900 dark:bg-zinc-100 animate-pulse" />
        </div>
        <span className="font-bold text-zinc-900 dark:text-zinc-50 tracking-tight text-sm">
          MOUSAdash
        </span>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sidebar-items" type="ITEM">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex-1 flex flex-col gap-1.5 overflow-y-auto pr-1"
            >
              {items.map((item, idx) => (
                <Draggable key={item.id} draggableId={item.id} index={idx}>
                  {(prov, snap) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      className={`relative flex items-center group/item w-full pl-6 ${snap.isDragging ? "bg-zinc-50 dark:bg-zinc-900/60 rounded-lg shadow-sm" : ""}`}
                    >
                      <div
                        {...prov.dragHandleProps}
                        className="absolute left-1 p-1 text-zinc-300 dark:text-zinc-700 hover:text-zinc-500 dark:hover:text-zinc-400 opacity-0 group-hover/item:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                      >
                        <GripVertical className="h-3.5 w-3.5" />
                      </div>
                      <SidebarItem
                        item={item}
                        isActive={activeItemId === item.id}
                        onClick={() => handleItemClick(item.id)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="mt-auto border-t border-zinc-200 dark:border-zinc-900 pt-4 flex flex-col gap-4">
        <BrandColorPicker />
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/60">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Theme
          </span>
          <div className="flex items-center gap-0.5 bg-zinc-200/50 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-300/30 dark:border-zinc-800">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setTheme("light")}
              className={`p-1 rounded-md transition-all duration-150 ${theme === "light" ? "bg-white text-zinc-950 shadow-sm hover:bg-white" : "text-zinc-400 dark:text-zinc-500 hover:bg-transparent"}`}
            >
              <Sun className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setTheme("dark")}
              className={`p-1 rounded-md transition-all duration-150 ${theme === "dark" ? "bg-zinc-950 text-white shadow-sm border border-zinc-800 hover:bg-zinc-950" : "text-zinc-400 dark:text-zinc-500 hover:bg-transparent"}`}
            >
              <Moon className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center text-zinc-800 dark:text-zinc-200 font-semibold text-xs border border-zinc-300/40 dark:border-zinc-800 shadow-sm">
              {getInitials()}
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 leading-none">
                {user
                  ? "name" in user && user.name
                    ? user.name
                    : user.email
                  : "Alexander Wright"}
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-none mt-1">
                {user && "role" in user
                  ? user.role === "admin"
                    ? "Administrator"
                    : "User"
                  : "Administrator"}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={logout}
            className="text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        onMouseDown={handleMouseDown}
        className="absolute top-0 right-0 w-[5px] h-full cursor-col-resize hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors select-none group"
      >
        <div className="w-[1.5px] h-full bg-zinc-200 dark:bg-zinc-900 mx-auto transition-all group-hover:w-[2px] group-hover:bg-zinc-300 dark:group-hover:bg-zinc-800" />
      </div>
    </div>
  );
};

export default Sidebar;
