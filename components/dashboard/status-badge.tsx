import { cn } from "@/lib/utils";
import { STATUS_STYLES, type ItemStatus } from "@/lib/constants";

export default function StatusBadge({ status }: { status: ItemStatus }) {
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