import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@mynaui/icons-react";
import { CheckSurveyStats } from "@/components/check-survey-stats";
import { getCaseFlareColor } from "@/lib/case-colors";

// Painel extra do carrossel de cases em destaque da home
// (`CaseParallaxShowcase`) — o case de liderança no mesmo formato sticky dos
// outros painéis (cada um cobre o anterior no scroll), só que no lugar da
// imagem de produto à direita entram os cards do Check Survey. Azul-marinho
// da marca Mercado Livre (#262b6e) de fundo, coerente com os outros painéis
// escuros.
const BG = "#262b6e";
const ML_LOGO =
  "https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/clientes/mercado-livre-logo-8-1.png";

export function LeadershipPanel() {
  return (
    <div
      className="sticky top-0 flex h-screen w-full flex-col lg:flex-row"
      style={{ backgroundColor: BG }}
    >
      <div className="flex flex-1 flex-col justify-center px-6 py-10 lg:w-[38%] lg:flex-none lg:px-16">
        {/* Selo branco: o wordmark "mercado livre" é azul-marinho e some
            direto num fundo escuro. */}
        <div className="mb-6 inline-flex w-fit rounded-xl bg-white px-4 py-2.5">
          <Image
            src={ML_LOGO}
            alt="Mercado Livre"
            width={4096}
            height={1042}
            sizes="160px"
            className="h-9 w-auto"
          />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-coral">
          Case de liderança · Check Survey 2023
        </p>
        <h3 className="mt-3 max-w-lg text-3xl font-black leading-tight text-white sm:text-5xl">
          Liderança que gera engajamento de verdade
        </h3>
        <p className="mt-4 max-w-md text-white/75">
          Como conduzi 8 designers no Mercado Livre a 92% de engajamento e 88%
          de execução — e as ações concretas por trás desses números.
        </p>
        <Link
          href="/lideranca"
          className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
        >
          Ver case completo
          <ArrowUpRight
            size={18}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-6 pb-10 lg:w-[62%] lg:flex-none lg:pb-0">
        {/* Flare atrás dos cards — mesma receita dos painéis de produto:
            camada própria, centralizada com flex (sem `translate`/`z-index`
            nos ancestrais, que isolariam o `mix-blend-overlay` do fundo do
            painel). */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="h-[70%] w-[75%] rounded-full opacity-50 mix-blend-overlay blur-[60px]"
            style={{ backgroundColor: getCaseFlareColor(BG) }}
          />
        </div>
        <div className="relative">
          <CheckSurveyStats />
        </div>
      </div>
    </div>
  );
}
