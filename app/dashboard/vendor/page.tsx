import { getSession } from "@/lib/session";
import DashboardPlaceholder from "@/components/dashboard/dashboard-placeholder";

export default async function VendorDashboardPage() {
  const session = await getSession();
  return <DashboardPlaceholder title="Vendor Dashboard" name={session?.user.name ?? ""} />;
}