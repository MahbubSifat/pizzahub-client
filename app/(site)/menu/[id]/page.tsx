import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import ItemDetails from "@/components/menu/item-details";

export default async function MenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Logged-out হলে Sign In-এ পাঠায়, login-এর পর এই item-এই ফিরে আসে
  const session = await getSession();
  if (!session) {
    redirect(`/sign-in?next=${encodeURIComponent(`/menu/${id}`)}`);
  }

  const user = session.user as unknown as { role?: string; isBlocked?: boolean };
  if (user.isBlocked) redirect("/blocked");

  return (
    <section className="mx-auto max-w-7xl px-5 py-10">
      <ItemDetails id={id} role={user.role ?? "customer"} userId={session.user.id} />
    </section>
  );
}