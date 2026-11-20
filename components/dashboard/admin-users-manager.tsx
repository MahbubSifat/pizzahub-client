"use client";

import { useEffect, useState } from "react";
import { Ban, CheckCircle2, Eye, Search, Users } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/order-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type UserRow = {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "vendor" | "customer" | "admin";
  businessName?: string;
  isBlocked?: boolean;
  subscriptionPlan?: string;
  subscriptionExpiresAt?: string | null;
  createdAt?: string;
};
type Result = { key: string; users?: UserRow[]; total?: number; pages?: number; error?: string };

const ROLE_TABS = [
  { value: "", label: "All" },
  { value: "vendor", label: "Vendors" },
  { value: "customer", label: "Customers" },
  { value: "admin", label: "Admins" },
];

function UserPicture({ user }: { user: UserRow }) {
  return user.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={user.image} alt="" className="size-10 shrink-0 rounded-full object-cover" />
  ) : (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
      {user.name.charAt(0).toUpperCase()}
    </span>
  );
}

export default function AdminUsersManager() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [tick, setTick] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [viewing, setViewing] = useState<UserRow | null>(null);
  const [confirm, setConfirm] = useState<{ user: UserRow; blocked: boolean } | null>(null);
  const [busyId, setBusyId] = useState("");

  const key = `${search}|${role}|${page}|${tick}`;

  // টাইপ থামার একটু পরে search চালানো
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(query.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    const requestKey = `${search}|${role}|${page}|${tick}`;
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (role) params.set("role", role);
    params.set("page", String(page));

    apiFetch<{ users: UserRow[]; total: number; pages: number }>(
      `/api/admin/users?${params.toString()}`
    )
      .then((data) => {
        if (!cancelled) {
          setResult({ key: requestKey, users: data.users, total: data.total, pages: data.pages });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setResult({
            key: requestKey,
            error: error instanceof Error ? error.message : "Could not load users",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [search, role, page, tick]);

  async function applyBlock() {
    if (!confirm) return;
    const { user, blocked } = confirm;
    setConfirm(null);
    setBusyId(user._id);
    try {
      await apiFetch(`/api/admin/users/${user._id}/block`, {
        method: "PATCH",
        body: JSON.stringify({ blocked }),
      });
      toast.success(blocked ? "User blocked" : "User unblocked");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the user");
    } finally {
      setBusyId("");
      setTick((value) => value + 1);
    }
  }

  const loading = !result || result.key !== key;
  const users = !loading ? result?.users : undefined;
  const error = !loading ? result?.error : undefined;
  const pages = result?.pages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email"
            className="h-11 rounded-xl pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {ROLE_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setRole(tab.value);
                setPage(1);
              }}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                role === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((index) => (
            <Skeleton key={index} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="max-w-md rounded-2xl border bg-card p-8 text-center">
          <p className="font-semibold">Could not load users</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button className="mt-5" onClick={() => setTick((value) => value + 1)}>
            Try again
          </Button>
        </div>
      ) : !users || users.length === 0 ? (
        <div className="flex max-w-lg flex-col items-center gap-3 rounded-2xl border border-dashed bg-card p-10 text-center">
          <Users className="size-8 text-primary" />
          <p className="font-heading text-xl font-semibold">No users found</p>
          <p className="text-sm text-muted-foreground">Try a different search or filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <article
              key={user._id}
              className="flex flex-col gap-3 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <UserPicture user={user} />
                <div className="min-w-0">
                  <p className="truncate font-medium">{user.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium capitalize">
                  {user.role}
                </span>
                {user.role === "vendor" && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary capitalize">
                    {user.subscriptionPlan === "premium" ? "Premium" : "Free"}
                  </span>
                )}
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    user.isBlocked
                      ? "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300"
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300"
                  )}
                >
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setViewing(user)}>
                  <Eye className="size-4" /> Details
                </Button>
                {user.role !== "admin" &&
                  (user.isBlocked ? (
                    <Button
                      size="sm"
                      disabled={busyId === user._id}
                      onClick={() => setConfirm({ user, blocked: false })}
                    >
                      <CheckCircle2 className="size-4" /> Unblock
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={busyId === user._id}
                      onClick={() => setConfirm({ user, blocked: true })}
                      className="text-destructive hover:text-destructive"
                    >
                      <Ban className="size-4" /> Block
                    </Button>
                  ))}
              </div>
            </article>
          ))}

          <div className="flex items-center justify-between pt-2 text-sm">
            <span className="text-muted-foreground">
              Page {page} of {pages} · {result?.total ?? 0} users
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((value) => value - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pages}
                onClick={() => setPage((value) => value + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="sm:max-w-md">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl">{viewing.name}</DialogTitle>
                <DialogDescription>{viewing.email}</DialogDescription>
              </DialogHeader>
              <dl className="space-y-3 rounded-xl border bg-secondary/40 p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Role</dt>
                  <dd className="font-medium capitalize">{viewing.role}</dd>
                </div>
                {viewing.role === "vendor" && (
                  <>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Business</dt>
                      <dd className="font-medium">{viewing.businessName || "Not set"}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Plan</dt>
                      <dd className="font-medium">
                        {viewing.subscriptionPlan === "premium" ? "Premium" : "Free"}
                      </dd>
                    </div>
                    {viewing.subscriptionPlan === "premium" && viewing.subscriptionExpiresAt && (
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">Plan expires</dt>
                        <dd className="font-medium">{formatDate(viewing.subscriptionExpiresAt)}</dd>
                      </div>
                    )}
                  </>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="font-medium">{viewing.isBlocked ? "Blocked" : "Active"}</dd>
                </div>
                {viewing.createdAt && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Joined</dt>
                    <dd className="font-medium">{formatDate(viewing.createdAt)}</dd>
                  </div>
                )}
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirm} onOpenChange={(open) => !open && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm?.blocked ? "Block this user?" : "Unblock this user?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.blocked
                ? `${confirm.user.name} will no longer be able to use protected features.`
                : `${confirm?.user.name} will be able to use the platform again.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go back</AlertDialogCancel>
            <AlertDialogAction onClick={applyBlock}>
              {confirm?.blocked ? "Block user" : "Unblock user"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}