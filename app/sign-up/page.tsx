"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Role = "customer" | "vendor";

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("customer");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const businessName = String(form.get("businessName") ?? "").trim();

    if (name.length < 2) {
      toast.error("Please enter your full name");
      return;
    }
    if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      toast.error("Password needs 6+ characters with an uppercase and a lowercase letter");
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
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Join PizzaHub as a customer or a restaurant.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={role === "customer" ? "default" : "outline"}
                onClick={() => setRole("customer")}
              >
                Customer
              </Button>
              <Button
                type="button"
                variant={role === "vendor" ? "default" : "outline"}
                onClick={() => setRole("vendor")}
              >
                Vendor (Restaurant)
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" required />
            </div>
            {role === "vendor" && (
              <div className="space-y-2">
                <Label htmlFor="businessName">Restaurant name</Label>
                <Input id="businessName" name="businessName" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
              <p className="text-xs text-muted-foreground">
                At least 6 characters, with one uppercase and one lowercase letter.
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}