"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Check, ClipboardList, MapPin, MessageSquare, User, X } from "lucide-react";
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
import { Button } from "@/components/ui/button";
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
import OrderStatusBadge from "@/components/dashboard/order-status-badge";

type Result = { key: string; orders?: Order[]; error?: string };

export default function VendorOrders() {
  const [tab, setTab] = useState<"" | OrderStatus>("");
  const [tick, setTick] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [rejecting, setRejecting] = useState<Order | null>(null);
  const [busyId, setBusyId] = useState("");

  const key = String(tick);

  useEffect(() => {
    let cancelled = false;
    apiFetch<{ orders: Order[] }>("/api/vendor/orders")
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

  async function decide(order: Order, status: "accepted" | "rejected") {
    setBusyId(order._id);
    try {
      await apiFetch(`/api/vendor/orders/${order._id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(status === "accepted" ? "Order accepted" : "Order rejected");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the order");
    } finally {
      setBusyId("");
      setTick((value) => value + 1);
    }
  }

  const loading = !result || result.key !== key;
  const orders = !loading ? result?.orders : undefined;
  const error = !loading ? result?.error : undefined;

  if (loading) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} className="h-40 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md rounded-2xl border bg-card p-8 text-center">
        <p className="font-semibold">Could not load orders</p>
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
          <ClipboardList className="size-6 text-primary" />
        </span>
        <div>
          <p className="font-heading text-xl font-semibold">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            When customers order your items, they will appear here.
          </p>
        </div>
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
          {visible.map((order) => {
            const busy = busyId === order._id;
            return (
              <article
                key={order._id}
                className="flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:flex-row"
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

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-lg font-semibold">
                      {order.item?.itemName ?? "Item no longer available"}
                    </h3>
                    <OrderStatusBadge status={order.status} />
                    {order.item && (
                      <span className="text-sm font-medium text-primary">
                        BDT {order.item.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="flex items-center gap-1.5 text-sm">
                    <User className="size-3.5 text-muted-foreground" />
                    <span className="font-medium">{order.customer?.name ?? "Customer"}</span>
                    <span className="truncate text-muted-foreground">
                      {order.customer?.email}
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CalendarDays className="size-3.5" />
                    Delivery {formatDate(order.deliveryDate)} · Requested{" "}
                    {formatDateTime(order.createdAt)}
                  </p>
                  <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 size-3.5 shrink-0" /> {order.deliveryAddress}
                  </p>
                  {order.message && (
                    <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                      <MessageSquare className="mt-0.5 size-3.5 shrink-0" /> {order.message}
                    </p>
                  )}
                </div>

                {order.status === "pending" && (
                  <div className="flex gap-2 sm:flex-col sm:justify-center">
                    <Button size="sm" disabled={busy} onClick={() => decide(order, "accepted")}>
                      <Check className="size-4" /> Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={busy}
                      onClick={() => setRejecting(order)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="size-4" /> Reject
                    </Button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <AlertDialog open={!!rejecting} onOpenChange={(open) => !open && setRejecting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this order?</AlertDialogTitle>
            <AlertDialogDescription>
              The customer will see the order as rejected. This cannot be changed later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go back</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (rejecting) decide(rejecting, "rejected");
                setRejecting(null);
              }}
            >
              Reject order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}