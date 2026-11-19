"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardNav, type DashboardRole } from "@/lib/nav";
import Logo from "@/components/logo";
import UserMenu from "@/components/user-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Props = {
  user: { name: string; email: string; image?: string | null; role: DashboardRole };
  children: React.ReactNode;
};

function SidebarBody({ role, onNavigate }: { role: DashboardRole; onNavigate?: () => void }) {
  const pathname = usePathname();
  const links = dashboardNav[role];

  // সবচেয়ে লম্বা মিলে যাওয়া link-টাই active (যাতে /items আর /items/new একসাথে জ্বলে না)
  const activeHref = links
    .filter((link) => pathname === link.href || pathname.startsWith(link.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <div className="flex h-full flex-col gap-6 p-5">
      <Logo />
      <p className="px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {role} panel
      </p>
      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === activeHref;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <Link
        href="/"
        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to website
      </Link>
    </div>
  );
}

export default function DashboardShell({ user, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-card lg:block">
        <SidebarBody role={user.role} />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b bg-background/85 px-5 backdrop-blur lg:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open sidebar"
              className="flex size-10 items-center justify-center rounded-xl border bg-card lg:hidden"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Dashboard navigation</SheetTitle>
              </SheetHeader>
              <SidebarBody role={user.role} onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="ml-auto">
            <UserMenu
              name={user.name}
              email={user.email}
              image={user.image}
              role={user.role}
            />
          </div>
        </header>

        <div className="p-5 lg:p-8">{children}</div>
      </div>
    </div>
  );
}