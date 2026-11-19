import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// Login-এর পর সবাই এখানে আসে, তারপর নিজের role-এর dashboard-এ চলে যায়
export default async function DashboardRedirectPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const role = session.user.role as string;
  if (role === "vendor" || role === "customer" || role === "admin") {
    redirect(`/dashboard/${role}`);
  }
  redirect("/");
}