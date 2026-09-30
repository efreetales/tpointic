"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { CasePanelTracker } from "@/components/case-panel-tracker";
import { TrackedCaseLink } from "@/components/tracked-case-link";
import { ArrowUpRight } from "@mynaui/icons-react";
import type { Case } from "@/lib/cases";
import { MacbookVideo } from "@/components/macbook-screens";
import { getCaseBgColor, getCaseFlareColor } from "@/lib/case-colors";

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

// Altura reservada acima de cada painel pra caber a cúpula do "estica com
// bounce" (referência: gravity-design.de, bloco "Manifest" logo após o
// hero — o topo do painel que está cobrindo o anterior estica pra cima
// numa curva elástica e assenta, em vez de simplesmente deslizar reto).
//
// Importante: nada acima de y=0 da viewport é visível (é literalmente pra
// fora da tela), então a cúpula só pode aparecer ENQUANTO o painel ainda
// está se aproximando do topo (top > 0, ainda em fluxo normal, antes de
// grudar via `sticky`) — nunca depois que ele já colou em top:0. Por isso o
// gatilho é a posição de scroll (quão perto o painel está de colar), não um
// "acabou de colar", e a amplitude nunca passa de `top` (senão a cúpula
// vazaria pra fora da tela).
const WAVE_CAP_H = 220;
const WAVE_APPROACH = 480; // px de scroll antes de colar em que a animação toca
const WAVE_DOME_PX = 130; // pico da cúpula
// Quanto a imagem do case arrasta (em px) enquanto o painel dela está fixo
// no topo sendo coberto pelo próximo — mesma ideia de profundidade de um
// parallax clássico, só que escopada exatamente à janela de scroll em que
// o painel fica pinado (e não a página toda).
const PARALLAX_PX = 140;

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
  const panelRef = useRef<HTMLDivElement>(null);
  const waveMV = useMotionValue(0);
  const imgYMV = useMotionValue(0);

  // Posição "de fluxo normal" do painel (onde ele estaria sem o `sticky`),
  // em coordenadas de documento. `offsetTop` não serve — é relativo ao
  // ancestral posicionado mais próximo (o wrapper), não ao documento. E
  // `rect.top` sozinho também não: enquanto pinado, o `sticky` trava
  // `rect.top` em 0, escondendo a posição real. Mas fora dessa janela
  // (`rect.top !== 0`, seja acima — ainda não chegou — ou abaixo — já
  // passou), `scrollY + rect.top` SEMPRE dá a posição real; guardamos esse
  // valor toda vez que ele estiver disponível, e reaproveitamos enquanto o
  // painel estiver com `rect.top` grudado em 0.
  const docTopRef = useRef<number | null>(null);

  // Um único loop por painel cuida de duas coisas, ambas função direta da
  // posição real de scroll (nunca um "disparo" no tempo, então funciona
  // igual rolando rápido/devagar, com trackpad ou roda do mouse):
  //
  // 1) Cúpula do bounce, enquanto o painel ainda está se aproximando do
  //    topo (`top` positivo, dentro da janela `WAVE_APPROACH`) — um seno
  //    simples dá o "sobe e desce"; um segundo termo menor e defasado dá a
  //    ondulação extra do "bounce" ao assentar.
  // 2) Parallax da imagem, ao longo de TODA a janela em que o painel está
  //    pinado no topo: como cada painel tem exatamente 100vh, o PRÓXIMO já
  //    está entrando/cobrindo por baixo desde o instante em que este gruda
  //    no topo até o instante em que o próximo também gruda — não é uma
  //    fase separada "depois" de pinar. `rect.top` deste painel fica 0 o
  //    tempo todo aí (não serve); o progresso certo vem do scroll global
  //    relativo à posição de fluxo normal (`docTopRef`).
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = panelRef.current;
      if (el) {
        const top = el.getBoundingClientRect().top;
        if (top !== 0) docTopRef.current = window.scrollY + top;

        if (!isFirst) {
          const clampedTop = Math.max(0, Math.min(WAVE_APPROACH, top));
          const progress = 1 - clampedTop / WAVE_APPROACH; // 0 = longe, 1 = colando
          const raw =
            WAVE_DOME_PX *
            (Math.sin(progress * Math.PI) -
              0.22 * progress * Math.sin(progress * Math.PI * 3));
          // Nunca deixa a cúpula passar de `clampedTop`: além disso ela
          // vazaria pra fora da viewport (ver nota acima da constante).
          waveMV.set(Math.max(0, Math.min(clampedTop, raw)));
        }
        if (docTopRef.current !== null) {
          const panelH = el.offsetHeight || window.innerHeight;
          const coverProgress = Math.max(
            0,
            Math.min(1, (window.scrollY - docTopRef.current) / panelH),
          );
          imgYMV.set(coverProgress * -PARALLAX_PX);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isFirst, waveMV, imgYMV]);

  const wavePath = useTransform(waveMV, (v) => {
    // Trava a crista dentro da própria altura reservada (`WAVE_CAP_H`): o
    // spring pode passar um pouco do alvo (é o que dá o "bounce"), mas sem
    // isso um overshoot maior estourava o viewBox do SVG e cortava a curva.
    const dome = Math.min(Math.max(0, v), WAVE_CAP_H - 10);
    return `M0,${WAVE_CAP_H} Q50,${WAVE_CAP_H - dome} 100,${WAVE_CAP_H} Z`;
  });

  const img = PANEL_IMG_NATURAL[c.slug];

  return (
    <div
      ref={panelRef}
      data-case-panel={c.slug}
      className="sticky top-0 flex h-screen w-full flex-col lg:flex-row"
      style={{ backgroundColor: bgColor }}
    >
      {!isFirst && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-x-0 z-20"
          style={{ top: -WAVE_CAP_H, height: WAVE_CAP_H, width: "100%" }}
          viewBox={`0 0 100 ${WAVE_CAP_H}`}
          preserveAspectRatio="none"
        >
          <motion.path fill={bgColor} d={wavePath} />
        </svg>
      )}

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
