"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Check, Loader2, ShoppingBag, Store, X } from "lucide-react";
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

const MAX_PHOTO = 2 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function SignUpForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [role, setRole] = useState<Role>("customer");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const preview = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo]);
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const rules = [
    { label: "At least 6 characters", ok: password.length >= 6 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "One lowercase letter", ok: /[a-z]/.test(password) },
  ];

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!PHOTO_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG or WebP images are allowed");
      return;
    }
    if (file.size > MAX_PHOTO) {
      toast.error("Photo must be 2MB or smaller");
      return;
    }
    setPhoto(file);
  }

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

    if (error) {
      setLoading(false);
      toast.error(error.message ?? "Sign up failed");
      return;
    }

    // ছবি ঐচ্ছিক: account তৈরির পর (login অবস্থায়) upload করে profile-এ বসানো হয়
    if (photo) {
      try {
        const body = new FormData();
        body.append("file", photo);
        const response = await fetch("/api/upload/avatar", { method: "POST", body });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.url) throw new Error(data.message || "Upload failed");
        const { error: updateError } = await authClient.updateUser({ image: data.url });
        if (updateError) throw new Error(updateError.message);
      } catch {
        toast.warning("Account created, but the photo could not be saved. Add it in Profile Settings.");
      }
    }

    setLoading(false);
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

      <div className="flex items-center gap-4 rounded-2xl border bg-card p-3">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Selected profile photo" className="size-14 shrink-0 rounded-full object-cover" />
        ) : (
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <Camera className="size-5" />
          </span>
        )}
        <div className="flex-1">
          <p className="text-sm font-medium">Profile photo (optional)</p>
          <p className="text-xs text-muted-foreground">JPG, PNG or WebP, up to 2MB</p>
        </div>
        <div className="flex gap-1">
          <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            {photo ? "Change" : "Add"}
          </Button>
          {photo && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Remove photo"
              onClick={() => setPhoto(null)}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handlePhoto}
        />
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