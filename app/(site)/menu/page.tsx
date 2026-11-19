import { Suspense } from "react";
import MenuBrowser from "@/components/menu/menu-browser";

export const metadata = { title: "Browse Menu | PizzaHub" };

export default function BrowseMenuPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12">
      <div className="mb-8 space-y-2">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">Browse the Menu</h1>
        <p className="text-muted-foreground">
          Fresh pizzas, sides and drinks from restaurants near you.
        </p>
      </div>
      <Suspense fallback={null}>
        <MenuBrowser />
      </Suspense>
    </section>
  );
}