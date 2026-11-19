import { Check, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateTime, type Order } from "@/lib/order-types";

type Step = { label: string; time?: string; state: "done" | "current" | "failed" };

export default function OrderTimeline({ order }: { order: Order }) {
  const steps: Step[] = [{ label: "Order placed", time: order.createdAt, state: "done" }];

  if (order.status === "pending") {
    steps.push({ label: "Waiting for the restaurant to respond", state: "current" });
  } else if (order.status === "accepted") {
    steps.push({ label: "Accepted by the restaurant", time: order.updatedAt, state: "done" });
  } else if (order.status === "rejected") {
    steps.push({ label: "Rejected by the restaurant", time: order.updatedAt, state: "failed" });
  } else {
    steps.push({ label: "Order cancelled", time: order.updatedAt, state: "failed" });
  }

  return (
    <ol className="space-y-0">
      {steps.map((step, index) => (
        <li key={step.label} className="relative flex gap-3 pb-5 last:pb-0">
          {index < steps.length - 1 && (
            <span className="absolute top-8 left-4 h-[calc(100%-1.5rem)] w-px bg-border" />
          )}
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full",
              step.state === "done" && "bg-emerald-600 text-white",
              step.state === "current" && "bg-amber-500 text-white",
              step.state === "failed" && "bg-destructive text-white"
            )}
          >
            {step.state === "done" && <Check className="size-4" />}
            {step.state === "current" && <Clock className="size-4" />}
            {step.state === "failed" && <X className="size-4" />}
          </span>
          <div className="pt-1">
            <p className="text-sm font-medium">{step.label}</p>
            {step.time && (
              <p className="text-xs text-muted-foreground">{formatDateTime(step.time)}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}