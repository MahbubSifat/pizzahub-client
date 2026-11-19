export const CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
] as const;

export const FREE_PLAN_ITEM_LIMIT = 3;

export type ItemStatus = "pending" | "approved" | "rejected" | "inactive";

export const STATUS_STYLES: Record<ItemStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending review",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
  },
  inactive: {
    label: "Hidden",
    className: "bg-stone-200 text-stone-700 dark:bg-stone-500/20 dark:text-stone-300",
  },
};

export type MenuItem = {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: ItemStatus;
  inactiveBy?: "vendor" | "admin";
  createdAt: string;
};