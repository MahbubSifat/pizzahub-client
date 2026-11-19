import Link from "next/link";
import { Pizza } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-5 py-28 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <Pizza className="size-7" />
      </span>
      <h1 className="font-heading text-5xl font-semibold tracking-tight">
        Hot &amp; Fresh Pizza Delivered to Your Door
      </h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        The full home page is coming in a later phase.
      </p>
      <Link href="/menu" className={buttonVariants({ size: "lg" })}>
        Explore Pizza Menu
      </Link>
    </section>
  );
}