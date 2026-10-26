import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Play } from "@mynaui/icons-react";
import { AiLabHub } from "@/components/ai-lab-hub";
import { Reveal } from "@/components/reveal";
import { AI_LAB_NAME, LAB_PROJECTS, labAsset } from "@/lib/ai-lab";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `${AI_LAB_NAME} — ${SITE_NAME}`,
  description:
    "Experimentos, projetos pessoais e skills de IA de Tales Pereira: jogos, quizzes e SaaS criados com Claude Code, v0 e ElevenLabs.",
};

const TOOLS = [
  "Claude Code",
  "ElevenLabs",
  "v0",
  "Next.js",
  "Supabase",
  "Vercel",
  "Blender",
  "Tripo",
];

export default function AiLabPage() {
  const destaque = LAB_PROJECTS.find((p) => p.slug === "robinho-na-selva");

  return (
    <main className="flex-1">
      <section className="relative flex flex-col overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <video
            src={labAsset("hero-bg-2.mp4")}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-transparent to-bg" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[340px] w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16 sm:min-h-[440px]">
          <h1 className="animate-fade-up text-7xl font-black leading-none sm:text-9xl">
            <span className="lab-text">{AI_LAB_NAME}</span>
          </h1>
          <p
            className="animate-fade-up mt-6 max-w-2xl text-xl text-white sm:text-2xl"
            style={{ animationDelay: "0.1s" }}
          >
            Onde eu testo ideias antes de virarem produto: jogos, quizzes, SaaS
            e as skills que sobram de cada experimento.
          </p>
        </div>

        <div className="relative z-10 overflow-hidden border-t border-border bg-bg/40 py-3 backdrop-blur-sm">
          <div className="lab-marquee-track flex w-max gap-10 whitespace-nowrap text-sm font-bold uppercase tracking-widest text-gray">
            {[...TOOLS, ...TOOLS].map((t, i) => (
              <span key={i} className="flex items-center gap-10">
                {t}
                <span className="text-coral">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {destaque && (
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
            <div
              className="absolute -right-24 top-0 h-96 w-96 rounded-full blur-[120px]"
              style={{ backgroundColor: `${destaque.accent}33` }}
            />
            <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#7cc576]/25 blur-[110px]" />
          </div>
          <div className="relative z-10 mx-auto grid max-w-5xl items-center gap-10 px-6 py-16 lg:grid-cols-[1fr_1.2fr]">
            <Reveal>
              <p
                className="inline-block rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider text-black"
                style={{ backgroundColor: destaque.accent }}
              >
                Em destaque · Jogo
              </p>
              <h2 className="mt-4 text-4xl font-black leading-[1.05] text-navy sm:text-6xl">
                {destaque.titulo}
              </h2>
              <p className="mt-4 max-w-md text-lg text-slate">
                {destaque.tagline} Cada partida gera uma ilha nova, e dá para
                jogar direto no navegador.
              </p>
              <p className="mt-5 flex flex-wrap gap-1.5">
                {destaque.tools.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-2.5 py-1 text-xs font-bold text-navy"
                  >
                    {t}
                  </span>
                ))}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`${destaque.href}#jogar`}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-black transition-transform hover:scale-105"
                  style={{ backgroundColor: destaque.accent }}
                >
                  <Play size={18} /> Jogar agora
                </Link>
                <Link
                  href={destaque.href}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-bold text-navy transition-colors hover:border-coral hover:text-coral"
                >
                  Ver o projeto <ArrowUpRight size={18} />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <Link
                href={`${destaque.href}#jogar`}
                aria-label={`Jogar ${destaque.titulo}`}
                className="group relative block aspect-video overflow-hidden rounded-3xl border border-border shadow-[0_30px_80px_-30px_rgba(245,167,66,0.45)]"
              >
                <video
                  src={labAsset("robinho/clipe.mp4")}
                  poster={labAsset("robinho/jogo-1.webp")}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/0">
                  <span
                    className="flex h-16 w-16 items-center justify-center rounded-full text-black opacity-90 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: destaque.accent }}
                  >
                    <Play size={26} className="translate-x-0.5" />
                  </span>
                </span>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <AiLabHub />
        </Reveal>
      </section>
    </main>
  );
}
