"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { buttonVariants } from "@/components/ui/button";

type State = "checking" | "confirmed" | "delayed" | "error";

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [state, setState] = useState<State>(sessionId ? "checking" : "error");
  const [message, setMessage] = useState(sessionId ? "" : "No payment session was found.");

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    // Success redirect কিছু চালু করে না; শুধু webhook-এর নিশ্চিতকরণ দেখা হয়
    async function check() {
      try {
        const data = await apiFetch<{ confirmed: boolean }>(
          `/api/payments/session/${encodeURIComponent(sessionId as string)}`
        );
        if (cancelled) return;
        if (data.confirmed) {
          setState("confirmed");
          return;
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error instanceof Error ? error.message : "Could not confirm the payment");
          setState("error");
        }
        return;
      }
      attempts += 1;
      if (attempts >= 10) {
        if (!cancelled) setState("delayed");
        return;
      }
      timer = setTimeout(check, 2000);
    }

    check();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [sessionId]);

  return (
    <div className="mx-auto max-w-lg rounded-3xl border bg-card p-10 text-center shadow-sm">
      {state === "checking" && (
        <>
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-secondary">
            <Loader2 className="size-8 animate-spin text-primary" />
          </span>
          <h1 className="mt-6 font-heading text-3xl font-semibold">Confirming your payment</h1>
          <p className="mt-2 text-muted-foreground">
            Please wait a moment while Stripe confirms your payment.
          </p>
        </>
      )}

      {state === "confirmed" && (
        <>
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
            <CheckCircle2 className="size-9 text-emerald-600" />
          </span>
          <h1 className="mt-6 font-heading text-3xl font-semibold">You are Premium now</h1>
          <p className="mt-2 text-muted-foreground">
            Payment confirmed. You can now publish unlimited menu items, and your items get the
            Premium badge and featured placement.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard/vendor/items/new" className={buttonVariants()}>
              Add menu item
            </Link>
            <Link
              href="/dashboard/vendor/subscription"
              className={buttonVariants({ variant: "outline" })}
            >
              View subscription
            </Link>
          </div>
        </>
      )}

      {state === "delayed" && (
        <>
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/15">
            <Clock className="size-8 text-amber-600" />
          </span>
          <h1 className="mt-6 font-heading text-3xl font-semibold">Still processing</h1>
          <p className="mt-2 text-muted-foreground">
            Stripe has not confirmed the payment yet. Your plan will update automatically as soon
            as it does. Check your subscription page in a minute.
          </p>
          <Link
            href="/dashboard/vendor/subscription"
            className={buttonVariants({ className: "mt-8" })}
          >
            Go to subscription
          </Link>
        </>
      )}

      {state === "error" && (
        <>
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/15">
            <AlertTriangle className="size-8 text-destructive" />
          </span>
          <h1 className="mt-6 font-heading text-3xl font-semibold">Could not confirm</h1>
          <p className="mt-2 text-muted-foreground">{message}</p>
          <Link
            href="/dashboard/vendor/subscription"
            className={buttonVariants({ className: "mt-8" })}
          >
            Go to subscription
          </Link>
        </>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <Suspense fallback={null}>
        <SuccessContent />
      </Suspense>
    </section>
  );
}