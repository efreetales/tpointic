"use client";

import { ReactLenis } from "lenis/react";

// `root` liga o Lenis direto no scroll nativo da `window` (em vez de criar
// um wrapper com transform) — por isso continua compatível com os vários
// painéis `position: sticky` usados no site (parallax de cases, sidebar de
// /sobre etc.), que quebrariam se o scroll virasse transform num container.
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
