"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Semicircle gauge (-100 to 100) with the same three color bands used on the
// original NPS slides this component is meant to echo — red (detractor
// range, -100..0), amber (0..50), green (50..100) — plus a needle pointing
// at the measured value. Sized/spaced to sit next to `StatRing` in the same
// flex row (same ~220px column width, same label treatment below).
function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polar(cx, cy, r, startAngle);
  const end = polar(cx, cy, r, endAngle);
  const largeArc = startAngle - endAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

// value -100 -> angle 180 (left), value 100 -> angle 0 (right)
function angleForValue(value: number) {
  return 180 - ((value + 100) / 200) * 180;
}

export function NpsGauge({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const cx = 100;
  const cy = 100;
  const r = 80;
  const needleAngle = angleForValue(Math.max(-100, Math.min(100, value)));
  const needleTip = polar(cx, cy, r - 16, needleAngle);

  return (
    <div ref={ref} className="flex w-[220px] flex-col items-center">
      <div className="relative h-[130px] w-[200px] shrink-0">
        <svg className="h-full w-full" viewBox="0 0 200 115">
          <path d={arcPath(cx, cy, r, 180, 90)} fill="none" stroke="#e5484d" strokeWidth="14" />
          <path d={arcPath(cx, cy, r, 90, 45)} fill="none" stroke="#f5a623" strokeWidth="14" />
          <path d={arcPath(cx, cy, r, 45, 0)} fill="none" stroke="#3fa34d" strokeWidth="14" />
          <motion.line
            x1={cx}
            y1={cy}
            x2={needleTip.x}
            y2={needleTip.y}
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ rotate: 0, opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
          <circle cx={cx} cy={cy} r="5" fill="#fff" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <span className="text-3xl font-black text-white">{value}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">NPS</span>
        </div>
      </div>
      <p className="mt-3 text-center text-sm font-bold uppercase tracking-widest text-white/80">{label}</p>
    </div>
  );
}
