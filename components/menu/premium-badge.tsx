import { Crown } from "lucide-react";

export default function PremiumBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-accent px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
      <Crown className="size-3" /> Premium
    </span>
  );
}