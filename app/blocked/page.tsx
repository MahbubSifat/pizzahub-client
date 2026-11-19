import { ShieldAlert } from "lucide-react";
import SignOutButton from "@/components/sign-out-button";

export default function BlockedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="max-w-md space-y-5 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldAlert className="size-7" />
        </span>
        <h1 className="font-heading text-3xl font-semibold">Account blocked</h1>
        <p className="text-muted-foreground">
          Your account has been blocked by an administrator, so you cannot use
          PizzaHub features right now. Please contact support if you think this
          is a mistake.
        </p>
        <SignOutButton />
      </div>
    </main>
  );
}