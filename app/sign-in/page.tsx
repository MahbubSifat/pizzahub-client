import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AuthShell from "@/components/auth/auth-shell";
import SignInForm from "@/components/auth/sign-in-form";
import SocialSection from "@/components/auth/social-section";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  // শুধু নিজের site-এর ভেতরের path অনুমোদিত (বাইরের link-এ পাঠানো আটকানো)
  const redirectTo =
    next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  const session = await getSession();
  if (session) redirect(redirectTo);

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
      <SignInForm redirectTo={redirectTo} />
      <SocialSection callbackURL={redirectTo} />
    </AuthShell>
  );
}