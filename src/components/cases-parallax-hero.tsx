"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight } from "@mynaui/icons-react";
import type { Case } from "@/lib/cases";
import { getCaseBgColor } from "@/lib/case-colors";

// Vídeo do hero PINADO (um único `position: sticky` que nunca troca) pelo
// scroll inteiro da página de cases — o texto/cards em cima dele é que
// trocam. Diferente do padrão sticky-stack usado em `case-parallax-showcase`
// (vários painéis empilhados, cada um com fundo sólido cobrindo o anterior):
// aqui não há vários painéis — a "trilha" é só o track alto que dá ao vídeo
// espaço de sobra pra ficar grudado, e o conteúdo em primeiro plano troca via
// `AnimatePresence` conforme o progresso do scroll (mesmo padrão de
// scroll->índice do `GalleryStepCounter`), não por posição no documento.
//
// Sem slide de introdução: o próprio vídeo já mostra a palavra "CASES"
// sendo digitada na tela — repetir o título aqui em cima (+ o "Cases" do
// menu) seria informação redundante 3x na mesma tela. O primeiro case da
// lista já aparece de cara, com uma dica de scroll embutida no card.
export function CasesParallaxHero({ cases }: { cases: Case[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideCount = cases.length;
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(slideCount - 1, Math.max(0, Math.floor(v * slideCount)));
    setActive(idx);
  });

  // Clique no índice pula pro MEIO da janela de scroll daquele slide (não na
  // borda) — evita cair bem na costura entre dois slides, onde um pixel de
  // diferença já mostraria o vizinho em vez do escolhido.
  function goTo(i: number) {
    const el = trackRef.current;
    if (!el) return;
    const trackTop = el.getBoundingClientRect().top + window.scrollY;
    const trackHeight = el.offsetHeight;
    const progress = (i + 0.5) / slideCount;
    const targetY = trackTop + progress * (trackHeight - window.innerHeight);
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }

  // `onMouseDown` com preventDefault (nos botões do índice, abaixo) evita
  // que o clique também FOQUE o botão — um botão focado dentro da área
  // sticky-pinada é "trazido pra vista" pelo próprio navegador (scroll de
  // foco padrão), o que brigava com o scrollTo acima e fazia o destino real
  // ficar uns bons pixels além do pretendido.

  const activeCase = cases[active];

  return (
    <div ref={trackRef} className="relative" style={{ height: `${slideCount * 100}vh` }}>
      <div
        className="sticky top-0 flex h-screen w-full items-center overflow-hidden bg-white"
        style={{
          marginTop: "calc(-1 * var(--nav-h, 0px))",
          paddingTop: "var(--nav-h, 0px)",
        }}
      >
        {/* `sr-only` — sem título visível (o próprio vídeo já mostra "CASES"),
            mas a página ainda precisa de um h1 real pra SEO/acessibilidade. */}
        <h1 className="sr-only">Cases</h1>

        {/* Escondido no mobile — vídeo de fundo full-bleed pesa demais pra
            conexão/CPU de celular e no fim das contas é só decorativo (o
            card em primeiro plano já carrega toda a informação). Some
            atrás do `bg-white` do container. */}
        <video
          src="https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/hero-cases-typing.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 hidden h-full w-full object-cover lg:block"
          style={{ objectPosition: "78% center" }}
        />

        {/* Véu branco translúcido atrás do menu — garante contraste do
            header em qualquer frame do vídeo (ver cases/page.tsx original). */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 bg-white/55"
          style={{ height: "var(--nav-h, 0px)" }}
        />

        {/* Degradê branco por cima do vídeo, do lado onde o texto/card fica
            — mascara o corte do object-cover e a sujeira de compressão do
            fundo "quase branco" do próprio vídeo. */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-[42%]"
          style={{ background: "linear-gradient(to right, transparent, white 45%)" }}
        />

        {/* Índice vertical — mostra quantos cases existem e qual está ativo,
            clicável pra pular direto. Fica na faixa entre o card e a borda
            da tela (mesma área que o degradê branco já cobre, então tem
            contraste garantido independente do que estiver passando no
            vídeo atrás — ao contrário da tentativa anterior, colada à
            esquerda, que ficava em cima do boneco e sumia contra o tatoo/
            pele escura dele). Só números, sem risco/linha: a faixa
            disponível ali é estreita (é só o padding direito do conteúdo
            menos a scrollbar), não sobra largura pra mais que isso. Só em
            telas grandes: no mobile essa faixa praticamente não existe. */}
        <div className="pointer-events-none absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 lg:right-3 lg:block xl:right-4">
          <div className="pointer-events-auto flex flex-col items-end gap-2">
            {cases.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => goTo(i)}
                onMouseDown={(e) => e.preventDefault()}
                aria-label={`Ir para o case ${c.titulo}`}
                aria-current={i === active}
                className={`tabular-nums font-bold transition-all ${
                  i === active
                    ? "rounded-md bg-[#058fa1] px-2 py-1 text-base text-white"
                    : "px-2 py-1 text-sm text-[#1a1a1a]/35 hover:text-[#1a1a1a]/70"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex w-full justify-end px-6 lg:px-16 xl:px-24">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeCase.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex w-full max-w-sm flex-col items-end lg:max-w-md"
            >
              <Link
                href={`/cases/${activeCase.slug}`}
                className="group block w-full overflow-hidden rounded-2xl border border-[#e5e5e7] bg-white shadow-xl transition-transform hover:-translate-y-1"
              >
                {activeCase.capa_url && (
                  <div
                    className="relative aspect-video overflow-hidden"
                    style={{ backgroundColor: getCaseBgColor(activeCase.slug, active) }}
                  >
                    <Image
                      src={activeCase.capa_url}
                      alt={activeCase.titulo}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(min-width: 1024px) 400px, 80vw"
                    />
                  </div>
                )}
                <div className="p-6 text-left">
                  {activeCase.cliente && (
                    <p className="text-xs font-bold uppercase tracking-widest text-[#058fa1]">
                      {activeCase.cliente}
                    </p>
                  )}
                  <h2 className="mt-1 text-xl font-black text-[#1a1a1a]">{activeCase.titulo}</h2>
                  {activeCase.resumo && (
                    <p className="mt-2 text-sm text-[#4a4a4a]">{activeCase.resumo}</p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#058fa1]">
                    Ver case
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
              </Link>

              {active === 0 && (
                <p className="mt-4 animate-bounce text-xs font-bold uppercase tracking-widest text-[#058fa1]">
                  Role para ver mais cases ↓
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Marca o fim da trilha pinada pro Nav saber quando o header deve
          deixar de ser transparente — ver `hero-sentinel` em nav.tsx. Uma
          trilha de vários viewports de altura invalida a heurística antiga
          (scrollY > 85% de UM viewport), então esse marcador substitui isso
          por uma medida real: o header só some quando o usuário de fato
          rolou por TODOS os cards, não só o primeiro. */}
      <div id="hero-sentinel" className="pointer-events-none absolute bottom-0 h-px w-full" />
    </div>
  );
}
