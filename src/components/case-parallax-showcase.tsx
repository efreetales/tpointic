import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@mynaui/icons-react";
import type { Case } from "@/lib/cases";
import { getCaseBgColor } from "@/lib/case-colors";

// Same sticky-stack parallax pattern used inside case pages for the impact
// gallery (`case-body.tsx`) — each panel covers the previous one while
// scrolling. Reused here on the homepage to showcase 3 cases with more
// impact than a plain card grid. No `overflow-hidden` on any ancestor: the
// children rely on `position: sticky`, which breaks under non-visible
// overflow on a parent (documented in the tpointic-wow-case skill).

// Product-shot PNGs (transparent background, no bleed-worthy edges) look
// bad stretched full-bleed with object-cover — a low-res mockup blown up to
// fill a 62vw-by-100vh column turns to mush. These render at their own
// intrinsic size (never upscaled), centered in the panel instead.
//
// `maxDisplayWidth` is a hard cap independent of viewport size: with only
// `max-h-full max-w-full` (percentages of the column), a very high-res
// source — e.g. the Sulamérica shot's 4040px intrinsic width — just keeps
// scaling up to fill the column on large monitors, since the column itself
// grows with the screen. Capping the display width keeps it a consistent
// size regardless of how big the visitor's screen is.
const PANEL_IMG_NATURAL: Record<
  string,
  { width: number; height: number; maxDisplayWidth: number }
> = {
  "agendamento-online-sulamerica": { width: 4040, height: 3652, maxDisplayWidth: 620 },
  "uol-musica-deezer": { width: 829, height: 483, maxDisplayWidth: 640 },
  "e-sim-vivo-empresas": { width: 829, height: 483, maxDisplayWidth: 640 },
};

// Flare color echoes each panel's own background (a lighter tint of it)
// instead of a fixed accent — reads as ambient bloom from that background
// rather than a spotlight dropped on top of it.
const PANEL_FLARE_BY_SLUG: Record<string, string> = {
  "agendamento-online-sulamerica": "#38BDF8", // bright sky blue, visible against the navy panel
  "uol-musica-deezer": "#D946EF", // bright fuchsia, visible against the dark purple panel
  "e-sim-vivo-empresas": "#C084FC", // bright lilac, visible against the dark Vivo purple panel
};
const PANEL_FLARE_FALLBACK = "#66fcf1";

export function CaseParallaxShowcase({ cases }: { cases: Case[] }) {
  return (
    <div className="relative">
      {cases.map((c, i) => {
        return (
          <div
            key={c.id}
            className="sticky top-0 flex h-screen w-full flex-col lg:flex-row"
            style={{ backgroundColor: getCaseBgColor(c.slug, i) }}
          >
            <div className="flex flex-1 flex-col justify-center px-6 py-10 lg:w-[38%] lg:flex-none lg:px-16">
              <p className="text-xs font-bold uppercase tracking-widest text-coral">
                Case em destaque
              </p>
              <h3 className="mt-3 max-w-lg text-3xl font-black leading-tight text-white sm:text-5xl">
                {c.titulo}
              </h3>
              {c.resumo && (
                <p className="mt-4 max-w-md text-white/75">{c.resumo}</p>
              )}
              <Link
                href={`/cases/${c.slug}`}
                className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
              >
                Ver case completo
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>

            <div className="relative flex-1 lg:w-[62%] lg:flex-none">
              {c.capa_url && (PANEL_IMG_NATURAL[c.slug] ? (
                <div className="relative z-10 h-full w-full">
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                    style={{ width: `min(100%, ${PANEL_IMG_NATURAL[c.slug].maxDisplayWidth}px)` }}
                  >
                    {/* Flare — soft glow centered behind the product shot,
                        sized off the image's own box (not the column), so
                        it stays centered on it regardless of image size.
                        Tinted with a lighter version of the panel's own
                        background instead of a fixed accent color, so it
                        reads as ambient bloom rather than a dropped-in
                        spotlight. */}
                    <div
                      className="pointer-events-none absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[60px]"
                      style={{ backgroundColor: PANEL_FLARE_BY_SLUG[c.slug] ?? PANEL_FLARE_FALLBACK }}
                    />
                    <Image
                      src={c.capa_url}
                      alt={c.titulo}
                      width={PANEL_IMG_NATURAL[c.slug].width}
                      height={PANEL_IMG_NATURAL[c.slug].height}
                      className="relative h-auto w-auto max-h-full object-contain"
                      style={{ maxWidth: `min(100%, ${PANEL_IMG_NATURAL[c.slug].maxDisplayWidth}px)` }}
                    />
                  </div>
                </div>
              ) : (
                <Image
                  src={c.capa_url}
                  alt={c.titulo}
                  fill
                  className="relative z-10 object-cover"
                  style={{ objectPosition: c.capa_focal ?? "center" }}
                  sizes="(min-width: 1024px) 62vw, 100vw"
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
