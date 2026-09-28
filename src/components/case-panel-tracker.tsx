"use client";

import { useEffect, useRef } from "react";
import { trackCaseEvent } from "@/lib/track-case";

// Registra 1 "impression" por carregamento de página quando o painel do case
// fica ≥60% visível. Não renderiza nada; observa o painel (`[data-case-panel]`)
// onde foi montado.
export function CasePanelTracker({ slug, position }: { slug: string; position: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const panel = ref.current?.closest("[data-case-panel]");
    if (!panel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          trackCaseEvent(slug, "impression", position);
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(panel);
    return () => observer.disconnect();
  }, [slug, position]);

  return <span ref={ref} hidden />;
}
