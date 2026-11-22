import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import MenuCard from "@/components/menu/menu-card";
import Reveal from "@/components/home/reveal";
import SectionHeading from "@/components/home/section-heading";
import type { MenuListResponse, PublicMenuItem } from "@/lib/menu-types";

async function getFeatured(): Promise<PublicMenuItem[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/menu-items?featured=true&limit=6`,
      { next: { revalidate: 30 } }
    );
    if (!response.ok) return [];
    const data = (await response.json()) as MenuListResponse;
    return data.items ?? [];
  } catch {
    return [];
  }
}

export default async function FeaturedSection() {
  const items = await getFeatured();

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
      <SectionHeading
        eyebrow="Featured"
        title="Fresh picks from our partners"
        subtitle="Premium restaurants appear first. Every item here is reviewed and approved."
      />

      {items.length === 0 ? (
        <div className="mx-auto max-w-md rounded-2xl border border-dashed bg-card p-10 text-center">
          <p className="font-heading text-xl font-semibold">Menu is being prepared</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Featured pizzas will show up here very soon.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item._id} delay={(index % 3) * 0.08} className="h-full">
              <MenuCard item={item} />
            </Reveal>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link href="/menu" className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-xl" })}>
          See full menu <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}