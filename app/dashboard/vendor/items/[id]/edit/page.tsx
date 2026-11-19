import PageHeader from "@/components/dashboard/page-header";
import EditItemLoader from "@/components/dashboard/edit-item-loader";

export default async function EditMenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <PageHeader
        title="Edit Menu Item"
        subtitle="Saving changes sends the item back for admin review."
      />
      <EditItemLoader id={id} />
    </>
  );
}