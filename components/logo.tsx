import Link from "next/link";
import { Pizza } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Logo({
  className,
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-xl",
          inverted
            ? "bg-primary-foreground text-primary"
            : "bg-primary text-primary-foreground"
        )}
      >
        <Pizza className="size-5" />
      </span>
      <span className="font-heading text-xl font-semibold tracking-tight">
        PizzaHub
      </span>
    </Link>
  );
}