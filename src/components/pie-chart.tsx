"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { PieChartData } from "@/lib/cases";

// Generic categorical palette — not tied to any one case's brand colors
// (`style_guide.colors` is for that), just enough visually distinct hues to
// tell 4-6 slices apart. Falls back to this when a slice has no `color`.
const PIE_PALETTE = ["#66fcf1", "#ef8354", "#3fa34d", "#2e86c1", "#f5c344", "#e5484d"];

export function PieChart({ title, slices, total: totalOverride }: PieChartData) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  // `total` drives the proportions (always accurate: it's the sum of
  // whatever `value` holds, counts or percentages). The center label uses
  // `totalOverride` when given, since a percentage-based chart's `total` is
  // always 100 and would misreport the source's real count otherwise.
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const displayTotal = totalOverride ?? total;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;
  const segments = slices.map((s, i) => {
    const fraction = total > 0 ? s.value / total : 0;
    const dash = circumference * fraction;
    const seg = {
      slice: s,
      dash,
      offset: cumulative,
      color: s.color ?? PIE_PALETTE[i % PIE_PALETTE.length],
      percent: Math.round(fraction * 100),
    };
    cumulative += dash;
    return seg;
  });

  return (
    <div ref={ref} className="flex flex-col items-center">
      <p className="text-center text-sm font-bold uppercase tracking-widest text-slate">{title}</p>
      <div className="relative mt-8 h-[200px] w-[200px] shrink-0">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="34" />
          {segments.map((seg, i) => (
            <motion.circle
              key={seg.slice.label}
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="34"
              strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
              strokeDashoffset={-seg.offset}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              style={{ transformOrigin: "100px 100px" }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-navy">{displayTotal}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray">total</span>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-2">
        {segments.map((seg) => (
          <div key={seg.slice.label} className="flex items-center gap-2.5 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="font-black text-navy">{seg.percent}%</span>
            <span className="text-slate">{seg.slice.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
