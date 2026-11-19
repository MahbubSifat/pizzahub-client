import SignOutButton from "@/components/sign-out-button";

export default function CustomerDashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Customer Dashboard</h1>
      <SignOutButton />
    </main>
  );
}