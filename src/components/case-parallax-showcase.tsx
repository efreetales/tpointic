"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CasePanelTracker } from "@/components/case-panel-tracker";
import { TrackedCaseLink } from "@/components/tracked-case-link";
import { ArrowUpRight } from "@mynaui/icons-react";
import type { Case } from "@/lib/cases";
import { MacbookVideo } from "@/components/macbook-screens";
import { getCaseBgColor, getCaseFlareColor } from "@/lib/case-colors";
import { usePanelBounce, PanelWaveCap } from "@/components/panel-bounce";

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
  "agendamento-online-sulamerica": {
    width: 4040,
    height: 3652,
    maxDisplayWidth: 620,
  },
  "uol-musica-deezer": { width: 829, height: 483, maxDisplayWidth: 640 },
  "e-sim-vivo-empresas": { width: 829, height: 483, maxDisplayWidth: 640 },
  // Capa = MacBook (moldura + tela do app) montado em PNG transparente.
  "pet-ia": { width: 1370, height: 835, maxDisplayWidth: 760 },
};

// Cases cujo painel mostra o `video_url` dentro do MacBook (mudo, em loop) em
// vez da imagem de capa. A capa continua sendo o fallback (sem vídeo .mp4).
const PANEL_MACBOOK_VIDEO = new Set(["pet-ia"]);

// O "estica com bounce" do topo + o parallax do conteúdo (referência:
// gravity-design.de, bloco "Manifest" logo após o hero) vivem em
// `panel-bounce.tsx`, compartilhados com `LeadershipPanel` — os dois fazem
// parte do MESMO carrossel sticky-stack da home.

function CasePanel({
  c,
  i,
  bgColor,
  isFirst,
}: {
  c: Case;
  i: number;
  bgColor: string;
  isFirst: boolean;
}) {
  const { panelRef, wavePath, imgYMV } = usePanelBounce(isFirst);
  const img = PANEL_IMG_NATURAL[c.slug];

  return (
    <div
      ref={panelRef}
      data-case-panel={c.slug}
      className="sticky top-0 flex h-screen w-full flex-col lg:flex-row"
      style={{ backgroundColor: bgColor }}
    >
      {!isFirst && <PanelWaveCap bgColor={bgColor} wavePath={wavePath} />}

      <CasePanelTracker slug={c.slug} position={i + 1} />
      <div className="flex flex-1 flex-col justify-center px-6 py-10 lg:w-[38%] lg:flex-none lg:px-16">
        <p className="text-xs font-bold uppercase tracking-widest text-coral">
          Case em destaque
        </p>
        <h3 className="mt-3 max-w-lg text-3xl font-black leading-tight text-white sm:text-5xl">
          {c.titulo}
        </h3>
        {c.resumo && <p className="mt-4 max-w-md text-white/75">{c.resumo}</p>}
        <TrackedCaseLink
          slug={c.slug}
          position={i + 1}
          href={`/cases/${c.slug}`}
          className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
        >
          Ver case completo
          <ArrowUpRight
            size={18}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </TrackedCaseLink>
      </div>

      <div className="relative flex-1 lg:w-[62%] lg:flex-none">
        {c.capa_url &&
          (img ? (
            <div className="relative h-full w-full">
              {/* Flare — soft glow centered behind the product shot,
                  sized off a box with the image's own proportions (not
                  the column), so it stays centered on it regardless of
                  image size. Tinted with a lighter version of the
                  panel's own background instead of a fixed accent
                  color, and blended with `mix-blend-overlay` so it
                  reads as ambient bloom, not a dropped-in spotlight.

                  Layer separada da imagem (e centralizada com flex, não
                  com `translate`/`transform`) de propósito: `mix-blend`
                  só mistura com o que está no MESMO stacking context, e
                  qualquer ancestral com `transform`/`translate`/`z-index`
                  isola o flare do bg do painel — o blend virava mistura
                  normal sem ninguém perceber. Por isso o parallax
                  (`imgYMV`, que aplica `transform`) fica só na camada da
                  imagem abaixo, nunca como ancestral do flare. */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-end">
                <div
                  className="relative"
                  style={{
                    width: `min(100%, ${img.maxDisplayWidth}px)`,
                    aspectRatio: `${img.width} / ${img.height}`,
                  }}
                >
                  <div
                    className="absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 mix-blend-overlay blur-[60px]"
                    style={{ backgroundColor: getCaseFlareColor(bgColor) }}
                  />
                </div>
              </div>
              {/* Centraliza verticalmente com flex (`inset-y-0` + `items-center`)
                  em vez do costumeiro `top-1/2 -translate-y-1/2`: o parallax
                  (`y: imgYMV`) já usa `transform` pra se mover, e o Motion
                  escreve esse `transform` direto no estilo inline — o que
                  sobrescreveria (não soma com) uma classe de `translate`
                  no mesmo elemento. */}
              <motion.div
                className="absolute inset-y-0 right-0 flex items-center"
                style={{
                  width: `min(100%, ${img.maxDisplayWidth}px)`,
                  y: imgYMV,
                }}
              >
                {PANEL_MACBOOK_VIDEO.has(c.slug) &&
                c.video_url?.endsWith(".mp4") ? (
                  <MacbookVideo src={c.video_url} />
                ) : (
                  <Image
                    src={c.capa_url}
                    alt={c.titulo}
                    width={img.width}
                    height={img.height}
                    className="relative h-auto w-auto max-h-full object-contain"
                    style={{ maxWidth: `min(100%, ${img.maxDisplayWidth}px)` }}
                  />
                )}
              </motion.div>
            </div>
          ) : (
            <motion.div
              className="relative h-full w-full"
              style={{ y: imgYMV }}
            >
              <Image
                src={c.capa_url}
                alt={c.titulo}
                fill
                className="relative z-10 object-cover"
                style={{ objectPosition: c.capa_focal ?? "center" }}
                sizes="(min-width: 1024px) 62vw, 100vw"
              />
            </motion.div>
          ))}
      </div>
    </div>
  );
}

// `children` = painéis extras (mesmo formato sticky) que entram depois dos
// cases, ex. o de liderança.
export function CaseParallaxShowcase({
  cases,
  children,
}: {
  cases: Case[];
  children?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-x-clip">
      {cases.map((c, i) => (
        <CasePanel
          key={c.id}
          c={c}
          i={i}
          bgColor={getCaseBgColor(c.slug, i)}
          isFirst={i === 0}
        />
      ))}
      {children}
    </div>
  );
}
