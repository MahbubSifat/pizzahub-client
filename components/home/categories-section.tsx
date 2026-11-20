import Link from "next/link";
import { ArrowUpRight, Beef, ChefHat, CupSoda, Leaf, Pizza, Sandwich, type LucideIcon } from "lucide-react";
import Reveal from "@/components/home/reveal";
import SectionHeading from "@/components/home/section-heading";

const CATEGORY_CARDS: { name: string; text: string; icon: LucideIcon }[] = [
  { name: "Classic Pizzas", text: "Margherita, cheese and all-time favourites.", icon: Pizza },
  { name: "Vegetarian Pizzas", text: "Garden-fresh toppings, no meat needed.", icon: Leaf },
  { name: "Meat Lovers", text: "Loaded with pepperoni, chicken and more.", icon: Beef },
  { name: "Specialty / Gourmet Pizzas", text: "Chef-made creations with bold flavours.", icon: ChefHat },
  { name: "Sides & Appetizers", text: "Garlic bread, wings and tasty starters.", icon: Sandwich },
  { name: "Beverages & Desserts", text: "Cool drinks and sweet endings.", icon: CupSoda },
];

export default function CategoriesSection() {
  return (
    <section className="border-y bg-secondary/40">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
        <SectionHeading
          eyebrow="Categories"
          title="What are you craving today?"
          subtitle="Jump straight to the kind of food you love."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_CARDS.map(({ name, text, icon: Icon }, index) => (
            <Reveal key={name} delay={(index % 3) * 0.08} className="h-full">
              <Link
                href={`/menu?category=${encodeURIComponent(name)}`}
                className="group flex h-full items-start gap-4 rounded-2xl border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-6" />
                </span>
                <span className="flex-1">
                  <span className="block font-heading text-lg font-semibold">{name}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{text}</span>
                </span>
                <ArrowUpRight className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}