import PageHeader from "@/components/dashboard/page-header";
import VendorItemsList, { AddItemButton } from "@/components/dashboard/vendor-items-list";

export default function VendorItemsPage() {
  return (
    <>
      <PageHeader
        title="My Menu Items"
        subtitle="Manage the pizzas, sides and drinks your restaurant offers."
        action={<AddItemButton />}
      />
      <VendorItemsList />
    </>
  );
}