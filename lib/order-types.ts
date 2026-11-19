export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";

export const ORDER_STATUS_STYLES: Record<OrderStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  },
  accepted: {
    label: "Accepted",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-stone-200 text-stone-700 dark:bg-stone-500/20 dark:text-stone-300",
  },
};

export const ORDER_TABS: { value: "" | OrderStatus; label: string }[] = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

export type Order = {
  _id: string;
  deliveryDate: string;
  deliveryAddress: string;
  message: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  item?: { _id: string; itemName: string; images: string[]; price: number; category: string };
  vendor?: { name?: string; businessName?: string };
  customer?: { name?: string; email?: string };
};

// Delivery date UTC midnight হিসেবে সংরক্ষিত, তাই UTC-তেই দেখাতে হয় (নইলে এক দিন সরে যেতে পারে)
export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// আজকের তারিখ (আপনার নিজের সময় অনুযায়ী), date input-এর min-এর জন্য
export function todayLocal() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}