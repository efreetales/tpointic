"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "@mynaui/icons-react";
import type { Case } from "@/lib/cases";
import { getCaseBgColor } from "@/lib/case-colors";

// Hero da página de cases: o vídeo de fundo continua, mas em vez do carrossel
// pinado por scroll, todos os cases ficam visíveis ao mesmo tempo como cards
// flutuantes num "palco" à direita — um em destaque (grande, no centro) e os
// outros menores ao redor. Nada aqui depende de scroll.
//
// Movimento em 3 camadas independentes (cada uma num elemento próprio, pra
// nenhuma transformação brigar com a outra):
//   1. posição no palco (`left/top/width` animados com spring) — é o que
//      troca quando um card menor é trazido pro destaque;
//   2. parallax do mouse (`x/y` derivados do ponteiro, com spring) — cada
//      card tem uma "profundidade": os menores mexem mais que o destaque,
//      que se move um pouco no sentido contrário, o que dá a sensação de
//      camadas;
//   3. flutuação em idle (keyframe CSS `card-float`, com duração/atraso
//      diferentes por card) — o palco nunca fica parado.
//
// Clicar num card menor o traz pro destaque (troca de lugar com o atual);
// clicar no destaque abre o case. Sem mouse (touch/mobile) o palco não
// existe: vira uma lista simples, todos os cases visíveis, cada um abre direto.

type Slot = { x: number; y: number; w: number; depth: number; dur: number; delay: number };

// Centro de cada card, em % do palco; `w` em px na tela de 1440 (escala com a
// largura da janela — ver `unit`). O primeiro slot é o destaque.
const SLOTS: Slot[] = [
  { x: 50, y: 49, w: 380, depth: -0.35, dur: 7, delay: 0 },
  { x: 13, y: 22, w: 190, depth: 1, dur: 6, delay: -1 },
  { x: 40, y: 11, w: 165, depth: 0.7, dur: 8, delay: -3 },
  { x: 80, y: 14, w: 180, depth: 1.15, dur: 6.5, delay: -2 },
  { x: 90, y: 46, w: 170, depth: 0.8, dur: 7.5, delay: -4 },
  { x: 84, y: 82, w: 190, depth: 1.2, dur: 6.2, delay: -1.5 },
  { x: 47, y: 88, w: 170, depth: 0.6, dur: 8.5, delay: -5 },
  { x: 12, y: 76, w: 185, depth: 0.9, dur: 7.2, delay: -2.5 },
];

const MAX_ON_STAGE = SLOTS.length;
const PARALLAX_PX = 26;

function CaseCover({ c, index }: { c: Case; index: number }) {
  return (
    <div
      className="relative aspect-video overflow-hidden"
      style={{ backgroundColor: getCaseBgColor(c.slug, index) }}
    >
      {c.capa_url ? (
        <Image
          src={c.capa_url}
          alt={c.titulo}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 400px, 80vw"
        />
      ) : (
        <div className="grid h-full place-items-center px-4 text-center text-sm font-black text-white">
          {c.titulo}
        </div>
      )}
    </div>
  );
}

