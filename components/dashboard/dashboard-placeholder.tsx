"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Check = { label: string; ok: boolean; text: string };

export default function DashboardPlaceholder({
  title,
  name,
}: {
  title: string;
  name: string;
}) {
  const [checks, setChecks] = useState<Check[] | null>(null);

  useEffect(() => {
    async function run() {
      const results: Check[] = [];
      try {
        const data = await apiFetch<{ user: { role: string } }>("/api/me");
        results.push({
          label: "GET /api/me",
          ok: true,
          text: `Server verified you as "${data.user.role}"`,
        });
      } catch (error) {
        results.push({
          label: "GET /api/me",
          ok: false,
          text: error instanceof Error ? error.message : "Failed",
        });
      }
      try {
        await apiFetch("/api/admin/ping");
        results.push({ label: "GET /api/admin/ping", ok: true, text: "Allowed (admin)" });
      } catch (error) {
        results.push({
          label: "GET /api/admin/ping",
          ok: false,
          text: error instanceof Error ? error.message : "Failed",
        });
      }
      setChecks(results);
    }
    run();
  }, []);

  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Dashboard preview</p>
        <h1 className="font-heading text-4xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">
          Welcome, {name}. The full overview is built in a later phase.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border bg-card p-5">
        <p className="text-sm font-semibold">Server connection check</p>
        {!checks && <p className="text-sm text-muted-foreground">Checking...</p>}
        {checks?.map((check) => (
          <div key={check.label} className="flex items-start gap-3 text-sm">
            {check.ok ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            ) : (
              <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
            )}
            <div>
              <p className="font-mono text-xs">{check.label}</p>
              <p className="text-muted-foreground">{check.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}