"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag, Store } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { completeOnboarding } from "@/app/onboarding/actions";

type Role = "customer" | "vendor";

const roles = [
  { value: "customer" as Role, icon: ShoppingBag, title: "Customer", text: "Order pizza you love" },
  { value: "vendor" as Role, icon: Store, title: "Restaurant", text: "Sell your menu" },
];

export default function OnboardingForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("customer");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const result = await completeOnboarding({ role, businessName });
    setLoading(false);

    if (!result.ok) {
      toast.error(result.message ?? "Something went wrong");
      return;
    }
    toast.success("All set. Welcome to PizzaHub!");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {roles.map(({ value, icon: Icon, title, text }) => {
          const active = role === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => setRole(value)}
              className={cn(
                "flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all",
                active
                  ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                  : "border-border bg-card hover:border-primary/40"
              )}
            >
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-xl",
                  active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                )}
              >
                <Icon className="size-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{title}</span>
                <span className="block text-xs text-muted-foreground">{text}</span>
              </span>
            </button>
          );
        })}
      </div>

      {role === "vendor" && (
        <div className="space-y-2">
          <Label htmlFor="businessName">Restaurant name</Label>
          <Input
            id="businessName"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Napoli Wood Fire"
            className="h-11 rounded-xl"
          />
        </div>
      )}

      <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl text-base">
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Saving...
          </>
        ) : (
          "Continue"
        )}
      </Button>
    </form>
  );
}