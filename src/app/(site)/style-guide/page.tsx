import type { Metadata } from "next";
import {
  Compass,
  Heart,
  Rocket,
  Sparkles,
  Star,
  Users,
  ArrowUpRight,
} from "@mynaui/icons-react";
import { Reveal } from "@/components/reveal";
import { Counter } from "@/components/counter";
import { StatRing } from "@/components/stat-ring";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Style Guide — TPointic",
  description: "Design system do site TPointic: cores, tipografia, componentes e animações.",
};

const COLORS = [
  { name: "Coral (ciano)", value: "#66fcf1", token: "coral" },
  { name: "Peach (teal)", value: "#26a193", token: "peach" },
  { name: "Navy (texto)", value: "#ededed", token: "navy" },
  { name: "Slate (texto 2)", value: "#a3a3a3", token: "slate" },
  { name: "Gray (texto 3)", value: "#8a8a8a", token: "gray" },
  { name: "Bg (fundo)", value: "#0a0a0a", token: "bg" },
  { name: "Surface (card)", value: "#141414", token: "surface" },
  { name: "Border", value: "#262626", token: "border" },
];

const GRADIENT_COLORS = [
  { name: "Gradiente — início", value: "#7e20cf" },
  { name: "Gradiente — fim", value: "#31cfb4" },
];

