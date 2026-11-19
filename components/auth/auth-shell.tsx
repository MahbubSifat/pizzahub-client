import { Flame, ShieldCheck, Truck } from "lucide-react";
import Logo from "@/components/logo";

const perks = [
  {
    icon: Flame,
    title: "Hot and fresh",
    text: "Wood-fired favourites from the pizza shops near you.",
  },
  {
    icon: Truck,
    title: "Delivered to your door",
    text: "Pick a date, add your address and we handle the rest.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted kitchens",
    text: "Every menu item is reviewed before it goes live.",
  },
];

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export default function AuthShell({ title, subtitle, children, footer }: Props) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <aside
        className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.14) 1.5px, transparent 1.5px)",
          backgroundSize: "26px 26px",
        }}
      >
        <Logo inverted className="text-primary-foreground" />

        <div className="max-w-md space-y-8">
          <h2 className="font-heading text-5xl leading-[1.1] font-semibold">
            Hot and fresh pizza, delivered to your door.
          </h2>
          <ul className="space-y-5">
            {perks.map(({ icon: Icon, title: perkTitle, text }) => (
              <li key={perkTitle} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-medium">{perkTitle}</p>
                  <p className="text-sm text-primary-foreground/80">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-primary-foreground/70">
          &copy; {new Date().getFullYear()} PizzaHub
        </p>
      </aside>

      {/* Form panel */}
      <section className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Logo className="mb-8 lg:hidden" />
          <div className="mb-8 space-y-2">
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          {children}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        </div>
      </section>
    </main>
  );
}