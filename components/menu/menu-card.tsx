import Link from "next/link";
import { MapPin, Store } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import PremiumBadge from "@/components/menu/premium-badge";
import { formatPrice, vendorLabel, type PublicMenuItem } from "@/lib/menu-types";

export default function MenuCard({ item }: { item: PublicMenuItem }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.images[0]}
          alt={item.itemName}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
          {item.category}
        </span>
        {item.isPremiumVendor && (
          <div className="absolute top-3 right-3">
            <PremiumBadge />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-1 font-heading text-lg font-semibold">{item.itemName}</h3>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Store className="size-3.5 shrink-0" />
          <span className="line-clamp-1">{vendorLabel(item.vendor)}</span>
        </p>
        <div className="flex items-center justify-between gap-3">
          <span className="font-semibold text-primary">{formatPrice(item.price)}</span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            <span className="line-clamp-1">{item.location}</span>
          </span>
        </div>
        <Link
          href={`/menu/${item._id}`}
          className={buttonVariants({ className: "mt-auto w-full rounded-xl" })}
        >
          View Details
        </Link>
      </div>
    </article>
  );
}