import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  Users,
  Rocket,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Star,
} from "@mynaui/icons-react";
import { getCases } from "@/lib/cases";
import { Reveal } from "@/components/reveal";
import { Counter } from "@/components/counter";

const SERVICOS = [
  {
    icon: Compass,
    title: "Service Design",
    description: "Serviços úteis, utilizáveis e viáveis, ponta a ponta.",
  },
  {
    icon: Users,
    title: "UX Research",
    description: "Pesquisa qualitativa e quantitativa para decisões com dados.",
  },
  {
    icon: Rocket,
    title: "Design Leadership",
    description: "Visão estratégica de UX e times de alta performance.",
  },
  {
    icon: ShieldCheck,
    title: "Mentoring",
    description: "Orientação para designers em início ou transição de carreira.",
  },
];

const TESTIMONIALS = [
  {
    name: "Milene Ferraz",
    role: "Design Lead @ CI&T",
    quote: "Trabalhamos juntos em um projeto muito elogiado por todos. Manda bem demais!",
  },
  {
    name: "Pablo Turazzi Vilanova",
    role: "UX Research Lead @ Mercado Livre",
    quote: "Propositivo, inteligente, bem-humorado, sociável. Uma vivência espetacular.",
  },
];

export default async function Home() {
  const cases = (await getCases()).slice(0, 3);

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-gradient absolute inset-0" />
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-overlay"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src="https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/hero-bg.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-transparent" />

        <div className="relative mx-auto grid max-w-5xl items-end gap-8 px-6 py-20 sm:py-28 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col items-start">
            <div className="animate-fade-up flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-coral">
              <Sparkles size={14} /> Design que gera resultado
            </div>
            <h1
              className="animate-fade-up glow-text mt-6 max-w-xl text-4xl font-black leading-[1.05] text-navy sm:text-7xl"
              style={{ animationDelay: "0.1s" }}
            >
              Design que aproxima pessoas e produtos
            </h1>
            <p
              className="animate-fade-up mt-6 max-w-xl text-lg text-slate"
              style={{ animationDelay: "0.2s" }}
            >
              Sou Tales Pereira — Gestor de Design, Service Designer e UX
              Researcher. Mais de 15 anos criando serviços e produtos digitais
              para grandes empresas.
            </p>
            <div
              className="animate-fade-up mt-10 flex flex-wrap gap-4"
              style={{ animationDelay: "0.3s" }}
            >
              <Link
                href="/treinamentos/design-thinking-5-fundamentos"
                className="group flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
              >
                Conheça a masterclass
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
              <Link
                href="/cases"
                className="rounded-full border border-border px-6 py-3 text-sm font-bold text-navy transition-colors hover:border-coral hover:text-coral"
              >
                Ver portfólio
              </Link>
            </div>
          </div>

          <div
            className="animate-fade-up relative mx-auto hidden aspect-[2/3] w-full max-w-[380px] lg:block"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="absolute inset-0 rounded-full bg-coral/25 blur-3xl" />
            <Image
              src="https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/tales-hero-v2.webp"
              alt="Tales Pereira"
              fill
              className="relative object-contain object-bottom"
              priority
              quality={95}
              sizes="380px"
            />
          </div>
        </div>
      </section>

      {/* Empresas / social proof strip */}
      <Reveal>
        <section className="border-y border-border bg-surface/40 px-6 py-6">
          <p className="mx-auto max-w-5xl text-center text-xs font-bold uppercase tracking-widest text-gray">
            Mercado Livre &middot; UOL &middot; CI&amp;T &middot; Vivo &middot;
            Carrefour &middot; SulAmérica &middot; Dasa &middot; RD/Drogasil
          </p>
        </section>
      </Reveal>

      {/* Serviços */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-widest text-coral">
            Frentes de atuação
          </p>
          <h2 className="mt-2 text-3xl font-black text-navy">
            Como eu posso ajudar
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICOS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="group h-full rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-coral">
                <s.icon
                  size={28}
                  className="text-coral transition-transform group-hover:scale-110"
                />
                <h3 className="mt-4 font-bold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm text-slate">{s.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <Link
            href="/servicos"
            className="mt-8 inline-flex items-center gap-1 text-sm font-bold text-coral hover:underline"
          >
            Ver todos os serviços <ArrowUpRight size={16} />
          </Link>
        </Reveal>
      </section>

      {/* Cases */}
      {cases.length > 0 && (
        <section className="border-t border-border bg-surface/30 px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-widest text-coral">
                Portfólio
              </p>
              <h2 className="mt-2 text-3xl font-black text-navy">
                Cases recentes
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {cases.map((c, i) => (
                <Reveal key={c.id} delay={i * 0.1}>
                  <Link
                    href={`/cases/${c.slug}`}
                    className="group block h-full overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:-translate-y-1 hover:border-coral"
                  >
                    {c.capa_url && (
                      <div className="relative aspect-video overflow-hidden bg-bg">
                        <Image
                          src={c.capa_url}
                          alt={c.titulo}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(min-width: 640px) 33vw, 100vw"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      {c.cliente && (
                        <p className="text-xs font-bold uppercase tracking-widest text-coral">
                          {c.cliente}
                        </p>
                      )}
                      <h3 className="mt-1 font-bold text-navy">{c.titulo}</h3>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <Link
                href="/cases"
                className="mt-8 inline-flex items-center gap-1 text-sm font-bold text-coral hover:underline"
              >
                Ver portfólio completo <ArrowUpRight size={16} />
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* Liderança */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="grid gap-10 rounded-3xl border border-border bg-surface p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-coral">
                  Case de Liderança · Check Survey 2023
                </p>
                <h2 className="mt-2 text-3xl font-black text-navy">
                  Liderança que gera engajamento de verdade
                </h2>
                <p className="mt-3 max-w-xl text-slate">
                  Como conduzi 8 designers no Mercado Livre a 92% de
                  engajamento e 88% de excelência — e as ações concretas por
                  trás desses números.
                </p>
                <Link
                  href="/lideranca"
                  className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-coral hover:underline"
                >
                  Ver o case completo <ArrowUpRight size={16} />
                </Link>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-5xl font-black text-coral">
                    <Counter value="92%" />
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray">
                    Engagement
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-5xl font-black text-coral">
                    <Counter value="88%" />
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray">
                    Excelência
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Masterclass CTA */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <div className="hero-gradient relative overflow-hidden rounded-3xl px-8 py-14 text-center sm:px-16">
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-widest text-white/80">
                Masterclass
              </p>
              <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                Os 5 Fundamentos do Design Thinking
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/85">
                Ao vivo, online e colaborativa, com apoio de agentes de IA.
                Pague quanto quiser — de R$5 a R$500.
              </p>
              <Link
                href="/treinamentos/design-thinking-5-fundamentos"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
              >
                Garantir minha vaga <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Depoimentos */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-coral">
              Depoimentos
            </p>
            <h2 className="mt-2 text-3xl font-black text-navy">
              O que dizem sobre o trabalho
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <blockquote className="h-full rounded-2xl border border-border bg-surface p-6">
                  <div className="flex gap-1 text-coral">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} size={14} className="fill-coral" />
                    ))}
                  </div>
                  <p className="mt-3 text-slate">&ldquo;{t.quote}&rdquo;</p>
                  <footer className="mt-4 text-sm font-bold text-navy">
                    {t.name}
                    <span className="block font-normal text-gray">{t.role}</span>
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <Link
              href="/sobre"
              className="mt-8 inline-flex items-center gap-1 text-sm font-bold text-coral hover:underline"
            >
              Conheça mais sobre o Tales <ArrowUpRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
