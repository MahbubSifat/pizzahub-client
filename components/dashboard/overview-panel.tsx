"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "@/components/dashboard/stat-card";
import DistributionChart, { type ChartPoint } from "@/components/dashboard/distribution-chart";

type Overview = {
  stats: { key: string; label: string; value: number | string; icon: string; hint?: string }[];
  charts: { title: string; data: ChartPoint[] }[];
};
type Result = { key: string; data?: Overview; error?: string };

export default function OverviewPanel({ role }: { role: "vendor" | "customer" | "admin" }) {
  const [tick, setTick] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const key = `${role}-${tick}`;

  useEffect(() => {
    let cancelled = false;
    const requestKey = `${role}-${tick}`;
    apiFetch<Overview>(`/api/overview/${role}`)
      .then((data) => {
        if (!cancelled) setResult({ key: requestKey, data });
      })
      .catch((error) => {
        if (!cancelled) {
          setResult({
            key: requestKey,
            error: error instanceof Error ? error.message : "Could not load the overview",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [role, tick]);

  const loading = !result || result.key !== key;
  const data = !loading ? result?.data : undefined;
  const error = !loading ? result?.error : undefined;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-24 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md rounded-2xl border bg-card p-8 text-center">
        <p className="font-semibold">Could not load the overview</p>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        <Button className="mt-5" onClick={() => setTick((value) => value + 1)}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.stats.map((stat) => (
          <StatCard
            key={stat.key}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            hint={stat.hint}
          />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {data.charts.map((chart) => (
          <DistributionChart key={chart.title} title={chart.title} data={chart.data} />
        ))}
      </div>
    </div>
  );
}