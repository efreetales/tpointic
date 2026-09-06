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
import { LogoMarquee } from "@/components/logo-marquee";
import { CaseParallaxShowcase } from "@/components/case-parallax-showcase";

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

        {/* Foto — fica fora do fluxo centralizado do texto e sempre rente à
            faixa de logos abaixo, independente de quanto texto houver. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto hidden max-w-5xl px-6 lg:flex lg:justify-end">
          <div
            className="animate-fade-up relative aspect-[2/3] w-full max-w-[380px]"
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

        {/* Texto — centralizado verticalmente numa área de altura mínima
            própria, sem depender da altura da foto ao lado. */}
        <div className="relative mx-auto flex min-h-[70vh] max-w-5xl items-center px-6 sm:min-h-[75vh] lg:min-h-[80vh]">
          <div className="flex flex-col items-start lg:max-w-[55%]">
            <div className="animate-fade-up flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-coral backdrop-blur-sm">
              <Sparkles size={14} /> Tales Pereira &middot; UX Leader
            </div>
            <h1
              className="animate-fade-up glow-text mt-6 max-w-xl text-4xl font-black leading-[1.05] text-navy sm:text-5xl lg:text-6xl"
              style={{ animationDelay: "0.1s" }}
            >
              Design estratégico turbinado por IA.
            </h1>
            <p
              className="animate-fade-up mt-6 max-w-xl text-lg text-slate"
              style={{ animationDelay: "0.2s" }}
            >
              15+ anos unindo liderança, design e tecnologia para transformar
              problemas complexos em resultados.
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
                className="rounded-full border border-white/40 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Ver portfólio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Empresas / social proof strip */}
      <Reveal>
        <section className="border-y border-border bg-white py-8">
          <LogoMarquee />
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
        <section className="relative border-t border-border">
          <div className="mx-auto max-w-5xl px-6 pt-20">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-widest text-coral">
                Portfólio
              </p>
              <h2 className="mt-2 text-3xl font-black text-navy">
                Cases recentes
              </h2>
            </Reveal>
          </div>

          <div className="mt-14">
            <CaseParallaxShowcase cases={cases} />
          </div>

          <div className="mx-auto max-w-5xl px-6 py-14 text-center">
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-bold text-navy transition-colors hover:border-coral hover:text-coral"
            >
              Ver portfólio completo <ArrowUpRight size={16} />
            </Link>
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
