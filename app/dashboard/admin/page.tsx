import { getSession } from "@/lib/session";
import DashboardPlaceholder from "@/components/dashboard/dashboard-placeholder";

export default async function AdminDashboardPage() {
  const session = await getSession();
  return <DashboardPlaceholder title="Admin Dashboard" name={session?.user.name ?? ""} />;
}