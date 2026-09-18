"use client";

import { useEffect, useState } from "react";
import { Download } from "@mynaui/icons-react";

// Botão flutuante fixo na borda direita da tela, presente em todas as
// páginas públicas (montado no layout do grupo `(site)`) — baixa o PDF
// direto de `public/`, sem precisar de link externo.
//
// No mobile, `position: fixed` ancora no viewport GRANDE (ignora a barra
// de endereço do navegador), mas a área realmente visível encolhe quando
// essa barra aparece — um `bottom` fixo em rem ficava escondido atrás
// dela. `window.visualViewport` é a API feita pra medir exatamente esse
// viewport visível; a diferença entre ele e `window.innerHeight` vira
// respiro extra somado ao de sempre, recalculada sempre que a barra
// aparece/some (evento `resize` do próprio `visualViewport`).
const BASE_OFFSET = 24; // 1.5rem, o respiro original em bottom-6

export function ResumeButton() {
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

  return (
    <a
      href="/CV_Tales_Pereira.pdf"
      download="Tales-Pereira-Curriculo.pdf"
      className="group fixed right-0 z-40 flex items-center gap-2 rounded-l-full bg-black py-3 pl-5 pr-4 text-sm font-bold text-white shadow-lg transition-all hover:pl-6 hover:pr-5 hover:scale-105"
      style={{ bottom: `${BASE_OFFSET + extraOffset}px` }}
    >
      <span>Currículo</span>
      <Download size={18} />
    </a>
  );
}
