"use client";

import { useEffect, useState } from "react";
import { HeartSolid } from "@mynaui/icons-react";
import { createClient } from "@/lib/supabase/client";
import { useSafeBottomOffset } from "@/lib/use-safe-bottom-offset";

// Deixa o visitante "carimbar" um coraçãozinho em qualquer ponto exato de
// qualquer página, com duplo clique — vira dado bruto de "o que as pessoas
// curtiram no site", visualizado depois em /admin/curtidas como um overlay
// sobre a própria página (não é heatmap agregado tipo Clarity, é o gesto
// intencional de cada visitante).
//
// Duplo clique direto na página (sem um "modo carimbar" prévio) — mais
// simples pro visitante e sem precisar de um overlay cobrindo a tela
// inteira pra capturar o clique (esse overlay chegou a interceptar cliques
// de forma inesperada durante os testes). O botão flutuante aqui vira só
// uma explicação de como o recurso funciona, não um liga/desliga.
//
// Posição salva como % da página INTEIRA (scrollWidth/scrollHeight, não só
// o viewport visível) — assim um coração carimbado no rodapé continua
// mapeado pro rodapé independente da altura da tela de quem carimbou.
//
// `area` identifica QUAL seção foi curtida sem precisar marcar cada
// componente do site na mão: sobe do ponto clicado até o `<section>` (ou
// `<header>`/`<footer>`/`nav`) mais próximo e usa o título (h1–h4) de
// dentro dele como label — todo bloco de conteúdo do site já tem um desses,
// então isso generaliza pra qualquer página, atual ou futura, sem trabalho
// extra. Cai pro título da própria página quando não acha nada.
type Burst = { id: number; x: number; y: number };

const BASE_OFFSET = 24; // 1.5rem, igual ResumeButton

function findLikedArea(target: EventTarget | null): string {
  if (!(target instanceof Element)) return document.title;

  const header = target.closest("header");
  if (header) return "Cabeçalho / navegação";
  const footer = target.closest("footer");
  if (footer) return "Rodapé";

  const section = target.closest("section, article");
  if (section) {
    const heading = section.querySelector("h1, h2, h3, h4");
    const label = heading?.textContent?.trim();
    if (label) return label.slice(0, 80);
  }

  return document.title;
}

export function LikeStamper() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [showHint, setShowHint] = useState(false);
  const bottom = useSafeBottomOffset(BASE_OFFSET);

  useEffect(() => {
    const onDblClick = async (e: MouseEvent) => {
      // Evita disparar em cima de texto selecionável e evita o efeito
      // colateral padrão do duplo clique (selecionar a palavra debaixo).
      const selection = window.getSelection();
      selection?.removeAllRanges();

      const doc = document.documentElement;
      const xPct = ((e.clientX + window.scrollX) / doc.scrollWidth) * 100;
      const yPct = ((e.clientY + window.scrollY) / doc.scrollHeight) * 100;
      const area = findLikedArea(e.target);

      const id = Date.now();
      setBursts((b) => [...b, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setBursts((b) => b.filter((burst) => burst.id !== id)), 900);

      const supabase = createClient();
      await supabase.from("page_likes").insert({
        path: window.location.pathname,
        x_pct: xPct,
        y_pct: yPct,
        area,
      });
    };

    document.addEventListener("dblclick", onDblClick);
    return () => document.removeEventListener("dblclick", onDblClick);
  }, []);

  return (
    <>
      {/* Camada de animação — sempre `pointer-events-none`, nunca bloqueia
          nenhum clique da página, só desenha o coração subindo e sumindo. */}
      <div className="pointer-events-none fixed inset-0 z-[60]">
        {bursts.map((b) => (
          <HeartSolid
            key={b.id}
            size={32}
            className="like-burst absolute text-[#ff4d6d]"
            style={{ left: b.x - 16, top: b.y - 16 }}
          />
        ))}
      </div>

      {showHint && (
        <div
          className="fixed z-[70] max-w-[220px] rounded-2xl bg-black px-4 py-3 text-sm font-bold text-white shadow-lg"
          style={{ right: 16, bottom: bottom + 56 }}
        >
          Dê um duplo clique em qualquer parte do site pra deixar um ❤️ e mostrar o que você curtiu.
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowHint((v) => !v)}
        aria-label="Como curtir partes do site"
        className="fixed z-[70] flex h-11 w-11 items-center justify-center rounded-full bg-black text-white shadow-lg transition-all hover:scale-110"
        style={{ right: 133, bottom }}
      >
        <HeartSolid size={18} className="animate-heart-pulse text-[#ff4d6d]" />
      </button>
    </>
  );
}
