import PageHeader from "@/components/dashboard/page-header";
import OverviewPanel from "@/components/dashboard/overview-panel";

export default function VendorOverviewPage() {
  return (
    <>
      <PageHeader title="Overview" subtitle="A quick look at your menu, orders and plan." />
      <OverviewPanel role="vendor" />
    </>
  );
}