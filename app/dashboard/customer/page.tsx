import { getSession } from "@/lib/session";
import DashboardPlaceholder from "@/components/dashboard/dashboard-placeholder";

export default async function CustomerDashboardPage() {
  const session = await getSession();
  return <DashboardPlaceholder title="Customer Dashboard" name={session?.user.name ?? ""} />;
}