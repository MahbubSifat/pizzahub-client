"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

type Props = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
};

export default function ErrorState({
  title = "Something went wrong",
  message = "An unexpected problem occurred. Please try again.",
  onRetry,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border bg-card p-10 text-center",
        className
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-red-100 text-destructive dark:bg-red-500/15">
        <AlertTriangle className="size-7" />
      </span>
      <div className="space-y-1">
        <h2 className="font-heading text-2xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {onRetry && <Button onClick={onRetry}>Try again</Button>}
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Go home
        </Link>
      </div>
    </div>
  );
}