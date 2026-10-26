"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Play } from "@mynaui/icons-react";

const ORANGE = "#F5A742";

// O jogo pesa cerca de 90 MB: só carrega quando a pessoa pede.
export function JogoEmbed({ src, cover }: { src: string; cover: string }) {
  const [ligado, setLigado] = useState(false);

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-3xl border border-border bg-black shadow-[0_30px_80px_-30px_rgba(245,167,66,0.4)]">
        {ligado ? (
          <iframe
            src={src}
            title="Robinho na Selva"
            allow="autoplay; fullscreen; gamepad"
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <>
            <Image
              src={cover}
              alt="Robinho atravessando uma fase da Ilha da Selva"
              fill
              sizes="(min-width: 1024px) 960px, 100vw"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => setLigado(true)}
              aria-label="Carregar e jogar Robinho na Selva"
              className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/35 transition-colors hover:bg-black/20"
            >
              <span
                className="flex h-20 w-20 items-center justify-center rounded-full text-black transition-transform group-hover:scale-110"
                style={{ backgroundColor: ORANGE }}
              >
                <Play size={32} className="translate-x-0.5" />
              </span>
              <span className="rounded-full bg-black/60 px-4 py-1.5 text-sm font-bold text-white">
                Jogar aqui · carrega cerca de 90 MB
              </span>
            </button>
          </>
        )}
      </div>
      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray">
        <span>Clique na tela do jogo antes de usar o teclado.</span>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold text-slate transition-colors hover:text-coral"
        >
          Abrir em tela cheia <ArrowUpRight size={14} />
        </a>
      </p>
    </div>
  );
}
