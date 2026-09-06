"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

/** Animates a stat string's number counting up from 0 on scroll into view,
 * keeping any prefix/suffix text intact (e.g. "-60%", "93%", "8"). Strings
 * with zero or more than one number (e.g. "60 → 80", "redução de chamadas")
 * just fade in as-is via the surrounding <Reveal>. */
export function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const digitRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const match = value.match(/-?\d+(?:[.,]\d+)?/);

  const target = match ? Number(match[0].replace(",", ".")) : 0;
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1000, bounce: 0 });

  useEffect(() => {
    if (inView && match) motionValue.set(target);
  }, [inView, target, motionValue, match]);

  useEffect(() => {
    if (!match) return;
    return spring.on("change", (v) => {
      if (digitRef.current) digitRef.current.textContent = Math.round(v).toString();
    });
  }, [spring, match]);

  if (!match) {
    return <span ref={ref}>{value}</span>;
  }

  const prefix = value.slice(0, match.index);
  const suffix = value.slice((match.index ?? 0) + match[0].length);

  return (
    <span ref={ref}>
      {prefix}
      <span ref={digitRef}>0</span>
      {suffix}
    </span>
  );
}
