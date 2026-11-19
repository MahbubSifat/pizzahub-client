"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import SignOutButton from "@/components/sign-out-button";

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
        const data = await apiFetch<{ user: { role: string; email: string } }>("/api/me");
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
        results.push({
          label: "GET /api/admin/ping",
          ok: true,
          text: "Allowed (you are an admin)",
        });
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
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-8 px-5 py-12">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Dashboard preview</p>
        <h1 className="font-heading text-4xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">
          Welcome, {name}. The full dashboard is built in a later phase.
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
        <p className="text-xs text-muted-foreground">
          For customers and vendors, <span className="font-mono">/api/admin/ping</span>{" "}
          must show an error (403). That means role protection works.
        </p>
      </div>

      <div>
        <SignOutButton />
      </div>
    </main>
  );
}