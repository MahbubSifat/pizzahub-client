import { cn } from "@/lib/utils";
import { ORDER_STATUS_STYLES, type OrderStatus } from "@/lib/order-types";

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const style = ORDER_STATUS_STYLES[status];
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