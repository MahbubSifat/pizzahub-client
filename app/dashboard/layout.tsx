import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import type { DashboardRole } from "@/lib/nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const user = session.user as unknown as {
    name: string;
    email: string;
    image?: string | null;
    role?: string;
    isBlocked?: boolean;
    roleSelected?: boolean;
  };

  if (user.isBlocked) redirect("/blocked");
  if (user.roleSelected === false) redirect("/onboarding");
  if (user.role !== "vendor" && user.role !== "customer" && user.role !== "admin") {
    redirect("/");
  }

  return (
    <DashboardShell
      user={{
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role as DashboardRole,
      }}
    >
      {children}
    </DashboardShell>
  );
}