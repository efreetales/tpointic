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
export function PhotoGallery({ photos }: { photos: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

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
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e5e7] text-[#1a1a1a] transition-colors hover:border-[#058fa1] hover:text-[#058fa1]"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Próxima foto"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e5e7] text-[#1a1a1a] transition-colors hover:border-[#058fa1] hover:text-[#058fa1]"
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
