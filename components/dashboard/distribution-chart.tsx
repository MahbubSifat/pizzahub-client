const TONES: Record<string, string> = {
  pending: "bg-amber-500",
  approved: "bg-emerald-600",
  accepted: "bg-emerald-600",
  rejected: "bg-red-500",
  cancelled: "bg-stone-400",
  inactive: "bg-stone-400",
  vendor: "bg-primary",
  customer: "bg-amber-500",
  admin: "bg-stone-500",
};

export type ChartPoint = { label: string; value: number; tone: string };

export default function DistributionChart({ title, data }: { title: string; data: ChartPoint[] }) {
  const max = Math.max(1, ...data.map((point) => point.value));
  const total = data.reduce((sum, point) => sum + point.value, 0);

  return (
    <section className="rounded-2xl border bg-card p-5">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-heading text-lg font-semibold">{title}</h3>
        <span className="text-xs text-muted-foreground">Total {total}</span>
      </div>

      {total === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No data yet.</p>
      ) : (
        <ul className="space-y-3">
          {data.map((point) => (
            <li key={point.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{point.label}</span>
                <span className="font-medium">{point.value}</span>
              </div>
              <div
                className="h-2.5 overflow-hidden rounded-full bg-secondary"
                role="img"
                aria-label={`${point.label}: ${point.value}`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-700 ${TONES[point.tone] ?? "bg-primary"}`}
                  style={{ width: `${point.value === 0 ? 0 : Math.max(4, (point.value / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}