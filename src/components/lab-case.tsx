import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "@mynaui/icons-react";
import { Reveal } from "@/components/reveal";

export type LabCaseProps = {
  accent: string;
  tipo: string;
  titulo: string;
  tagline: string;
  url: string;
  ctaLabel: string;
  hero: { src: string; alt: string };
  passos: { titulo: string; texto: string }[];
  telas: { src: string; alt: string }[];
  destaques: string[];
  tools: string[];
  // Faixa extra opcional entre o hero e os passos (ex.: os 6 chapéus).
  extra?: React.ReactNode;
};

// Estrutura enxuta e visual compartilhada pelos projetos do AI Lab que não
// têm uma história de processo própria (quiz, SaaS).
export function LabCase({
  accent,
  tipo,
  titulo,
  tagline,
  url,
  ctaLabel,
  hero,
  passos,
  telas,
  destaques,
  tools,
  extra,
}: LabCaseProps) {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div
            className="absolute -right-24 top-0 h-96 w-96 rounded-full blur-[120px]"
            style={{ backgroundColor: `${accent}30` }}
          />
        </div>
        <div className="relative z-10 mx-auto grid max-w-5xl gap-10 px-6 pb-16 pt-12 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:pt-20">
          <div>
            <Link
              href="/ai-lab"
              className="animate-fade-up flex w-fit items-center gap-1.5 text-sm font-bold text-slate transition-colors hover:text-coral"
            >
              <ArrowLeft size={16} /> AI Lab
            </Link>
            <p
              className="animate-fade-up mt-6 inline-block rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider text-black"
              style={{ backgroundColor: accent, animationDelay: "0.05s" }}
            >
              {tipo}
            </p>
            <h1
              className="animate-fade-up mt-4 text-5xl font-black leading-[1.02] text-navy sm:text-6xl"
              style={{ animationDelay: "0.1s" }}
            >
              {titulo}
            </h1>
            <p
              className="animate-fade-up mt-5 max-w-md text-lg text-slate"
              style={{ animationDelay: "0.2s" }}
            >
              {tagline}
            </p>
            <div
              className="animate-fade-up mt-8 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "0.3s" }}
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-black transition-transform hover:scale-105"
                style={{ backgroundColor: accent }}
              >
                {ctaLabel}
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <div className="flex flex-wrap gap-2">
                {tools.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-gray"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div
            className="animate-fade-up overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
            style={{
              animationDelay: "0.2s",
              boxShadow: `0 30px 80px -30px ${accent}55`,
            }}
          >
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 truncate text-xs text-gray">
                {url.replace("https://", "")}
              </span>
            </div>
            <Image
              src={hero.src}
              alt={hero.alt}
              width={800}
              height={634}
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      {extra}

      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-widest text-coral">
            Como funciona
          </p>
          <h2 className="mt-2 text-3xl font-black text-navy">
            {passos.length} passos, nada mais
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {passos.map((p, i) => (
            <Reveal key={p.titulo} delay={i * 0.1}>
              <div className="h-full rounded-3xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1">
                <span
                  className="text-6xl font-black leading-none"
                  style={{ color: accent }}
                >
                  {i + 1}
                </span>
                <h3 className="mt-4 text-xl font-black text-navy">
                  {p.titulo}
                </h3>
                <p className="mt-2 text-slate">{p.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-coral">
              Telas
            </p>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {telas.map((t, i) => (
              <Reveal key={t.src} delay={i * 0.1}>
                <div className="overflow-hidden rounded-2xl border border-border">
                  <Image
                    src={t.src}
                    alt={t.alt}
                    width={800}
                    height={634}
                    sizes="(min-width: 768px) 480px, 100vw"
                    className="h-auto w-full transition-transform duration-700 hover:scale-[1.03]"
                  />
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <ul className="mt-12 grid gap-3 sm:grid-cols-2">
              {destaques.map((d) => (
                <li key={d} className="flex items-start gap-3 text-navy">
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-black"
                    style={{ backgroundColor: accent }}
                  >
                    <Check size={14} />
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <Reveal>
          <h2 className="text-4xl font-black text-navy sm:text-5xl">
            Experimente
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-bold text-black transition-transform hover:scale-105"
              style={{ backgroundColor: accent }}
            >
              {ctaLabel} <ArrowUpRight size={18} />
            </a>
            <Link
              href="/ai-lab"
              className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 font-bold text-navy transition-colors hover:border-coral hover:text-coral"
            >
              Ver outros projetos
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
