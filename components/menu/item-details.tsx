"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Info, MapPin, ShoppingBag, Store } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatPrice, vendorLabel, type PublicMenuItem } from "@/lib/menu-types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PremiumBadge from "@/components/menu/premium-badge";

type Props = { id: string; role: string; userId: string };
type Result = { id: string; item?: PublicMenuItem; error?: string; status?: number };

export default function ItemDetails({ id, role, userId }: Props) {
  const [result, setResult] = useState<Result | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;
    apiFetch<{ item: PublicMenuItem }>(`/api/menu-items/${id}`)
      .then((data) => {
        if (!cancelled) setResult({ id, item: data.item });
      })
      .catch((error) => {
        if (!cancelled) {
          setResult({
            id,
            error: error instanceof Error ? error.message : "Could not load this item",
            status: error instanceof ApiError ? error.status : 0,
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const loading = !result || result.id !== id;

  if (loading) {
    return (
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-3">
          <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
          <div className="flex gap-3">
            <Skeleton className="h-20 w-28 rounded-xl" />
            <Skeleton className="h-20 w-28 rounded-xl" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!result?.item) {
    const invalid = result?.status === 400;
    const missing = result?.status === 404;
    return (
      <div className="mx-auto max-w-md rounded-2xl border bg-card p-10 text-center">
        <p className="font-heading text-2xl font-semibold">
          {invalid
            ? "Invalid item link"
            : missing
              ? "Item not found"
              : "Could not load this item"}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {invalid
            ? "This link does not point to a valid menu item."
            : missing
              ? "This item does not exist or is no longer available."
              : result?.error}
        </p>
        <Link href="/menu" className={buttonVariants({ className: "mt-6" })}>
          Back to menu
        </Link>
      </div>
    );
  }

  const item = result.item;
  const ownItem = item.vendor._id === userId;

  let orderNote: string | null = null;
  if (role === "vendor") {
    orderNote = ownItem
      ? "You cannot order your own menu item."
      : "Restaurant accounts cannot place orders. Sign in as a customer to order.";
  } else if (role === "admin") {
    orderNote = "Admins cannot place customer orders.";
  }

  return (
    <div className="space-y-8">
      <Link
        href="/menu"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Back to menu
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border bg-secondary">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.images[active] ?? item.images[0]}
              alt={item.itemName}
              className="size-full object-cover"
            />
          </div>
          {item.images.length > 1 && (
            <div className="flex flex-wrap gap-3">
              {item.images.map((url, index) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show image ${index + 1}`}
                  className={cn(
                    "h-20 w-28 overflow-hidden rounded-xl border-2 transition-all",
                    index === active
                      ? "border-primary"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {item.category}
              </span>
              {item.isPremiumVendor && <PremiumBadge />}
            </div>
            <h1 className="font-heading text-4xl font-semibold tracking-tight">
              {item.itemName}
            </h1>
            <p className="text-3xl font-semibold text-primary">{formatPrice(item.price)}</p>
          </div>

          <div className="grid gap-3 rounded-2xl border bg-card p-4 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-secondary">
                <Store className="size-4 text-primary" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Restaurant</p>
                <p className="font-medium">{vendorLabel(item.vendor)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-secondary">
                <MapPin className="size-4 text-primary" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium">{item.location}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-xl font-semibold">About this item</h2>
            <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
              {item.description}
            </p>
          </div>

          {/* Order */}
          <div className="space-y-3 rounded-2xl border bg-card p-5">
            {orderNote ? (
              <p className="flex items-start gap-2 text-sm text-muted-foreground">
                <Info className="mt-0.5 size-4 shrink-0" /> {orderNote}
              </p>
            ) : (
              <>
                <Button size="lg" disabled className="h-12 w-full rounded-xl text-base">
                  <ShoppingBag className="size-5" /> Order Now
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  The order form is added in the next build step.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}