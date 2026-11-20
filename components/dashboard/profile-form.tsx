"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Camera, Loader2, Lock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/order-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

type Profile = {
  name: string;
  email: string;
  image: string | null;
  role: "vendor" | "customer" | "admin";
  businessName: string;
  plan: "free" | "premium" | null;
  createdAt: string | null;
};
type Result = { key: string; profile?: Profile; error?: string };

function Editor({ profile, onSaved }: { profile: Profile; onSaved: () => void }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(profile.name);
  const [businessName, setBusinessName] = useState(profile.businessName);
  const [image, setImage] = useState<string | null>(profile.image);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/upload/avatar", { method: "POST", body: form });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Upload failed");
      setImage(data.url);
      toast.success("Photo uploaded. Press Save changes to keep it.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Name must be at least 2 characters");
    if (profile.role === "vendor" && businessName.trim().length < 2) {
      return toast.error("Please enter your business name");
    }

    setSaving(true);
    try {
      const body: Record<string, unknown> = { name, image };
      if (profile.role === "vendor") body.businessName = businessName;
      await apiFetch("/api/profile", { method: "PATCH", body: JSON.stringify(body) });
      toast.success("Profile updated");
      onSaved();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update your profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      <div className="flex items-center gap-5 rounded-2xl border bg-card p-5">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="Profile" className="size-20 shrink-0 rounded-full object-cover" />
        ) : (
          <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-3xl font-semibold text-primary">
            {name.trim().charAt(0).toUpperCase() || "?"}
          </span>
        )}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
              {image ? "Change photo" : "Add photo"}
            </Button>
            {image && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setImage(null)}>
                <Trash2 className="size-4" /> Remove
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Optional. JPG, PNG or WebP, up to 2MB.</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      </div>

      <div className="space-y-5 rounded-2xl border bg-card p-5">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>

        {profile.role === "vendor" && (
          <div className="space-y-2">
            <Label htmlFor="businessName">Business name</Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={profile.email} disabled className="h-11 rounded-xl" />
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border bg-secondary/40 p-5 text-sm">
        <p className="flex items-center gap-2 font-medium">
          <Lock className="size-4" /> Account details (cannot be changed here)
        </p>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Role</span>
          <span className="font-medium capitalize">{profile.role}</span>
        </div>
        {profile.plan && (
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Plan</span>
            <span className="font-medium capitalize">{profile.plan}</span>
          </div>
        )}
        {profile.createdAt && (
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Member since</span>
            <span className="font-medium">{formatDate(profile.createdAt)}</span>
          </div>
        )}
      </div>

      <Button type="submit" disabled={saving || uploading} className="h-11 rounded-xl px-8">
        {saving ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Saving...
          </>
        ) : (
          "Save changes"
        )}
      </Button>
    </form>
  );
}

export default function ProfileForm() {
  const [tick, setTick] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const key = String(tick);

  useEffect(() => {
    let cancelled = false;
    apiFetch<{ profile: Profile }>("/api/profile")
      .then((data) => {
        if (!cancelled) setResult({ key: String(tick), profile: data.profile });
      })
      .catch((error) => {
        if (!cancelled) {
          setResult({
            key: String(tick),
            error: error instanceof Error ? error.message : "Could not load your profile",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  const loading = !result || result.key !== key;
  const profile = !loading ? result?.profile : undefined;
  const error = !loading ? result?.error : undefined;

  if (loading) {
    return (
      <div className="max-w-2xl space-y-6">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-md rounded-2xl border bg-card p-8 text-center">
        <p className="font-semibold">Could not load your profile</p>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        <Button className="mt-5" onClick={() => setTick((value) => value + 1)}>
          Try again
        </Button>
      </div>
    );
  }

  return <Editor key={key} profile={profile} onSaved={() => setTick((value) => value + 1)} />;
}