"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Store } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import PizzaIllustration from "@/components/home/pizza-illustration";

export default function Hero() {
  const reduce = useReducedMotion();
  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay },
        };

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -right-32 size-[28rem] rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 size-[26rem] rounded-full bg-primary/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 lg:grid-cols-2 lg:py-24">
        <div className="space-y-7 text-center lg:text-left">
          <motion.p
            {...fade(0)}
            className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium text-primary"
          >
            <span className="size-2 rounded-full bg-primary" /> Wood-fired, fresh and local
          </motion.p>

          <motion.h1
            {...fade(0.1)}
            className="font-heading text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Hot &amp; fresh pizza,{" "}
            <span className="text-primary">delivered to your door</span>
          </motion.h1>

          <motion.p
            {...fade(0.2)}
            className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0"
          >
            Browse menus from local pizza shops, place an order in a minute and follow it until
            it reaches you.
          </motion.p>

          <motion.div
            {...fade(0.3)}
            className="flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <Link href="/menu" className={buttonVariants({ size: "lg", className: "h-12 rounded-xl px-7 text-base" })}>
              Explore Pizza Menu <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/sign-up"
              className={buttonVariants({
                size: "lg",
                variant: "outline",
                className: "h-12 rounded-xl px-7 text-base",
              })}
            >
              <Store className="size-4" /> Join as a restaurant
            </Link>
          </motion.div>
        </div>

        <motion.div
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 0.8, delay: 0.2 },
              })}
        >
          <PizzaIllustration />
        </motion.div>
      </div>
    </section>
  );
}