"use client";

import { useEffect, useState, type RefObject } from "react";

// Draws a dashed curve from one element to another, both inside the same
// positioned `containerRef` — used to visually link a specific bullet in
// `conteudo` to the sticky video beside it (ex. UOL Deezer: "Entrevistas com
// usuários e testes de usabilidade..." → the video that shows exactly that).
// Coordinates are computed relative to `containerRef`, not the viewport, so
// the line stays correct wherever the container itself sits on the page.
//
// Needs a live recompute loop, not a one-time measurement: the target is
// `position: sticky`, so its position relative to the (scrolling) container
// keeps changing as the page scrolls — a static line would drift out of
// place within a few pixels of scrolling. Recomputes on scroll/resize
// (covers the sticky repositioning) plus a short rAF burst right after
// mount (covers the `Reveal` fade-in settling and any late layout shift).
export function ConnectorLine({
  containerRef,
  fromRef,
  toRef,
}: {
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
}) {
  const [line, setLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  useEffect(() => {
    function update() {
      const container = containerRef.current;
      const from = fromRef.current;
      const to = toRef.current;
      if (!container || !from || !to) {
        setLine(null);
        return;
      }
      const cRect = container.getBoundingClientRect();
      const fRect = from.getBoundingClientRect();
      const tRect = to.getBoundingClientRect();
      setLine({
        x1: fRect.right - cRect.left,
        y1: fRect.top + fRect.height / 2 - cRect.top,
        x2: tRect.left - cRect.left,
        y2: tRect.top + tRect.height / 2 - cRect.top,
      });
    }

    let rafId: number | undefined;
    let stop = false;
    const start = performance.now();
    function burst() {
      update();
      if (!stop && performance.now() - start < 1200) rafId = requestAnimationFrame(burst);
    }
    burst();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      stop = true;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [containerRef, fromRef, toRef]);

  if (!line) return null;
  const midX = (line.x1 + line.x2) / 2;

  return (
    <svg className="pointer-events-none absolute inset-0 z-20 hidden h-full w-full overflow-visible lg:block" aria-hidden>
      <path
        d={`M ${line.x1} ${line.y1} C ${midX} ${line.y1}, ${midX} ${line.y2}, ${line.x2} ${line.y2}`}
        fill="none"
        stroke="#66fcf1"
        strokeWidth="2"
        strokeDasharray="5 6"
        opacity={0.8}
      />
      <circle cx={line.x1} cy={line.y1} r="4" fill="#66fcf1" />
    </svg>
  );
}
