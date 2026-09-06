"use client";

import type { ComponentType } from "react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Counter } from "@/components/counter";

export function StatRing({
  value,
  percent,
  label,
  color = "#66fcf1",
  icon: Icon,
}: {
  value: string;
  percent: number;
  label: string;
  color?: string;
  icon?: ComponentType<{ size?: number }>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  return (
    <div ref={ref} className="flex w-[220px] flex-col items-center">
      {Icon && (
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20">
          <Icon size={20} />
        </div>
      )}
      <div className="relative h-[200px] w-[200px] shrink-0">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="10"
          />
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: inView
                ? circumference - (circumference * percent) / 100
                : circumference,
            }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white">
          <Counter value={value} />
        </div>
      </div>
      <p className="mt-5 text-center text-sm font-bold uppercase tracking-widest text-white/80">
        {label}
      </p>
    </div>
  );
}
