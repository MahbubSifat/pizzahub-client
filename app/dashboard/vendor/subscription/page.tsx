import PageHeader from "@/components/dashboard/page-header";
import SubscriptionPanel from "@/components/dashboard/subscription-panel";

export default function VendorSubscriptionPage() {
  return (
    <>
      <PageHeader
        title="Subscription"
        subtitle="Compare plans and upgrade to Premium for unlimited menu items."
      />
      <SubscriptionPanel />
    </>
  );
}