import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AuthShell from "@/components/auth/auth-shell";
import SignInForm from "@/components/auth/sign-in-form";

export default async function SignInPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to order, manage your menu or run the platform."
      footer={
        <>
          New to PizzaHub?{" "}
          <Link href="/sign-up" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <SignInForm />
    </AuthShell>
  );
}