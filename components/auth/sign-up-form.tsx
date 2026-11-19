"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, ShoppingBag, Store } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/auth/password-input";

type Role = "customer" | "vendor";

const roles = [
  {
    value: "customer" as Role,
    icon: ShoppingBag,
    title: "Customer",
    text: "Order pizza you love",
  },
  {
    value: "vendor" as Role,
    icon: Store,
    title: "Restaurant",
    text: "Sell your menu",
  },
];

export default function SignUpForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("customer");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const rules = [
    { label: "At least 6 characters", ok: password.length >= 6 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "One lowercase letter", ok: /[a-z]/.test(password) },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const businessName = String(form.get("businessName") ?? "").trim();

    if (name.length < 2) {
      toast.error("Please enter your full name");
      return;
    }
    if (!rules.every((rule) => rule.ok)) {
      toast.error("Your password does not meet all the rules yet");
      return;
    }
    if (role === "vendor" && !businessName) {
      toast.error("Please enter your restaurant name");
      return;
    }

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      role,
      businessName: role === "vendor" ? businessName : undefined,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message ?? "Sign up failed");
      return;
    }
    toast.success("Account created. Welcome to PizzaHub!");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label>I want to join as</Label>
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
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          placeholder="Your full name"
          className="h-11 rounded-xl"
          required
        />
      </div>

      {role === "vendor" && (
        <div className="space-y-2">
          <Label htmlFor="businessName">Restaurant name</Label>
          <Input
            id="businessName"
            name="businessName"
            placeholder="e.g. Napoli Wood Fire"
            className="h-11 rounded-xl"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="h-11 rounded-xl"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <ul className="grid gap-1 pt-1">
          {rules.map((rule) => (
            <li
              key={rule.label}
              className={cn(
                "flex items-center gap-2 text-xs transition-colors",
                rule.ok ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"
              )}
            >
              <Check className={cn("size-3.5", !rule.ok && "opacity-30")} />
              {rule.label}
            </li>
          ))}
        </ul>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-xl text-base"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}