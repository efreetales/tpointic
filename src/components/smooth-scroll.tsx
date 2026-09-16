"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { cancelFrame, frame } from "framer-motion";

// `root` liga o Lenis direto no scroll nativo da `window` (em vez de criar
// um wrapper com transform) — por isso continua compatível com os vários
// painéis `position: sticky` usados no site (parallax de cases, sidebar de
// /sobre etc.), que quebrariam se o scroll virasse transform num container.
//
// `autoRaf: false` + sincronizar o `lenis.raf()` no scheduler de frame do
// próprio framer-motion (em vez do loop de rAF interno do Lenis) é o padrão
// oficial de integração Lenis+Motion — sem isso, os dois rodam loops de rAF
// independentes e fora de sincronia, e qualquer `useScroll`/`scrollYProgress`
// (como no carrossel vertical de /cases) pode ler uma posição de scroll
// "atrasada" nalguns frames, travando o índice ativo no meio do scroll.
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }
    frame.update(update, true);
    return () => cancelFrame(update);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ autoRaf: false, lerp: 0.1, duration: 1.2, smoothWheel: true }}
    >
      {children}
    </ReactLenis>
  );
}
