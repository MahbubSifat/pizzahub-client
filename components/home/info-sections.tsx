import Link from "next/link";
import {
  BadgeCheck,
  ListChecks,
  Lock,
  Search,
  ShoppingBag,
  Store,
  Timer,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Reveal from "@/components/home/reveal";
import SectionHeading from "@/components/home/section-heading";

const REASONS: { title: string; text: string; icon: LucideIcon }[] = [
  {
    title: "Reviewed menus",
    text: "Every item is checked by our team before it appears on the menu.",
    icon: BadgeCheck,
  },
  {
    title: "Track every order",
    text: "See your order move from requested to accepted, step by step.",
    icon: Timer,
  },
  {
    title: "Built for local shops",
    text: "Restaurants manage their menu and orders from one simple dashboard.",
    icon: Store,
  },
  {
    title: "Safe and secure",
    text: "Protected sign-in, role-based access and secure payments for partners.",
    icon: Lock,
  },
];

const STEPS: { title: string; text: string; icon: LucideIcon }[] = [
  { title: "Browse", text: "Search and filter pizzas by category, area and price.", icon: Search },
  { title: "Order", text: "Pick a delivery date, add your address and place the order.", icon: ShoppingBag },
  { title: "Enjoy", text: "The restaurant accepts your order and you follow its progress.", icon: UtensilsCrossed },
];

export function WhyChoose() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
      <SectionHeading
        eyebrow="Why PizzaHub"
        title="Why Choose PizzaHub?"
        subtitle="A simple, trustworthy way to order pizza from places near you."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map(({ title, text, icon: Icon }, index) => (
          <Reveal key={title} delay={index * 0.07} className="h-full">
            <div className="h-full rounded-2xl border bg-card p-6 transition-shadow hover:shadow-lg">
              <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-accent/20 text-accent">
                <Icon className="size-6" />
              </span>
              <h3 className="font-heading text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="border-y bg-secondary/40">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
        <SectionHeading
          eyebrow="How it works"
          title="From craving to doorstep in three steps"
        />
        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map(({ title, text, icon: Icon }, index) => (
            <Reveal key={title} delay={index * 0.1}>
              <div className="relative text-center">
                <span className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <Icon className="size-7" />
                </span>
                <span className="absolute top-0 left-1/2 ml-7 -translate-y-2 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
                  {index + 1}
                </span>
                <h3 className="font-heading text-xl font-semibold">{title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBand({ loggedIn }: { loggedIn: boolean }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
          <div className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 size-64 rounded-full bg-black/10 blur-2xl" />
          <div className="relative space-y-4">
            <ListChecks className="mx-auto size-8 opacity-80" />
            <h2 className="font-heading text-3xl font-semibold sm:text-4xl">
              {loggedIn ? "Ready for your next slice?" : "Own a pizza shop? Grow with PizzaHub"}
            </h2>
            <p className="mx-auto max-w-xl opacity-90">
              {loggedIn
                ? "Head to the menu and find something delicious."
                : "List your menu for free, get orders from nearby customers and upgrade to Premium for unlimited items and a featured spot."}
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                href={loggedIn ? "/menu" : "/sign-up"}
                className={buttonVariants({ variant: "secondary", size: "lg", className: "h-12 rounded-xl px-7 text-base" })}
              >
                {loggedIn ? "Browse Menu" : "Get started"}
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}