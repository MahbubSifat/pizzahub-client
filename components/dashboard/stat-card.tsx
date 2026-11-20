import {
  CheckCircle2,
  ClipboardList,
  Clock,
  Crown,
  Hourglass,
  Package,
  Receipt,
  ShoppingBag,
  Store,
  User,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  package: Package,
  check: CheckCircle2,
  clock: Clock,
  crown: Crown,
  users: Users,
  store: Store,
  user: User,
  receipt: Receipt,
  shopping: ShoppingBag,
  x: XCircle,
  hourglass: Hourglass,
  list: ClipboardList,
};

type Props = { label: string; value: number | string; icon: string; hint?: string };

export default function StatCard({ label, value, icon, hint }: Props) {
  const Icon = ICONS[icon] ?? Package;
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-6" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-heading text-3xl font-semibold tracking-tight">{value}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}