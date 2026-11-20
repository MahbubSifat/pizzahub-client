"use client";

import { useEffect } from "react";
import ErrorState from "@/components/error-state";

export default function SiteError({
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
    <div className="px-5 py-20">
      <ErrorState onRetry={reset} />
    </div>
  );
}