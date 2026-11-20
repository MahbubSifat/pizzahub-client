"use client";

import { useEffect } from "react";
import ErrorState from "@/components/error-state";

export default function DashboardError({
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
    <ErrorState
      title="This page could not load"
      message="We could not load your dashboard data. Please try again."
      onRetry={reset}
      className="mt-10"
    />
  );
}