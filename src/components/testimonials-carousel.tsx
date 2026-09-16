"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Linkedin, Star } from "@mynaui/icons-react";

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  photo: string;
  linkedin?: string;
};

// `variant="light"` — usado nas páginas-exceção com hero de vídeo (ex.
// /sobre), que rodam sobre fundo branco em vez do tema escuro padrão do
// site: os tokens de tema (`border-border`, `text-navy` etc.) resolveriam
// pra tons claros ilegíveis ali, então essa variante troca por cores
// literais consistentes com o resto dessas páginas.
const COLORS = {
  dark: {
    card: "border-border bg-surface",
    quote: "text-slate",
    star: "text-coral fill-coral",
    name: "text-navy",
    nameHover: "group-hover:text-coral",
    role: "text-gray",
    icon: "text-gray group-hover:text-coral",
    navBtn: "border-border text-navy hover:border-coral hover:text-coral",
    hoverBg: "hover:bg-bg",
  },
  light: {
    card: "border-white/40 bg-white/15 shadow-xl backdrop-blur-lg backdrop-saturate-150",
    quote: "text-[#4a4a4a]",
    star: "text-[#058fa1] fill-[#058fa1]",
    name: "text-[#1a1a1a]",
    nameHover: "group-hover:text-[#058fa1]",
    role: "text-[#4a4a4a]",
    icon: "text-[#4a4a4a] group-hover:text-[#058fa1]",
    navBtn: "border-black/10 text-[#1a1a1a] hover:border-[#058fa1] hover:text-[#058fa1]",
    hoverBg: "hover:bg-black/10",
  },
} as const;

export function TestimonialsCarousel({
  items,
  variant = "dark",
}: {
  items: Testimonial[];
  variant?: "dark" | "light";
}) {
  const isLight = variant === "light";
  const trackRef = useRef<HTMLDivElement>(null);
  const c = COLORS[variant];

  const scrollByCard = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const amount = (card?.offsetWidth ?? 340) + 24;
    track.scrollBy({ left: amount * dir, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((t) => (
          <div
            key={t.name}
            data-card
            className={`relative flex w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border p-6 sm:w-[340px] ${c.card}`}
          >
            {isLight && (
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 to-white/5" />
            )}
            <div className="relative flex gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} size={14} className={c.star} />
              ))}
            </div>
            <p className={`relative mt-3 flex-1 text-sm ${c.quote}`}>&ldquo;{t.quote}&rdquo;</p>
            {t.linkedin ? (
              <a
                href={t.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver perfil de ${t.name} no LinkedIn`}
                className={`group relative mt-5 flex items-center gap-3 rounded-xl p-2 -m-2 transition-colors ${c.hoverBg}`}
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                  <Image src={t.photo} alt={t.name} fill className="object-cover" sizes="44px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-bold ${c.name} ${c.nameHover}`}>{t.name}</p>
                  <p className={`truncate text-xs ${c.role}`}>{t.role}</p>
                </div>
                <Linkedin size={26} className={`shrink-0 ${c.icon}`} />
              </a>
            ) : (
              <div className="relative mt-5 flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                  <Image src={t.photo} alt={t.name} fill className="object-cover" sizes="44px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-bold ${c.name}`}>{t.name}</p>
                  <p className={`truncate text-xs ${c.role}`}>{t.role}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Depoimento anterior"
          className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${c.navBtn}`}
        >
          <ArrowLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Próximo depoimento"
          className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${c.navBtn}`}
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
