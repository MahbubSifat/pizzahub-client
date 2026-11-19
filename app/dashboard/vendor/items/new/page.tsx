import PageHeader from "@/components/dashboard/page-header";
import MenuItemForm from "@/components/dashboard/menu-item-form";

export default function NewMenuItemPage() {
  return (
    <>
      <PageHeader
        title="Add Menu Item"
        subtitle="New items are reviewed by an admin before customers can see them."
      />
      <MenuItemForm />
    </>
  );
}