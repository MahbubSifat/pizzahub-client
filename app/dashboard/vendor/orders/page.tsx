import PageHeader from "@/components/dashboard/page-header";
import VendorOrders from "@/components/dashboard/vendor-orders";

export default function VendorOrdersPage() {
  return (
    <>
      <PageHeader
        title="Customer Orders"
        subtitle="Accept or reject new orders. Each pending order can be decided once."
      />
      <VendorOrders />
    </>
  );
}