"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import Logo from "@/components/logo";
import UserMenu from "@/components/user-menu";
import ThemeToggle from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Browse Menu" },
];

const roleLinks: Record<string, { href: string; label: string }> = {
  vendor: { href: "/dashboard/vendor/items", label: "My Menu Items" },
  customer: { href: "/dashboard/customer/orders", label: "My Orders" },
  admin: { href: "/dashboard/admin/users", label: "Manage Users" },
};

export default function Navbar() {
  const pathname = usePathname();
  const { data, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);

  const user = data?.user as
    | { name: string; email: string; image?: string | null; role?: string }
    | undefined;
  const role = user?.role ?? "customer";

  const links = user
    ? [...publicLinks, ...(roleLinks[role] ? [roleLinks[role]] : [])]
    : publicLinks;

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            {isPending ? (
              <div className="h-9 w-28 animate-pulse rounded-full bg-secondary" />
            ) : user ? (
              <UserMenu name={user.name} email={user.email} image={user.image} role={role} />
            ) : (
              <>
                <Link href="/sign-in" className={buttonVariants({ variant: "ghost" })}>
                  Sign In
                </Link>
                <Link href="/sign-up" className={buttonVariants()}>
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            {!isPending && user && (
              <UserMenu name={user.name} email={user.email} image={user.image} role={role} />
            )}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                aria-label="Open menu"
                className="flex size-10 items-center justify-center rounded-xl border bg-card"
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-xl px-3 py-3 text-base font-medium",
                        isActive(link.href)
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-secondary"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {!user && !isPending && (
                    <div className="mt-4 grid gap-2">
                      <Link
                        href="/sign-in"
                        onClick={() => setOpen(false)}
                        className={buttonVariants({ variant: "outline" })}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/sign-up"
                        onClick={() => setOpen(false)}
                        className={buttonVariants()}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}