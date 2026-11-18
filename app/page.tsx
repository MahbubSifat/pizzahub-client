import { Button } from "@/components/ui/button";
import ApiStatus from "@/components/api-status";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">PizzaHub</h1>
      <p className="text-muted-foreground">Setup complete. Building soon.</p>
      <Button>Explore Pizza Menu</Button>
      <ApiStatus />
    </main>
  );
}