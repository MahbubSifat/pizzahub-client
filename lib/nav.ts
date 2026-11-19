import {
  ClipboardList,
  Crown,
  LayoutDashboard,
  ListChecks,
  Plus,
  Receipt,
  Settings,
  ShoppingBag,
  UtensilsCrossed,
  Users,
  type LucideIcon,
} from "lucide-react";

export type DashboardRole = "vendor" | "customer" | "admin";

export type NavLink = { href: string; label: string; icon: LucideIcon };

// কিছু page পরের phase-এ বানানো হবে, তখন পর্যন্ত সেগুলোর link 404 দেখাবে
export const dashboardNav: Record<DashboardRole, NavLink[]> = {
  vendor: [
    { href: "/dashboard/vendor", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/vendor/items", label: "My Menu Items", icon: UtensilsCrossed },
    { href: "/dashboard/vendor/items/new", label: "Add Menu Item", icon: Plus },
    { href: "/dashboard/vendor/orders", label: "Customer Orders", icon: ClipboardList },
    { href: "/dashboard/vendor/subscription", label: "Subscription", icon: Crown },
    { href: "/dashboard/vendor/profile", label: "Profile Settings", icon: Settings },
  ],
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/customer/orders", label: "My Orders", icon: ShoppingBag },
    { href: "/dashboard/customer/profile", label: "Profile Settings", icon: Settings },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/menu-items", label: "Manage Menu Items", icon: ListChecks },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: Receipt },
    { href: "/dashboard/admin/profile", label: "Profile Settings", icon: Settings },
  ],
};