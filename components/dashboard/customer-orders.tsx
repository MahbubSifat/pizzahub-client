"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Eye, MapPin, ShoppingBag, Store, XCircle } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  ORDER_TABS,
  formatDate,
  formatDateTime,
  type Order,
  type OrderStatus,
} from "@/lib/order-types";
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
import OrderStatusBadge from "@/components/dashboard/order-status-badge";
import OrderTimeline from "@/components/dashboard/order-timeline";

type Result = { key: string; orders?: Order[]; error?: string };

export default function CustomerOrders() {
  const [tab, setTab] = useState<"" | OrderStatus>("");
  const [tick, setTick] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [viewing, setViewing] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState<Order | null>(null);
  const [busyId, setBusyId] = useState("");

  const key = String(tick);

  useEffect(() => {
    let cancelled = false;
    apiFetch<{ orders: Order[] }>("/api/orders/mine")
      .then((data) => {
        if (!cancelled) setResult({ key: String(tick), orders: data.orders });
      })
      .catch((error) => {
        if (!cancelled) {
          setResult({
            key: String(tick),
            error: error instanceof Error ? error.message : "Could not load orders",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  async function confirmCancel() {
    if (!cancelling) return;
    const target = cancelling;
    setCancelling(null);
    setBusyId(target._id);
    try {
      await apiFetch(`/api/orders/${target._id}/cancel`, { method: "PATCH" });
      toast.success("Order cancelled");
      setTick((value) => value + 1);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not cancel the order");
      setTick((value) => value + 1);
    } finally {
      setBusyId("");
    }
  }

  const loading = !result || result.key !== key;
  const orders = !loading ? result?.orders : undefined;
  const error = !loading ? result?.error : undefined;

  if (loading) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} className="h-32 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md rounded-2xl border bg-card p-8 text-center">
        <p className="font-semibold">Could not load your orders</p>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        <Button className="mt-5" onClick={() => setTick((value) => value + 1)}>
          Try again
        </Button>
      </div>
    );
  }

  const all = orders ?? [];
  const visible = tab ? all.filter((order) => order.status === tab) : all;

  if (all.length === 0) {
    return (
      <div className="flex max-w-lg flex-col items-center gap-4 rounded-2xl border border-dashed bg-card p-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary">
          <ShoppingBag className="size-6 text-primary" />
        </span>
        <div>
          <p className="font-heading text-xl font-semibold">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse the menu and place your first order.
          </p>
        </div>
        <Link href="/menu" className={buttonVariants()}>
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {ORDER_TABS.map((option) => {
          const count = option.value
            ? all.filter((order) => order.status === option.value).length
            : all.length;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setTab(option.value)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                tab === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label} ({count})
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
          No orders with this status.
        </p>
      ) : (
        <div className="space-y-4">
          {visible.map((order) => (
            <article
              key={order._id}
              className="flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center"
            >
              <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-secondary sm:h-24 sm:w-36">
                {order.item?.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={order.item.images[0]}
                    alt={order.item.itemName}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading text-lg font-semibold">
                    {order.item?.itemName ?? "Item no longer available"}
                  </h3>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Store className="size-3.5" />
                  {order.vendor?.businessName || order.vendor?.name || "Restaurant"}
                </p>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarDays className="size-3.5" />
                  Delivery {formatDate(order.deliveryDate)} · Requested{" "}
                  {formatDateTime(order.createdAt)}
                </p>
                <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" />
                  <span className="truncate">{order.deliveryAddress}</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2 sm:flex-col">
                <Button variant="outline" size="sm" onClick={() => setViewing(order)}>
                  <Eye className="size-4" /> Details
                </Button>
                {order.status === "pending" && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busyId === order._id}
                    onClick={() => setCancelling(order)}
                    className="text-destructive hover:text-destructive"
                  >
                    <XCircle className="size-4" /> Cancel
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Details */}
      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl">
                  {viewing.item?.itemName ?? "Item no longer available"}
                </DialogTitle>
                <DialogDescription>
                  {viewing.vendor?.businessName || viewing.vendor?.name || "Restaurant"}
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-between">
                {viewing.item && (
                  <span className="text-lg font-semibold text-primary">
                    BDT {viewing.item.price.toLocaleString()}
                  </span>
                )}
                <OrderStatusBadge status={viewing.status} />
              </div>
              <dl className="space-y-3 rounded-xl border bg-secondary/40 p-4 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Delivery date</dt>
                  <dd className="font-medium">{formatDate(viewing.deliveryDate)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Delivery address</dt>
                  <dd className="font-medium">{viewing.deliveryAddress}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Your message</dt>
                  <dd className="font-medium">{viewing.message || "No special instructions"}</dd>
                </div>
              </dl>
              <div>
                <p className="mb-3 text-sm font-semibold">Order progress</p>
                <OrderTimeline order={viewing} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel confirmation */}
      <AlertDialog open={!!cancelling} onOpenChange={(open) => !open && setCancelling(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
            <AlertDialogDescription>
              Your order for &quot;{cancelling?.item?.itemName}&quot; will be cancelled. You can
              place a new order any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep order</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>Cancel order</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}