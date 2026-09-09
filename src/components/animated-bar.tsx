"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Thin animated progress bar — fills in from 0 to `percent` once scrolled
// into view. Used for lists of stats where a full `StatRing` per item would
// be too much (ex. Check Survey pontos fortes: many items, all one glance).
export function AnimatedBar({ percent, color = "#66fcf1" }: { percent: number; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: "0%" }}
        animate={{ width: inView ? `${percent}%` : "0%" }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
}
