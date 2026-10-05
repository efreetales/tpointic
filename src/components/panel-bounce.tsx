"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";

// Compartilhado entre `CaseParallaxShowcase` (painéis de case) e
// `LeadershipPanel` (painel de liderança) — ambos fazem parte do MESMO
// carrossel sticky-stack da home, então precisam do mesmo "estica com
// bounce" no topo + parallax do conteúdo (referência: gravity-design.de,
// bloco "Manifest" logo após o hero).
//
// Importante: nada acima de y=0 da viewport é visível (é literalmente pra
// fora da tela), então a cúpula só pode aparecer ENQUANTO o painel ainda
// está se aproximando do topo (top > 0, ainda em fluxo normal, antes de
// grudar via `sticky`) — nunca depois que ele já colou em top:0. Por isso o
// gatilho é a posição de scroll (quão perto o painel está de colar), não um
// "acabou de colar", e a amplitude nunca passa de `top` (senão a cúpula
// vazaria pra fora da tela).
//
// O parallax, por sua vez, roda ao longo de TODA a janela em que o painel
// está pinado no topo: como cada painel tem exatamente 100vh, o PRÓXIMO já
// está entrando/cobrindo por baixo desde o instante em que este gruda no
// topo até o instante em que o próximo também gruda — não é uma fase
// separada "depois" de pinar. `rect.top` do painel fica 0 o tempo todo
// nessa janela (não serve pra medir nada); o progresso certo vem do scroll
// global relativo à posição de fluxo normal (`docTopRef`), não de
// `offsetTop` (relativo ao ancestral posicionado mais próximo, não ao
// documento) nem de `rect.top` sozinho.
export const WAVE_CAP_H = 220;
const WAVE_APPROACH = 480; // px de scroll antes de colar em que a animação toca
const WAVE_DOME_PX = 130; // pico da cúpula
const PARALLAX_PX = 140; // quanto o conteúdo arrasta enquanto é coberto

export function usePanelBounce(isFirst: boolean) {
  const panelRef = useRef<HTMLDivElement>(null);
  const waveMV = useMotionValue(0);
  const imgYMV = useMotionValue(0);
  const docTopRef = useRef<number | null>(null);

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
    const dome = Math.min(Math.max(0, v), WAVE_CAP_H - 10);
    return `M0,${WAVE_CAP_H} Q50,${WAVE_CAP_H - dome} 100,${WAVE_CAP_H} Z`;
  });

  return { panelRef, wavePath, imgYMV };
}

export function PanelWaveCap({
  bgColor,
  wavePath,
}: {
  bgColor: string;
  wavePath: MotionValue<string>;
}) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-x-0 z-20"
      style={{ top: -WAVE_CAP_H, height: WAVE_CAP_H, width: "100%" }}
      viewBox={`0 0 100 ${WAVE_CAP_H}`}
      preserveAspectRatio="none"
    >
      <motion.path fill={bgColor} d={wavePath} />
    </svg>
  );
}
