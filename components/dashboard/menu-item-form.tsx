"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api";
import { CATEGORIES, type MenuItem } from "@/lib/constants";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUploader from "@/components/dashboard/image-uploader";

export default function MenuItemForm({ item }: { item?: MenuItem }) {
  const router = useRouter();
  const [itemName, setItemName] = useState(item?.itemName ?? "");
  const [category, setCategory] = useState(item?.category ?? "");
  const [price, setPrice] = useState(item ? String(item.price) : "");
  const [location, setLocation] = useState(item?.location ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [images, setImages] = useState<string[]>(item?.images ?? []);
  const [loading, setLoading] = useState(false);
  const [limitHit, setLimitHit] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLimitHit(false);

    if (itemName.trim().length < 2) return toast.error("Please enter the item name");
    if (!category) return toast.error("Please choose a category");
    if (!(Number(price) > 0)) return toast.error("Price must be greater than 0");
    if (location.trim().length < 2) return toast.error("Please enter the location");
    if (description.trim().length < 10)
      return toast.error("Description must be at least 10 characters");
    if (images.length === 0) return toast.error("Please upload at least one image");

    setLoading(true);
    try {
      await apiFetch(item ? `/api/vendor/menu-items/${item._id}` : "/api/vendor/menu-items", {
        method: item ? "PATCH" : "POST",
        body: JSON.stringify({
          itemName,
          category,
          price: Number(price),
          location,
          description,
          images,
        }),
      });
      toast.success(
        item ? "Item updated and sent for review" : "Item submitted for admin review"
      );
      router.push("/dashboard/vendor/items");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.code === "PLAN_LIMIT") {
        setLimitHit(true);
      }
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {limitHit && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4">
          <div className="flex items-start gap-3">
            <Crown className="mt-0.5 size-5 text-accent" />
            <div>
              <p className="font-semibold">Free plan limit reached</p>
              <p className="text-sm text-muted-foreground">
                You can have up to 3 active items. Upgrade to Premium for unlimited items.
              </p>
            </div>
          </div>
          <Link href="/dashboard/vendor/subscription" className={buttonVariants({ size: "sm" })}>
            Upgrade to Premium
          </Link>
        </div>
      )}

      <section className="space-y-5 rounded-2xl border bg-card p-5 sm:p-6">
        <h2 className="font-heading text-xl font-semibold">Item details</h2>

        <div className="space-y-2">
          <Label htmlFor="itemName">Item name</Label>
          <Input
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g. Margherita Classica"
            className="h-11 rounded-xl"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value ?? "")}>
              <SelectTrigger className="h-11 w-full rounded-xl">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price (BDT)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 650"
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location (area / city)</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Dhanmondi, Dhaka"
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell customers what makes this item special"
            rows={5}
            className="rounded-xl"
          />
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border bg-card p-5 sm:p-6">
        <h2 className="font-heading text-xl font-semibold">Images</h2>
        <ImageUploader value={images} onChange={setImages} />
      </section>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading} className="h-11 rounded-xl px-8 text-base">
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Saving...
            </>
          ) : item ? (
            "Save changes"
          ) : (
            "Submit for review"
          )}
        </Button>
        <Link
          href="/dashboard/vendor/items"
          className={buttonVariants({ variant: "outline", className: "h-11 rounded-xl px-6" })}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}