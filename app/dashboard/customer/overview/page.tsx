import PageHeader from "@/components/dashboard/page-header";
import OverviewPanel from "@/components/dashboard/overview-panel";

export default function CustomerOverviewPage() {
  return (
    <>
      <PageHeader title="Overview" subtitle="Your orders at a glance." />
      <OverviewPanel role="customer" />
    </>
  );
}