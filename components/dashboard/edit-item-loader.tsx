"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type { MenuItem } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MenuItemForm from "@/components/dashboard/menu-item-form";

export default function EditItemLoader({ id }: { id: string }) {
  const [item, setItem] = useState<MenuItem | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<{ item: MenuItem }>(`/api/vendor/menu-items/${id}`)
      .then((data) => setItem(data.item))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load item"));
  }, [id]);

  if (error) {
    return (
      <div className="max-w-md rounded-2xl border bg-card p-8 text-center">
        <p className="font-semibold">{error}</p>
        <Link
          href="/dashboard/vendor/items"
          className={buttonVariants({ className: "mt-5" })}
        >
          Back to my items
        </Link>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-3xl space-y-4">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  return <MenuItemForm item={item} />;
}