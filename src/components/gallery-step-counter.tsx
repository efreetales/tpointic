"use client";

import { useState, type RefObject } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";

// A persistent circle badge that sits on top of the sticky-parallax gallery
// stack (`case-body.tsx`) and 3D-flips to the next step number as each panel
// takes over the screen. It's rendered ONCE, as a sibling AFTER the mapped
// panel `<div>`s inside the same track — being later in the DOM makes it
// paint on top of every panel automatically (no z-index juggling needed),
// and being `position: sticky` itself keeps it pinned at the same screen
// position for the whole scroll-through of the track, exactly like the
// panels underneath it. A badge living INSIDE a panel would just slide away
// with that panel when the next one covers it (that's normal — the whole
// point here is for the number to stay put and flip in place instead).
export function GalleryStepCounter({
  trackRef,
  total,
}: {
  trackRef: RefObject<HTMLDivElement | null>;
  total: number;
}) {
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(total - 1, Math.max(0, Math.floor(v * total)));
    setActive(idx);
  });

  // A zero-height `position: sticky` element, empirically, does NOT release
  // at the track's own bottom edge the way a `h-screen` panel does — it
  // just stays glued to the top of the viewport indefinitely, floating over
  // every section that comes after the gallery (confirmed by scrolling all
  // the way to the footer with it still pinned there). CSS sticky's native
  // release timing can't be trusted here, so visibility is driven
  // explicitly off the same scroll progress used for the flip: fully
  // opaque for the whole track, fading out only in the last sliver (right
  // as the last panel's own dwell ends) instead of vanishing abruptly.
  const opacity = useTransform(scrollYProgress, [0, 0.02, 0.97, 1], [0, 1, 1, 0]);

  return (
    // `top-0` here — NOT `top-1/2` (tried first, caused the flip to
    // desync from the panels: percentage `top` offsets on a `sticky`
    // element are resolved unreliably, and even where they "work" they
    // don't necessarily lock/release at the same scroll position as the
    // panels' own `top-0`). Sticking at `top-0` makes this wrapper engage
    // and release at EXACTLY the same scroll offsets as every panel (it's
    // the track's first child too, so its own "start sticking" point
    // coincides with panel 0's) — vertical centering is handled separately
    // below, on the inner circle, via `top-[50vh]` (a fixed viewport
    // offset, unrelated to when the sticky trigger fires).
    <motion.div
      style={{ opacity }}
      className="pointer-events-none sticky top-0 z-20 hidden h-0 lg:block"
    >
      <div className="absolute left-10 top-[50vh] -translate-y-1/2" style={{ perspective: 800 }}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={active}
            initial={{ rotateX: -100, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 100, opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-black text-black shadow-xl"
            style={{ backgroundColor: "#66fcf1", transformStyle: "preserve-3d" }}
          >
            {active + 1}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
