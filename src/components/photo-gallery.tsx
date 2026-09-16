"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "@mynaui/icons-react";

// Carrossel horizontal com scroll-snap — mesmo padrão do
// `testimonials-carousel.tsx`. Cada foto entra num box de proporção fixa
// (3:4) com `object-cover`: as fotos originais vêm de celular em orientações
// misturadas (retrato/paisagem), então um box fixo é o que mantém o
// carrossel com visual de "tira de fotos" uniforme em vez de larguras
// aleatórias pulando a cada slide.
//
// `variant="dark"` — mesmos tokens de tema escuro usados no resto do site
// (`border-border`, `text-navy`, `hover:text-coral`) pra quando a galeria
// roda fora de uma página-exceção de fundo claro.
const NAV_BTN = {
  light: "border-black/10 text-[#1a1a1a] hover:border-[#058fa1] hover:text-[#058fa1]",
  dark: "border-border text-navy hover:border-coral hover:text-coral",
} as const;

export function PhotoGallery({
  photos,
  variant = "light",
}: {
  photos: string[];
  variant?: "light" | "dark";
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const navBtn = NAV_BTN[variant];

  const scrollByCard = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const amount = (card?.offsetWidth ?? 260) + 20;
    track.scrollBy({ left: amount * dir, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((src, i) => (
          <div
            key={src}
            data-card
            className="relative aspect-[3/4] w-56 shrink-0 snap-start overflow-hidden rounded-2xl sm:w-64"
          >
            <Image
              src={src}
              alt={`Tales Pereira — foto ${i + 1}`}
              fill
              className="object-cover"
              sizes="(min-width: 640px) 256px, 224px"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Foto anterior"
          className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${navBtn}`}
        >
          <ArrowLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Próxima foto"
          className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${navBtn}`}
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
