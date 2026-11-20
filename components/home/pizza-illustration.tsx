"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Clock, Flame } from "lucide-react";

const PEPPERONI: [number, number][] = [
  [200, 110],
  [270, 150],
  [285, 225],
  [240, 290],
  [165, 295],
  [115, 245],
  [120, 170],
  [200, 200],
];
const BASIL: [number, number, number][] = [
  [160, 140, -20],
  [250, 200, 40],
  [190, 255, 10],
  [140, 210, -60],
];
const OLIVES: [number, number][] = [
  [230, 120],
  [310, 190],
  [140, 320],
  [250, 330],
  [90, 200],
  [200, 62],
];

export default function PizzaIllustration() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      {/* পেছনের উজ্জ্বল আভা */}
      <div className="absolute inset-6 rounded-full bg-gradient-to-br from-primary/25 to-accent/30 blur-3xl" />

      <motion.div
        className="relative size-full"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 400 400" className="size-full drop-shadow-2xl" role="img" aria-label="A freshly baked pizza">
          <circle cx="200" cy="200" r="190" fill="#E9A95B" />
          <circle cx="200" cy="200" r="190" fill="none" stroke="#C9822F" strokeWidth="4" />
          <circle cx="200" cy="200" r="168" fill="#D62E1F" />
          <circle cx="200" cy="200" r="154" fill="#F7C948" />
          {Array.from({ length: 8 }).map((_, index) => {
            const angle = (index * Math.PI) / 4;
            return (
              <line
                key={index}
                x1="200"
                y1="200"
                x2={(200 + 154 * Math.cos(angle)).toFixed(2)}
                y2={(200 + 154 * Math.sin(angle)).toFixed(2)}
                stroke="#C9822F"
                strokeOpacity="0.45"
                strokeWidth="2"
              />
            );
          })}
          {PEPPERONI.map(([x, y], index) => (
            <g key={index}>
              <circle cx={x} cy={y} r="25" fill="#A3201A" />
              <circle cx={x - 6} cy={y - 6} r="8" fill="#C23A2E" />
            </g>
          ))}
          {OLIVES.map(([x, y], index) => (
            <g key={index}>
              <circle cx={x} cy={y} r="8" fill="#2B1B14" />
              <circle cx={x} cy={y} r="3" fill="#F7C948" />
            </g>
          ))}
          {BASIL.map(([x, y, rotate], index) => (
            <ellipse
              key={index}
              cx={x}
              cy={y}
              rx="15"
              ry="8"
              fill="#2F7D32"
              transform={`rotate(${rotate} ${x} ${y})`}
            />
          ))}
        </svg>
      </motion.div>

      {/* ভাসমান chip */}
      <motion.div
        className="absolute top-4 -left-2 flex items-center gap-2 rounded-2xl border bg-card/95 px-3.5 py-2 shadow-lg backdrop-blur sm:-left-6"
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Flame className="size-4" />
        </span>
        <span className="text-sm font-medium">Fresh from the oven</span>
      </motion.div>
      <motion.div
        className="absolute -right-2 bottom-8 flex items-center gap-2 rounded-2xl border bg-card/95 px-3.5 py-2 shadow-lg backdrop-blur sm:-right-6"
        animate={reduce ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-accent/20 text-accent">
          <Clock className="size-4" />
        </span>
        <span className="text-sm font-medium">Track every order</span>
      </motion.div>
    </div>
  );
}