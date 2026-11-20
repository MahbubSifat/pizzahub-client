"use client";

import { useEffect, useState } from "react";
import { Lock, Receipt } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/order-types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "@/components/dashboard/stat-card";

type Txn = {
  _id: string;
  plan: string;
  amount: number;
  currency: string;
  status: "paid" | "failed" | "pending";
  createdAt: string;
  vendor?: { name?: string; email?: string; businessName?: string };
};
type Data = {
  transactions: Txn[];
  total: number;
  pages: number;
  summary: { totalTransactions: number; totalPaid: number; currency: string };
};
type Result = { key: string; data?: Data; error?: string };

const TABS = [
  { value: "", label: "All" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "pending", label: "Pending" },
];

const STATUS_STYLE: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
};

function money(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

export default function AdminTransactions() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [tick, setTick] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

  const key = `${status}|${page}|${tick}`;

  useEffect(() => {
    let cancelled = false;
    const requestKey = `${status}|${page}|${tick}`;
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    params.set("page", String(page));

    apiFetch<Data>(`/api/admin/transactions?${params.toString()}`)
      .then((data) => {
        if (!cancelled) setResult({ key: requestKey, data });
      })
      .catch((error) => {
        if (!cancelled) {
          setResult({
            key: requestKey,
            error: error instanceof Error ? error.message : "Could not load transactions",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [status, page, tick]);

  const loading = !result || result.key !== key;
  const data = !loading ? result?.data : undefined;
  const error = !loading ? result?.error : undefined;

  return (
    <div className="space-y-6">
      {data && (
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Total transactions"
            value={data.summary.totalTransactions}
            icon="receipt"
          />
          <StatCard
            label="Total paid"
            value={money(data.summary.totalPaid, data.summary.currency)}
            icon="check"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
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
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3.5" /> Read-only. Payment records cannot be edited.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : error || !data ? (
        <div className="max-w-md rounded-2xl border bg-card p-8 text-center">
          <p className="font-semibold">Could not load transactions</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button className="mt-5" onClick={() => setTick((value) => value + 1)}>
            Try again
          </Button>
        </div>
      ) : data.transactions.length === 0 ? (
        <div className="flex max-w-lg flex-col items-center gap-3 rounded-2xl border border-dashed bg-card p-10 text-center">
          <Receipt className="size-8 text-primary" />
          <p className="font-heading text-xl font-semibold">No transactions yet</p>
          <p className="text-sm text-muted-foreground">
            Premium payments from vendors will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.transactions.map((txn) => (
            <article
              key={txn._id}
              className="grid gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-[1.5fr_1fr_1fr_1fr_auto] sm:items-center"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {txn.vendor?.businessName || txn.vendor?.name || "Unknown vendor"}
                </p>
                <p className="truncate text-sm text-muted-foreground">{txn.vendor?.email}</p>
              </div>
              <p className="text-sm capitalize">
                <span className="text-muted-foreground sm:hidden">Plan: </span>
                {txn.plan}
              </p>
              <p className="text-sm font-semibold">{money(txn.amount, txn.currency)}</p>
              <p className="text-sm text-muted-foreground">{formatDateTime(txn.createdAt)}</p>
              <span
                className={cn(
                  "w-fit rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                  STATUS_STYLE[txn.status]
                )}
              >
                {txn.status}
              </span>
            </article>
          ))}

          <div className="flex items-center justify-between pt-2 text-sm">
            <span className="text-muted-foreground">
              Page {page} of {data.pages} · {data.total} records
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((value) => value - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.pages}
                onClick={() => setPage((value) => value + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}