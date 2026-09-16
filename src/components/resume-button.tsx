import { Download } from "@mynaui/icons-react";

// Botão flutuante fixo na borda direita da tela, presente em todas as
// páginas públicas (montado no layout do grupo `(site)`) — baixa o PDF
// direto de `public/`, sem precisar de link externo.
export function ResumeButton() {
  return (
    <a
      href="/CV_Tales_Pereira.pdf"
      download="Tales-Pereira-Curriculo.pdf"
      className="group fixed bottom-6 right-0 z-40 flex items-center gap-2 rounded-l-full bg-black py-3 pl-5 pr-4 text-sm font-bold text-white shadow-lg transition-all hover:pl-6 hover:pr-5 hover:scale-105"
    >
      <span>Currículo</span>
      <Download size={18} />
    </a>
  );
}
