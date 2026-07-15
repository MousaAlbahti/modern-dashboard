import { ComponentType } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  details: Record<string, unknown>;
  created: string;
  verified: boolean;
  collectionId?: string;
  collectionName?: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  collectionId: string;
  collectionName: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  images: string[];
  tags: string[];
  created: string;
  expand?: {
    tags?: Tag[];
  };
}

export interface Order {
  id: string;
  user: string;
  products: string[];
  status: "pending" | "shipped" | "delivered";
  total_price: number;
  created: string;
  expand?: {
    user?: User;
    products?: Product[];
  };
}

export interface SidebarItem {
  id: string;
  title: string;
  href: string;
  icon: string;
}

export interface SidebarSection {
  id: string;
  title: string;
  items: SidebarItem[];
}

export interface StatItem {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: ComponentType<{ className?: string }>;
  color: string;
}