export default function StyleGuidePage() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden px-6 py-24 text-center">
        <div className="hero-gradient absolute inset-0 opacity-25" />
        <div className="relative">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-coral">
              Design System
            </p>
            <h1 className="mx-auto mt-2 max-w-2xl text-5xl font-black text-navy sm:text-6xl">
              Style Guide TPointic
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-slate">
              Cores, tipografia, componentes e animações usados no site
              público — referência viva pra manter tudo consistente.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Cores */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="text-2xl font-black text-navy">Cores</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            {COLORS.map((c, i) => (
              <Reveal key={c.token} delay={i * 0.05}>
                <div className="overflow-hidden rounded-2xl border border-border">
                  <div className="h-20" style={{ backgroundColor: c.value }} />
                  <div className="bg-surface p-3">
                    <p className="text-xs font-bold text-navy">{c.name}</p>
                    <p className="mt-0.5 font-mono text-xs text-gray">{c.value}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <h3 className="mt-12 text-sm font-bold uppercase tracking-widest text-coral">
              Gradiente de destaque
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {GRADIENT_COLORS.map((c) => (
                <div key={c.value} className="overflow-hidden rounded-2xl border border-border">
                  <div className="h-16" style={{ backgroundColor: c.value }} />
                  <div className="bg-surface p-3">
                    <p className="text-xs font-bold text-navy">{c.name}</p>
                    <p className="mt-0.5 font-mono text-xs text-gray">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="hero-gradient mt-4 h-24 rounded-2xl" />
            <p className="mt-2 text-xs text-gray">
              Classe <code className="text-coral">.hero-gradient</code> (estático) ·{" "}
              <code className="text-coral">.animated-gradient</code> (em movimento, usado em
              páginas de case de alto impacto)
            </p>
          </Reveal>
        </div>
      </section>

      {/* Tipografia */}
      <section className="border-t border-border bg-surface/30 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="text-2xl font-black text-navy">Tipografia</h2>
            <p className="mt-2 text-sm text-slate">
              Nunito (400 / 700 / 800 / 900) — sempre <code className="text-coral">font-bold</code>{" "}
              ou <code className="text-coral">font-black</code>, nunca peso regular em títulos.
            </p>
          </Reveal>
          <div className="mt-8 space-y-6">
            <Reveal>
              <p className="text-7xl font-black text-navy">Hero H1</p>
              <p className="mt-1 text-xs text-gray">text-5xl sm:text-7xl font-black</p>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="text-5xl font-black text-navy">Título de seção</p>
              <p className="mt-1 text-xs text-gray">text-3xl sm:text-5xl font-black</p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-sm font-bold uppercase tracking-widest text-coral">
                Eyebrow / rótulo de seção
              </p>
              <p className="mt-1 text-xs text-gray">
                text-sm font-bold uppercase tracking-widest text-coral
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-lg text-slate">
                Corpo de texto secundário, usado em subtítulos e descrições.
              </p>
              <p className="mt-1 text-xs text-gray">text-lg text-slate</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Botões */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="text-2xl font-black text-navy">Botões</h2>
          </Reveal>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Reveal>
              <button className="flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105">
                Botão primário <ArrowUpRight size={18} />
              </button>
            </Reveal>
            <Reveal delay={0.05}>
              <button className="rounded-full border border-border px-6 py-3 text-sm font-bold text-navy transition-colors hover:border-coral hover:text-coral">
                Botão secundário
              </button>
            </Reveal>
            <Reveal delay={0.1}>
              <button className="text-sm font-bold text-coral hover:underline">
                Link com seta →
              </button>
            </Reveal>
          </div>
          <p className="mt-4 text-xs text-gray">
            Regra fixa: botão com fundo coral (ciano claro) sempre usa{" "}
            <code className="text-coral">text-black</code> — nunca branco, contraste ruim.
          </p>
        </div>
      </section>

      {/* Ícones */}
      <section className="border-t border-border bg-surface/30 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="text-2xl font-black text-navy">Ícones</h2>
            <p className="mt-2 text-sm text-slate">
              MynaUI (<code className="text-coral">@mynaui/icons-react</code>) — única lib de
              ícones do site.
            </p>
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-6">
            {[Compass, Heart, Rocket, Sparkles, Star, Users].map((Icon, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface text-coral">
                  <Icon size={24} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Logo */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="text-2xl font-black text-navy">Logo</h2>
          </Reveal>
          <div className="mt-8 flex flex-wrap items-center gap-8">
            <Reveal>
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-6">
                <Logo className="h-10 w-10 text-coral" />
                <span className="text-lg font-black text-navy">TPointic</span>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="rounded-2xl border border-border bg-navy p-6">
                <Logo className="h-10 w-10 text-bg" />
              </div>
            </Reveal>
          </div>
          <p className="mt-4 text-xs text-gray">
            Sempre cor <code className="text-coral">#66fcf1</code> (token coral) sobre fundo
            escuro. Sem círculo, sem fundo sólido atrás da marca.
          </p>
        </div>
      </section>

      {/* Animações */}
      <section className="border-t border-border bg-surface/30 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="text-2xl font-black text-navy">Animações</h2>
          </Reveal>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl border border-border bg-surface p-6">
                <p className="font-bold text-navy">
                  <code className="text-coral">{"<Reveal>"}</code>
                </p>
                <p className="mt-2 text-sm text-slate">
                  Fade + slide-up ao entrar no viewport (framer-motion,
                  dispara uma vez). Padrão para blocos de seção.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="rounded-2xl border border-border bg-surface p-6">
                <p className="font-bold text-navy">
                  <code className="text-coral">{"<Counter>"}</code>
                </p>
                <p className="mt-2 text-sm text-slate">
                  Conta de 0 até o número ao entrar no viewport, preservando
                  prefixo/sufixo do texto (%, min, →). Exemplo ao vivo:
                </p>
                <p className="mt-3 text-3xl font-black text-coral">
                  <Counter value="93%" />
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
              <p className="font-bold text-navy">
                <code className="text-coral">{"<StatRing>"}</code>
              </p>
              <p className="mt-2 text-sm text-slate">
                Anel de progresso animado (SVG), para páginas de case de alto
                impacto. Fundo escuro obrigatório — o traço e o número são
                brancos.
              </p>
              <div className="mt-6 flex justify-center rounded-2xl bg-bg py-10">
                <StatRing value="60%" percent={60} label="Exemplo" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cards */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="text-2xl font-black text-navy">Cards</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {["Padrão", "Com hover", "Destaque"].map((label, i) => (
              <Reveal key={label} delay={i * 0.05}>
                <div className="group h-full rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-coral">
                  <Star size={24} className="text-coral" />
                  <h3 className="mt-3 font-bold text-navy">{label}</h3>
                  <p className="mt-1 text-sm text-slate">
                    rounded-2xl border border-border bg-surface p-6
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
