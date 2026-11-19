import PageHeader from "@/components/dashboard/page-header";
import CustomerOrders from "@/components/dashboard/customer-orders";

export default function CustomerOrdersPage() {
  return (
    <>
      <PageHeader
        title="My Orders"
        subtitle="Track your orders and cancel the ones that are still pending."
      />
      <CustomerOrders />
    </>
  );
}