function FloatingCard({
  c,
  index,
  slot,
  unit,
  featured,
  mx,
  my,
  onPromote,
}: {
  c: Case;
  index: number;
  slot: Slot;
  unit: number;
  featured: boolean;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  onPromote: () => void;
}) {
  const px = useTransform(mx, (v) => v * slot.depth * PARALLAX_PX);
  const py = useTransform(my, (v) => v * slot.depth * PARALLAX_PX);

  return (
    // 1) posição no palco
    <motion.div
      className="absolute"
      style={{ translateX: "-50%", translateY: "-50%" }}
      initial={false}
      animate={{
        left: `${slot.x}%`,
        top: `${slot.y}%`,
        width: slot.w * unit,
        zIndex: featured ? 20 : 10,
      }}
      transition={{ type: "spring", stiffness: 90, damping: 20, mass: 0.9 }}
    >
      {/* 2) parallax do mouse */}
      <motion.div style={{ x: px, y: py }}>
        {/* 3) flutuação em idle */}
        <div
          className="card-float"
          style={
            {
              "--float-dur": `${slot.dur}s`,
              "--float-delay": `${slot.delay}s`,
            } as React.CSSProperties
          }
        >
          {featured ? (
            <motion.div
              key="featured"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Link
                href={`/cases/${c.slug}`}
                className="group block w-full overflow-hidden rounded-2xl border border-[#e5e5e7] bg-white shadow-2xl transition-shadow hover:shadow-[0_30px_80px_-20px_rgba(5,143,161,0.45)]"
              >
                <CaseCover c={c} index={index} />
                <div className="p-6 text-left">
                  {c.cliente && (
                    <p className="text-xs font-bold uppercase tracking-widest text-[#058fa1]">{c.cliente}</p>
                  )}
                  <h2 className="mt-1 text-xl font-black text-[#1a1a1a]">{c.titulo}</h2>
                  {c.resumo && <p className="mt-2 line-clamp-3 text-sm text-[#4a4a4a]">{c.resumo}</p>}
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#058fa1]">
                    Ver case
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
              </Link>
            </motion.div>
          ) : (
            <motion.button
              type="button"
              onClick={onPromote}
              aria-label={`Trazer o case ${c.titulo} para o destaque`}
              whileHover={{ scale: 1.1, zIndex: 30 }}
              whileFocus={{ scale: 1.1, zIndex: 30 }}
              whileTap={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="group block w-full overflow-hidden rounded-2xl border border-[#e5e5e7] bg-white text-left shadow-lg outline-none transition-shadow hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-[#058fa1]"
            >
              <CaseCover c={c} index={index} />
              <div className="p-3">
                {c.cliente && (
                  <p className="line-clamp-1 text-[10px] font-bold uppercase tracking-widest text-[#058fa1]">
                    {c.cliente}
                  </p>
                )}
                <p className="line-clamp-2 text-[13px] font-black leading-snug text-[#1a1a1a]">{c.titulo}</p>
              </div>
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function CasesFloatingHero({ cases }: { cases: Case[] }) {
  const onStage = useMemo(() => cases.slice(0, MAX_ON_STAGE), [cases]);
  const extra = cases.slice(MAX_ON_STAGE);

  // `order[0]` = case em destaque; `order[i]` = case que ocupa o slot i.
  const [order, setOrder] = useState<string[]>(() => onStage.map((c) => c.id));
  const byId = useMemo(() => new Map(cases.map((c) => [c.id, c])), [cases]);
  const indexOf = (id: string) => cases.findIndex((c) => c.id === id);

  // Escala dos cards com a largura da janela (1440px = 1). Mantém a
  // composição sem sobreposição em notebooks menores.
  const [unit, setUnit] = useState(1);
  useEffect(() => {
    const update = () => setUnit(Math.min(1.1, Math.max(0.7, window.innerWidth / 1440)));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Ponteiro normalizado (-1..1) em relação ao centro do palco, suavizado.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 55, damping: 18, mass: 0.8 });
  const my = useSpring(rawY, { stiffness: 55, damping: 18, mass: 0.8 });

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    rawY.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  }
  function onPointerLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  function promote(id: string) {
    setOrder((prev) => {
      const from = prev.indexOf(id);
      if (from <= 0) return prev;
      const next = [...prev];
      [next[0], next[from]] = [next[from], next[0]];
      return next;
    });
  }

  return (
    <>
      <div
        className="relative flex min-h-screen w-full items-center overflow-hidden bg-white"
        style={{
          marginTop: "calc(-1 * var(--nav-h, 0px))",
          paddingTop: "var(--nav-h, 0px)",
        }}
      >
        <h1 className="sr-only">Cases</h1>

        {/* Vídeo de fundo — só em telas grandes (pesa demais no celular e é
            decorativo); mesmas camadas do hero anterior: multiply pra tirar
            o branco chapado, véu atrás do menu e degradê branco do lado dos
            cards. O degradê agora cobre uma faixa maior (o palco é largo). */}
        <video
          src="https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/hero-cases-typing.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 hidden h-full w-full object-cover lg:block"
          style={{ objectPosition: "78% center" }}
        />
        <div
          className="pointer-events-none absolute inset-0 hidden mix-blend-multiply lg:block"
          style={{ backgroundColor: "#e8ecef" }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 bg-white/55"
          style={{ height: "var(--nav-h, 0px)" }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[62%] lg:block"
          style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.92) 38%)" }}
        />

        {/* Palco (desktop): cards flutuantes. */}
        <div
          className="absolute inset-y-0 right-0 hidden w-[62%] lg:block"
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          style={{ paddingTop: "var(--nav-h, 0px)" }}
        >
          <div className="relative h-full w-full">
            {order.map((id, slotIndex) => {
              const c = byId.get(id);
              if (!c) return null;
              return (
                <FloatingCard
                  key={id}
                  c={c}
                  index={indexOf(id)}
                  slot={SLOTS[slotIndex]}
                  unit={unit}
                  featured={slotIndex === 0}
                  mx={mx}
                  my={my}
                  onPromote={() => promote(id)}
                />
              );
            })}
          </div>
          <p className="pointer-events-none absolute bottom-5 left-8 text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/40">
            Clique num card para trazê-lo ao destaque
          </p>
        </div>

        {/* Lista (mobile/tablet): sem palco, todos visíveis, cada um abre direto. */}
        <div className="relative z-10 w-full px-6 pb-16 pt-28 lg:hidden">
          <div className="mx-auto grid max-w-2xl gap-5 sm:grid-cols-2">
            {cases.map((c, i) => (
              <Link
                key={c.id}
                href={`/cases/${c.slug}`}
                className="group block overflow-hidden rounded-2xl border border-[#e5e5e7] bg-white shadow-lg"
              >
                <CaseCover c={c} index={i} />
                <div className="p-4">
                  {c.cliente && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#058fa1]">{c.cliente}</p>
                  )}
                  <p className="text-base font-black text-[#1a1a1a]">{c.titulo}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mais cases do que slots no palco: os que sobram ficam numa grade
          simples logo abaixo, pra nenhum deixar de aparecer. */}
      {extra.length > 0 && (
        <section className="hidden bg-white px-6 py-20 lg:block">
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
            {extra.map((c, i) => (
              <Link
                key={c.id}
                href={`/cases/${c.slug}`}
                className="group block overflow-hidden rounded-2xl border border-[#e5e5e7] bg-white shadow-lg transition-transform hover:-translate-y-1"
              >
                <CaseCover c={c} index={MAX_ON_STAGE + i} />
                <div className="p-4">
                  <p className="text-base font-black text-[#1a1a1a]">{c.titulo}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
