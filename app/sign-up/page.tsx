import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AuthShell from "@/components/auth/auth-shell";
import SignUpForm from "@/components/auth/sign-up-form";
import SocialSection from "@/components/auth/social-section";

export default async function SignUpPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join PizzaHub as a hungry customer or a pizza restaurant."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </>
      }
    >
      <SignUpForm />
      <SocialSection />
    </AuthShell>
  );
}