import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AuthShell from "@/components/auth/auth-shell";
import OnboardingForm from "@/components/auth/onboarding-form";

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const user = session.user as unknown as { roleSelected?: boolean };
  if (user.roleSelected !== false) redirect("/dashboard");

  return (
    <AuthShell
      title="One last step"
      subtitle="Tell us how you will use PizzaHub. You can only choose this once."
      footer={<>Signed in as {session.user.email}</>}
    >
      <OnboardingForm />
    </AuthShell>
  );
}