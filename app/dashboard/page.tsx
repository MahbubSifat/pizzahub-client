import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

// Login-এর পর সবাই এখানে আসে, তারপর নিজের role-এর dashboard-এ চলে যায়
export default async function DashboardRedirectPage() {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const user = session.user as unknown as {
    role?: string;
    isBlocked?: boolean;
    roleSelected?: boolean;
  };
  if (user.isBlocked) redirect("/blocked");
  if (user.roleSelected === false) redirect("/onboarding");

  if (user.role === "vendor" || user.role === "customer" || user.role === "admin") {
    redirect(`/dashboard/${user.role}`);
  }
  redirect("/");
}