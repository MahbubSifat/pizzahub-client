"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { SORT_OPTIONS, type MenuListResponse } from "@/lib/menu-types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MenuCard from "@/components/menu/menu-card";
import SearchBox from "@/components/menu/search-box";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Result = { key: string; data?: MenuListResponse; error?: string };

export default function MenuBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const location = searchParams.get("location") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const page = Math.max(parseInt(searchParams.get("page") ?? "1", 10) || 1, 1);

  const [tick, setTick] = useState(0);
  const [locations, setLocations] = useState<string[]>([]);
  const [result, setResult] = useState<Result | null>(null);

  // API-র query string (URL-এর filter থেকেই বানানো হয়, তাই link share বা reload করলেও filter থাকে)
  const apiQuery = new URLSearchParams();
  if (search) apiQuery.set("search", search);
  if (category) apiQuery.set("category", category);
  if (location) apiQuery.set("location", location);
  if (sort !== "newest") apiQuery.set("sort", sort);
  apiQuery.set("page", String(page));
  apiQuery.set("limit", "12");
  const queryString = apiQuery.toString();
  const key = `${queryString}|${tick}`;

  useEffect(() => {
    fetch(`${API_URL}/api/menu-items/locations`)
      .then((res) => res.json())
      .then((data) => setLocations(data.locations ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    const requestKey = `${queryString}|${tick}`;
    fetch(`${API_URL}/api/menu-items?${queryString}`)
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.message ?? "Could not load the menu");
        return body as MenuListResponse;
      })
      .then((data) => {
        if (!cancelled) setResult({ key: requestKey, data });
      })
      .catch((error) => {
        if (!cancelled) {
          setResult({
            key: requestKey,
            error: error instanceof Error ? error.message : "Could not load the menu",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [queryString, tick]);

  function setParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([name, value]) => {
      if (value) params.set(name, value);
      else params.delete(name);
    });
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const loading = !result || result.key !== key;
  const data = !loading ? result?.data : undefined;
  const error = !loading ? result?.error : undefined;
  const hasFilters = Boolean(search || category || location || sort !== "newest");

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="grid gap-3 rounded-2xl border bg-card p-4 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <SearchBox
          key={search}
          initial={search}
          placeholder="Search pizzas, sides, drinks..."
          onCommit={(value) => setParams({ search: value, page: "" })}
        />
        <Select
          value={category || "all"}
          onValueChange={(value) =>
            setParams({ category: value === "all" ? "" : (value ?? ""), page: "" })
          }
        >
          <SelectTrigger className="h-11 w-full rounded-xl">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={location || "all"}
          onValueChange={(value) =>
            setParams({ location: value === "all" ? "" : (value ?? ""), page: "" })
          }
        >
          <SelectTrigger className="h-11 w-full rounded-xl">
            <SelectValue placeholder="All locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All locations</SelectItem>
            {locations.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={sort}
          onValueChange={(value) =>
            setParams({ sort: value === "newest" ? "" : (value ?? ""), page: "" })
          }
        >
          <SelectTrigger className="h-11 w-full rounded-xl">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border bg-card">
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mx-auto max-w-md rounded-2xl border bg-card p-10 text-center">
          <p className="font-heading text-xl font-semibold">Could not load the menu</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button className="mt-5" onClick={() => setTick((value) => value + 1)}>
            Try again
          </Button>
        </div>
      ) : data && data.items.length === 0 ? (
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-dashed bg-card p-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary">
            <SearchX className="size-6 text-primary" />
          </span>
          <div>
            <p className="font-heading text-xl font-semibold">No pizza found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {hasFilters
                ? "Try a different search or clear your filters."
                : "No items are on the menu yet. Please check back soon."}
            </p>
          </div>
          {hasFilters && (
            <Button variant="outline" onClick={() => router.replace(pathname, { scroll: false })}>
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        data && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {data.total} {data.total === 1 ? "item" : "items"} found
              </p>
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.replace(pathname, { scroll: false })}
                >
                  Clear filters
                </Button>
              )}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.items.map((item) => (
                <MenuCard key={item._id} item={item} />
              ))}
            </div>
            {data.pages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-2">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setParams({ page: String(page - 1) })}
                >
                  <ChevronLeft className="size-4" /> Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {data.page} of {data.pages}
                </span>
                <Button
                  variant="outline"
                  disabled={page >= data.pages}
                  onClick={() => setParams({ page: String(page + 1) })}
                >
                  Next <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}