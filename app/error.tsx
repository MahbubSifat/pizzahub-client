"use client";

import { useEffect } from "react";
import Logo from "@/components/logo";
import ErrorState from "@/components/error-state";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-5">
      <Logo />
      <ErrorState onRetry={reset} />
    </main>
  );
}