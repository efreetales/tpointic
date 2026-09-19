"use client";

import { useEffect, useState } from "react";

// Compartilhado entre botões flutuantes fixos no rodapé (Currículo,
// carimbo de coração) — extraído do `resume-button.tsx` original. No
// mobile, `position: fixed` ancora no viewport GRANDE (ignora a barra de
// endereço do navegador), mas a área realmente visível encolhe quando essa
// barra aparece — um `bottom` fixo em rem ficava escondido atrás dela.
// `window.visualViewport` mede exatamente esse viewport visível; a
// diferença entre ele e `window.innerHeight` vira respiro extra somado ao
// de sempre, recalculada sempre que a barra aparece/some.
export function useSafeBottomOffset(base: number) {
  const [extraOffset, setExtraOffset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      setExtraOffset(Math.max(0, window.innerHeight - vv.height));
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return base + extraOffset;
}
