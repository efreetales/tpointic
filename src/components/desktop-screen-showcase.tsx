"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "@mynaui/icons-react";

type Screen = { src: string; alt: string };

// Desktop/laptop screenshots (16:9-ish, wide) don't fit the vertical
// marquee-columns pattern used for phone screens — squished into a ~250px
// column they become illegible. This offers a horizontal carousel (compact,
// one screen at a time) or a stacked list (every screen visible via normal
// scroll) and lets the visitor pick. Either mode opens a fullscreen lightbox
// on click, showing the screenshot uncropped (object-contain vs. the
// thumbnails' object-cover).
export function DesktopScreenShowcase({ screens }: { screens: Screen[] }) {
  const [mode, setMode] = useState<"carousel" | "stacked">("carousel");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Infinite carousel via the standard clone-edges trick: a duplicate of the
  // last screen is prepended and a duplicate of the first is appended, so
  // scrolling past either end always lands on a real-looking neighbor. Once
  // the scroll settles on a clone, we silently (no animation) snap back to
  // the matching real card — the visitor never sees the jump, just an
  // endless loop. Only worth doing with 2+ screens.
  const loop = useMemo(
    () => (screens.length > 1 ? [screens[screens.length - 1], ...screens, screens[0]] : screens),
    [screens],
  );
  const hasClones = screens.length > 1;

  useEffect(() => setMounted(true), []);

  // Start the track on the first real card (index 1 in `loop`), past the
  // leading clone — instant, before paint, so there's no visible scroll.
  useLayoutEffect(() => {
    if (!hasClones) return;
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const step = (card?.offsetWidth ?? 0) + 24;
    track.scrollLeft = step;
  }, [hasClones]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i === null ? i : (i - 1 + screens.length) % screens.length));
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i === null ? i : (i + 1) % screens.length));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIndex, screens.length]);

  const scrollByCard = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const amount = (card?.offsetWidth ?? 800) + 24;
    track.scrollBy({ left: amount * dir, behavior: "smooth" });
  };

  // After scrolling stops (arrow click, swipe, or trackpad), check whether
  // the track settled on a cloned edge card and — if so — jump instantly to
  // the equivalent real card on the opposite end.
  const handleScroll = () => {
    if (!hasClones) return;
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      const track = trackRef.current;
      if (!track) return;
      const card = track.querySelector<HTMLElement>("[data-card]");
      const step = (card?.offsetWidth ?? 0) + 24;
      if (step === 0) return;
      const nearest = Math.round(track.scrollLeft / step);
      if (nearest === 0) {
        track.scrollLeft = screens.length * step;
      } else if (nearest === loop.length - 1) {
        track.scrollLeft = step;
      }
    }, 120);
  };

  const lightbox = lightboxIndex !== null && (
    <div className="site-theme">
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
        onClick={() => setLightboxIndex(null)}
      >
        <button
          type="button"
          onClick={() => setLightboxIndex(null)}
          aria-label="Fechar"
          className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:text-white"
        >
          <X size={26} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setLightboxIndex((i) => (i === null ? i : (i - 1 + screens.length) % screens.length));
          }}
          aria-label="Tela anterior"
          className="absolute left-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-white hover:text-white sm:left-6"
        >
          <ArrowLeft size={20} />
        </button>

        <div
          className="relative h-full max-h-[85vh] w-full max-w-6xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={screens[lightboxIndex].src}
            alt={screens[lightboxIndex].alt}
            fill
            className="object-contain"
            sizes="100vw"
          />
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setLightboxIndex((i) => (i === null ? i : (i + 1) % screens.length));
          }}
          aria-label="Próxima tela"
          className="absolute right-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-white hover:text-white sm:right-6"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-10 flex justify-center gap-2 px-6">
        <button
          type="button"
          onClick={() => setMode("carousel")}
          className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
            mode === "carousel" ? "bg-coral text-black" : "border border-border text-slate hover:border-coral hover:text-coral"
          }`}
        >
          Carrossel
        </button>
        <button
          type="button"
          onClick={() => setMode("stacked")}
          className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
            mode === "stacked" ? "bg-coral text-black" : "border border-border text-slate hover:border-coral hover:text-coral"
          }`}
        >
          Lista
        </button>
      </div>

      {mode === "carousel" ? (
        <div className="relative">
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-[max(1.5rem,calc((100%-720px)/2))] [&::-webkit-scrollbar]:hidden"
          >
            {loop.map((s, i) => {
              const realIndex = !hasClones ? i : (i - 1 + screens.length) % screens.length;
              return (
                <button
                  key={`${s.src}-${i}`}
                  type="button"
                  data-card
                  onClick={() => setLightboxIndex(realIndex)}
                  className="group relative aspect-video w-[85vw] shrink-0 snap-center cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-surface sm:w-[720px]"
                >
                  <Image src={s.src} alt={s.alt} fill className="object-cover transition-transform group-hover:scale-[1.02]" sizes="(min-width: 640px) 720px, 85vw" />
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Tela anterior"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-navy transition-colors hover:border-coral hover:text-coral"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Próxima tela"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-navy transition-colors hover:border-coral hover:text-coral"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6">
          {screens.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="group relative aspect-video w-full cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <Image src={s.src} alt={s.alt} fill className="object-cover transition-transform group-hover:scale-[1.02]" sizes="(min-width: 1024px) 900px, 100vw" />
            </button>
          ))}
        </div>
      )}

      {mounted && lightbox && createPortal(lightbox, document.body)}
    </div>
  );
}
