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

export function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

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
            className="flex w-[300px] shrink-0 snap-start flex-col rounded-2xl border border-border bg-surface p-6 sm:w-[340px]"
          >
            <div className="flex gap-1 text-coral">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} size={14} className="fill-coral" />
              ))}
            </div>
            <p className="mt-3 flex-1 text-sm text-slate">&ldquo;{t.quote}&rdquo;</p>
            {t.linkedin ? (
              <a
                href={t.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver perfil de ${t.name} no LinkedIn`}
                className="group mt-5 flex items-center gap-3 rounded-xl p-2 -m-2 transition-colors hover:bg-bg"
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                  <Image src={t.photo} alt={t.name} fill className="object-cover" sizes="44px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-navy group-hover:text-coral">{t.name}</p>
                  <p className="truncate text-xs text-gray">{t.role}</p>
                </div>
                <Linkedin size={26} className="shrink-0 text-gray group-hover:text-coral" />
              </a>
            ) : (
              <div className="mt-5 flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                  <Image src={t.photo} alt={t.name} fill className="object-cover" sizes="44px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-navy">{t.name}</p>
                  <p className="truncate text-xs text-gray">{t.role}</p>
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
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-navy transition-colors hover:border-coral hover:text-coral"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Próximo depoimento"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-navy transition-colors hover:border-coral hover:text-coral"
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
