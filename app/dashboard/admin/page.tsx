import PageHeader from "@/components/dashboard/page-header";
import OverviewPanel from "@/components/dashboard/overview-panel";

export default function AdminOverviewPage() {
  return (
    <>
      <PageHeader title="Admin Overview" subtitle="Platform-wide numbers at a glance." />
      <OverviewPanel role="admin" />
    </>
  );
}