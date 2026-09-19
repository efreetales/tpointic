"use client";

import { Download } from "@mynaui/icons-react";
import { useSafeBottomOffset } from "@/lib/use-safe-bottom-offset";

// Botão flutuante fixo na borda direita da tela, presente em todas as
// páginas públicas (montado no layout do grupo `(site)`) — baixa o PDF
// direto de `public/`, sem precisar de link externo.
const BASE_OFFSET = 24; // 1.5rem, o respiro original em bottom-6

export function ResumeButton() {
  const bottom = useSafeBottomOffset(BASE_OFFSET);

  return (
    <a
      href="/CV_Tales_Pereira.pdf"
      download="Tales-Pereira-Curriculo.pdf"
      className="group fixed right-0 z-40 flex items-center gap-2 rounded-l-full bg-black py-3 pl-5 pr-4 text-sm font-bold text-white shadow-lg transition-all hover:pl-6 hover:pr-5 hover:scale-105"
      style={{ bottom: `${bottom}px` }}
    >
      <span>Currículo</span>
      <Download size={18} />
    </a>
  );
}
