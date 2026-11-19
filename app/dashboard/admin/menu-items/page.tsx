import PageHeader from "@/components/dashboard/page-header";
import AdminItemsManager from "@/components/dashboard/admin-items-manager";

export default function AdminMenuItemsPage() {
  return (
    <>
      <PageHeader
        title="Manage Menu Items"
        subtitle="Review submitted items. Only approved items appear on the public menu."
      />
      <AdminItemsManager />
    </>
  );
}