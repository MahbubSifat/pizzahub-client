"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Crown, Eye, EyeOff, MapPin, Pencil, Plus, Trash2, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import {
  FREE_PLAN_ITEM_LIMIT,
  STATUS_STYLES,
  type MenuItem,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function StatusBadge({ status }: { status: MenuItem["status"] }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        style.className
      )}
    >
      {style.label}
    </span>
  );
}

export default function VendorItemsList() {
  const [items, setItems] = useState<MenuItem[] | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [error, setError] = useState("");
  const [viewing, setViewing] = useState<MenuItem | null>(null);
  const [deleting, setDeleting] = useState<MenuItem | null>(null);
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const [list, me] = await Promise.all([
        apiFetch<{ items: MenuItem[] }>("/api/vendor/menu-items"),
        apiFetch<{ user: { isPremium: boolean } }>("/api/me"),
      ]);
      setItems(list.items);
      setIsPremium(me.user.isPremium);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load items");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleAvailability(item: MenuItem) {
    setBusyId(item._id);
    try {
      await apiFetch(`/api/vendor/menu-items/${item._id}/availability`, {
        method: "PATCH",
        body: JSON.stringify({ available: item.status !== "approved" }),
      });
      toast.success(item.status === "approved" ? "Item hidden" : "Item is visible again");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update item");
    } finally {
      setBusyId("");
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    const target = deleting;
    setDeleting(null);
    setBusyId(target._id);
    try {
      await apiFetch(`/api/vendor/menu-items/${target._id}`, { method: "DELETE" });
      toast.success("Menu item deleted");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete item");
    } finally {
      setBusyId("");
    }
  }

  if (error) {
    return (
      <div className="max-w-md rounded-2xl border bg-card p-8 text-center">
        <p className="font-semibold">Could not load your menu items</p>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        <Button className="mt-5" onClick={load}>
          Try again
        </Button>
      </div>
    );
  }

  if (!items) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((key) => (
          <div key={key} className="overflow-hidden rounded-2xl border bg-card">
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const activeCount = items.filter(
    (item) => item.status === "pending" || item.status === "approved"
  ).length;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border bg-card p-4">
        {isPremium ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1.5 text-sm font-semibold text-accent">
            <Crown className="size-4" /> Premium: unlimited active items
          </span>
        ) : (
          <>
            <span className="text-sm font-medium">
              Free plan: {activeCount} of {FREE_PLAN_ITEM_LIMIT} active items used
            </span>
            <div className="h-2 w-32 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${Math.min((activeCount / FREE_PLAN_ITEM_LIMIT) * 100, 100)}%`,
                }}
              />
            </div>
            <Link
              href="/dashboard/vendor/subscription"
              className="ml-auto text-sm font-medium text-primary hover:underline"
            >
              Upgrade to Premium
            </Link>
          </>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex max-w-lg flex-col items-center gap-4 rounded-2xl border border-dashed bg-card p-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary">
            <UtensilsCrossed className="size-6 text-primary" />
          </span>
          <div>
            <p className="font-heading text-xl font-semibold">No menu items yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first pizza. It goes live after an admin approves it.
            </p>
          </div>
          <Link href="/dashboard/vendor/items/new" className={buttonVariants()}>
            Add your first item
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const canToggle =
              item.status === "approved" ||
              (item.status === "inactive" && item.inactiveBy === "vendor");
            const busy = busyId === item._id;
            return (
              <article
                key={item._id}
                className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/3] bg-secondary">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.images[0]}
                    alt={item.itemName}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={item.status} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="space-y-1">
                    <h3 className="line-clamp-1 font-heading text-lg font-semibold">
                      {item.itemName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-primary">
                      BDT {item.price.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="size-3.5" /> {item.location}
                    </span>
                  </div>
                  <div className="mt-auto grid grid-cols-2 gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => setViewing(item)}>
                      <Eye className="size-4" /> Details
                    </Button>
                    <Link
                      href={`/dashboard/vendor/items/${item._id}/edit`}
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                      <Pencil className="size-4" /> Edit
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!canToggle || busy}
                      onClick={() => toggleAvailability(item)}
                      title={
                        canToggle
                          ? undefined
                          : "Only approved items can be hidden or shown"
                      }
                    >
                      {item.status === "approved" ? (
                        <>
                          <EyeOff className="size-4" /> Hide
                        </>
                      ) : (
                        <>
                          <Eye className="size-4" /> Show
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={busy}
                      onClick={() => setDeleting(item)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" /> Delete
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Details */}
      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl">{viewing.itemName}</DialogTitle>
                <DialogDescription>
                  {viewing.category} · {viewing.location}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-2">
                {viewing.images.map((url) => (
                  <div key={url} className="aspect-[4/3] overflow-hidden rounded-xl bg-secondary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={viewing.itemName} className="size-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-primary">
                  BDT {viewing.price.toLocaleString()}
                </span>
                <StatusBadge status={viewing.status} />
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                {viewing.description}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this menu item?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deleting?.itemName}&quot; will be removed permanently. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function AddItemButton() {
  return (
    <Link href="/dashboard/vendor/items/new" className={buttonVariants()}>
      <Plus className="size-4" /> Add Menu Item
    </Link>
  );
}