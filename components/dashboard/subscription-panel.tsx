"use client";

import { useEffect, useState } from "react";
import { Check, Crown, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/order-types";
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

type Status = {
  plan: "free" | "premium";
  isPremium: boolean;
  expiresAt: string | null;
  cancelAtPeriodEnd: boolean;
  activeItems: number;
  freeLimit: number;
  price: { amount: number; currency: string; interval: string };
};

type Result = { key: string; status?: Status; error?: string };

const FREE_FEATURES = [
  "Up to 3 active menu items",
  "Basic vendor dashboard",
  "Order management",
];
const PREMIUM_FEATURES = [
  "Unlimited active menu items",
  "Premium vendor badge",
  "Featured menu placement",
  "Everything in Free",
];

export default function SubscriptionPanel() {
  const [tick, setTick] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState<"" | "upgrade" | "cancel" | "resume">("");
  const [confirmCancel, setConfirmCancel] = useState(false);

  const key = String(tick);

  useEffect(() => {
    let cancelled = false;
    apiFetch<Status>("/api/payments/status")
      .then((status) => {
        if (!cancelled) setResult({ key: String(tick), status });
      })
      .catch((error) => {
        if (!cancelled) {
          setResult({
            key: String(tick),
            error: error instanceof Error ? error.message : "Could not load your plan",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  async function upgrade() {
    setBusy("upgrade");
    try {
      const data = await apiFetch<{ url: string }>("/api/payments/checkout-session", {
        method: "POST",
      });
      window.location.assign(data.url); // Stripe-এর পাতায়
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start checkout");
      setBusy("");
    }
  }

  async function changeRenewal(action: "cancel" | "resume") {
    setBusy(action);
    try {
      await apiFetch(`/api/payments/${action}`, { method: "POST" });
      toast.success(
        action === "cancel"
          ? "Renewal cancelled. Premium stays active until the period ends."
          : "Great, your Premium plan will keep renewing."
      );
      setTick((value) => value + 1);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusy("");
    }
  }

  const loading = !result || result.key !== key;
  const status = !loading ? result?.status : undefined;
  const error = !loading ? result?.error : undefined;

  if (loading) {
    return (
      <div className="grid max-w-4xl gap-6 md:grid-cols-2">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="max-w-md rounded-2xl border bg-card p-8 text-center">
        <p className="font-semibold">Could not load your plan</p>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        <Button className="mt-5" onClick={() => setTick((value) => value + 1)}>
          Try again
        </Button>
      </div>
    );
  }

  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: status.price.currency.toUpperCase(),
  }).format(status.price.amount);
  const usedPercent = Math.min(100, Math.round((status.activeItems / status.freeLimit) * 100));

  return (
    <div className="max-w-4xl space-y-8">
      {/* বর্তমান অবস্থা */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-5">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-11 items-center justify-center rounded-xl",
              status.isPremium ? "bg-primary text-primary-foreground" : "bg-secondary"
            )}
          >
            <Crown className="size-5" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Current plan</p>
            <p className="font-heading text-xl font-semibold">
              {status.isPremium ? "Premium" : "Free"}
            </p>
          </div>
        </div>
        {status.isPremium && status.expiresAt && (
          <p className="text-sm text-muted-foreground">
            {status.cancelAtPeriodEnd ? "Ends on " : "Renews on "}
            <span className="font-medium text-foreground">{formatDate(status.expiresAt)}</span>
          </p>
        )}
      </div>

      {!status.isPremium && (
        <div className="space-y-2 rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Active menu items</span>
            <span className="text-muted-foreground">
              {status.activeItems} / {status.freeLimit}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                usedPercent >= 100 ? "bg-destructive" : "bg-primary"
              )}
              style={{ width: `${usedPercent}%` }}
            />
          </div>
          {status.activeItems >= status.freeLimit && (
            <p className="text-xs text-muted-foreground">
              You have reached the Free plan limit. Upgrade to add more items.
            </p>
          )}
        </div>
      )}

      {/* Plan কার্ড */}
      <div className="grid gap-6 md:grid-cols-2">
        <article
          className={cn(
            "flex flex-col rounded-2xl border bg-card p-6",
            !status.isPremium && "ring-2 ring-primary/30"
          )}
        >
          <h2 className="font-heading text-2xl font-semibold">Free</h2>
          <p className="mt-1 text-3xl font-semibold">
            $0 <span className="text-sm font-normal text-muted-foreground">/ forever</span>
          </p>
          <ul className="mt-6 flex-1 space-y-3 text-sm">
            {FREE_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" /> {feature}
              </li>
            ))}
          </ul>
          <Button variant="outline" disabled className="mt-6 h-11 rounded-xl">
            {status.isPremium ? "Free plan" : "Current plan"}
          </Button>
        </article>

        <article
          className={cn(
            "relative flex flex-col rounded-2xl border-2 border-primary bg-card p-6 shadow-lg shadow-primary/10"
          )}
        >
          <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            <Sparkles className="size-3" /> Recommended
          </span>
          <h2 className="font-heading text-2xl font-semibold">Premium</h2>
          <p className="mt-1 text-3xl font-semibold">
            {price}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              / {status.price.interval}
            </span>
          </p>
          <ul className="mt-6 flex-1 space-y-3 text-sm">
            {PREMIUM_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {feature}
              </li>
            ))}
          </ul>

          {status.isPremium ? (
            status.cancelAtPeriodEnd ? (
              <Button
                className="mt-6 h-11 rounded-xl"
                disabled={busy !== ""}
                onClick={() => changeRenewal("resume")}
              >
                {busy === "resume" ? <Loader2 className="size-4 animate-spin" /> : null}
                Keep Premium
              </Button>
            ) : (
              <Button
                variant="outline"
                className="mt-6 h-11 rounded-xl"
                disabled={busy !== ""}
                onClick={() => setConfirmCancel(true)}
              >
                Cancel renewal
              </Button>
            )
          ) : (
            <Button className="mt-6 h-11 rounded-xl text-base" disabled={busy !== ""} onClick={upgrade}>
              {busy === "upgrade" ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Redirecting to Stripe...
                </>
              ) : (
                <>
                  <Crown className="size-4" /> Upgrade to Premium
                </>
              )}
            </Button>
          )}
        </article>
      </div>

      <p className="text-xs text-muted-foreground">
        Payments are processed securely by Stripe. Premium is activated only after Stripe confirms
        your payment. In test mode use card 4242 4242 4242 4242 with any future date and any CVC.
      </p>

      <AlertDialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Premium renewal?</AlertDialogTitle>
            <AlertDialogDescription>
              You keep Premium until the end of the current period
              {status.expiresAt ? ` (${formatDate(status.expiresAt)})` : ""}. After that your
              account returns to the Free plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Premium</AlertDialogCancel>
            <AlertDialogAction onClick={() => changeRenewal("cancel")}>
              Cancel renewal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}