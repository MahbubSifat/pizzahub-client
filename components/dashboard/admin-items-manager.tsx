"use client";

import { useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Eye, EyeOff, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { CATEGORIES, type ItemStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import SearchBox from "@/components/menu/search-box";
import StatusBadge from "@/components/dashboard/status-badge";

type AdminItem = {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: ItemStatus;
  createdAt: string;
  vendor?: { name?: string; email?: string; businessName?: string };
};

type ListResponse = { items: AdminItem[]; total: number; page: number; pages: number };
type Result = { key: string; data?: ListResponse; error?: string };

const STATUS_TABS: { value: string; label: string }[] = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "inactive", label: "Hidden" },
];

export default function AdminItemsManager() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [tick, setTick] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [busyId, setBusyId] = useState("");
  const [viewing, setViewing] = useState<AdminItem | null>(null);
  const [deleting, setDeleting] = useState<AdminItem | null>(null);

  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (status) params.set("status", status);
  if (category) params.set("category", category);
  params.set("page", String(page));
  params.set("limit", "10");
  const queryString = params.toString();
  const key = `${queryString}|${tick}`;

  useEffect(() => {
    let cancelled = false;
    const requestKey = `${queryString}|${tick}`;
    apiFetch<ListResponse>(`/api/admin/menu-items?${queryString}`)
      .then((data) => {
        if (!cancelled) setResult({ key: requestKey, data });
      })
      .catch((error) => {
        if (!cancelled) {
          setResult({
            key: requestKey,
            error: error instanceof Error ? error.message : "Could not load items",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [queryString, tick]);

  async function changeStatus(item: AdminItem, next: ItemStatus, message: string) {
    setBusyId(item._id);
    try {
      await apiFetch(`/api/admin/menu-items/${item._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: next }),
      });
      toast.success(message);
      setTick((value) => value + 1);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update item");
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
      await apiFetch(`/api/admin/menu-items/${target._id}`, { method: "DELETE" });
      toast.success("Menu item deleted");
      setTick((value) => value + 1);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete item");
    } finally {
      setBusyId("");
    }
  }

  const loading = !result || result.key !== key;
  const data = !loading ? result?.data : undefined;
  const error = !loading ? result?.error : undefined;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-4 rounded-2xl border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
          <SearchBox
            placeholder="Search by item name or location..."
            onCommit={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />
          <Select
            value={category || "all"}
            onValueChange={(value) => {
              setCategory(value === "all" ? "" : (value ?? ""));
              setPage(1);
            }}
          >
            <SelectTrigger className="h-11 w-full rounded-xl">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setStatus(tab.value);
                setPage(1);
              }}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                status === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2, 3].map((index) => (
            <Skeleton key={index} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="max-w-md rounded-2xl border bg-card p-8 text-center">
          <p className="font-semibold">Could not load items</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button className="mt-5" onClick={() => setTick((value) => value + 1)}>
            Try again
          </Button>
        </div>
      ) : data && data.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
          <p className="font-heading text-xl font-semibold">No menu items found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different filter, or wait for vendors to submit items.
          </p>
        </div>
      ) : (
        data && (
          <>
            <p className="text-sm text-muted-foreground">
              {data.total} {data.total === 1 ? "item" : "items"}
            </p>
            <div className="space-y-4">
              {data.items.map((item) => {
                const busy = busyId === item._id;
                return (
                  <article
                    key={item._id}
                    className="flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center"
                  >
                    <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-secondary sm:h-24 sm:w-36">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.images[0]}
                        alt={item.itemName}
                        loading="lazy"
                        className="size-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading text-lg font-semibold">{item.itemName}</h3>
                        <StatusBadge status={item.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.category} · {item.location} · BDT {item.price.toLocaleString()}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">
                        By {item.vendor?.businessName || item.vendor?.name || "Unknown vendor"}
                        {item.vendor?.email ? ` (${item.vendor.email})` : ""}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:max-w-56 sm:justify-end">
                      <Button variant="outline" size="sm" onClick={() => setViewing(item)}>
                        <Eye className="size-4" /> View
                      </Button>
                      {(item.status === "pending" ||
                        item.status === "rejected" ||
                        item.status === "inactive") && (
                        <Button
                          size="sm"
                          disabled={busy}
                          onClick={() => changeStatus(item, "approved", "Item approved")}
                        >
                          <Check className="size-4" /> Approve
                        </Button>
                      )}
                      {item.status === "approved" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={busy}
                          onClick={() => changeStatus(item, "inactive", "Item hidden")}
                        >
                          <EyeOff className="size-4" /> Hide
                        </Button>
                      )}
                      {(item.status === "pending" || item.status === "approved") && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={busy}
                          onClick={() => changeStatus(item, "rejected", "Item rejected")}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="size-4" /> Reject
                        </Button>
                      )}
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
                  </article>
                );
              })}
            </div>

            {data.pages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((value) => value - 1)}
                >
                  <ChevronLeft className="size-4" /> Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {data.page} of {data.pages}
                </span>
                <Button
                  variant="outline"
                  disabled={page >= data.pages}
                  onClick={() => setPage((value) => value + 1)}
                >
                  Next <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </>
        )
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
    </div>
  );
}