import { Pizza } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { label?: string; className?: string };

export default function PageLoader({ label = "Loading...", className }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center justify-center gap-4 py-24 text-center", className)}
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
        <Pizza className="size-7 animate-spin [animation-duration:2s]" />
      </span>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}