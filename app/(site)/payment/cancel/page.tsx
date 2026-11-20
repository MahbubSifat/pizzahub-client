import Link from "next/link";
import { XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-lg rounded-3xl border bg-card p-10 text-center shadow-sm">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-secondary">
          <XCircle className="size-9 text-muted-foreground" />
        </span>
        <h1 className="mt-6 font-heading text-3xl font-semibold">Payment cancelled</h1>
        <p className="mt-2 text-muted-foreground">
          No charge was made and your plan has not changed. You can upgrade any time.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard/vendor/subscription" className={buttonVariants()}>
            Back to subscription
          </Link>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Go home
          </Link>
        </div>
      </div>
    </section>
  );
}