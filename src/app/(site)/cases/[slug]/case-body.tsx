"use client";

import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChartBar,
  ChartBarIncreasing,
  CheckCircle,
  ClockCircle,
  Figma,
  FileText,
  Heart,
  MapPin,
  MessageDots,
  Search,
  Send,
  ShieldCheck,
  Smile,
  Star,
  Users,
  Zap,
} from "@mynaui/icons-react";
import { Reveal } from "@/components/reveal";
import { Counter } from "@/components/counter";
import { SectionSeam } from "@/components/section-seam";
import { StatRing } from "@/components/stat-ring";
import { ScreenMarquee } from "@/components/screen-marquee";
import { Phone3D } from "@/components/phone-3d";
import { Bleed } from "@/components/bleed";
import type { Case } from "@/lib/cases";

// Shared icon dictionary — used both by `steps` and `destaques.icon`, keyed
// by a plain string stored in the DB so content can reference an icon
// without importing React components.
const ICONS: Record<string, ComponentType<{ size?: number }>> = {
  send: Send,
  "map-pin": MapPin,
  "check-circle": CheckCircle,
  search: Search,
  star: Star,
  users: Users,
  clock: ClockCircle,
  zap: Zap,
  "message-circle": MessageDots,
  "shield-check": ShieldCheck,
  activity: Activity,
  chart: ChartBar,
  "trending-up": ChartBarIncreasing,
  smile: Smile,
  heart: Heart,
};

const SEAM_COLORS = ["#66fcf1", "#7e20cf"];

// Default background rotation for the sticky-parallax gallery panels — each
// one needs a visibly distinct color from its neighbor so it clearly reads
// as "covering" the previous panel while scrolling, not just a new image on
// the same background. A case can override per-item via `gallery[].bg`.
const GALLERY_BG_FALLBACK = ["#0a0a0a", "#12102a", "#0a1f1d", "#1a0f1f"];

// Supports a simple **destaque** marker inside `problema_texto` — the marked
// span renders in the site's purple accent, same as the hand-authored
// Sulamérica page this template was generalized from.
function highlightProblemText(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="text-[#7e20cf]">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

// `conteudo` is plain text with `\n\n`-separated blocks (no markup) — a short
// single-line block (ex. "Qual o desafio?") reads as a sub-heading in the
// source narrative but rendered with zero styling of its own it just blends
// into the body copy, flat and forgettable. Detect that shape heuristically
// (single line, short, not a bullet list) and give it real visual weight;
// detect "- item" blocks and render them as a real list instead of dashes
// sitting in a wall of text.
function renderConteudo(text: string) {
  return text.split(/\n\n+/).map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;
    const lines = trimmed.split("\n").map((l) => l.trim());
    const isBulletList = lines.length > 1 && lines.every((l) => l.startsWith("- "));
    const isHeading = lines.length === 1 && trimmed.length <= 60 && !trimmed.startsWith("-");

    if (isBulletList) {
      return (
        <ul key={i} className="mt-6 space-y-2">
          {lines.map((l, j) => (
            <li key={j} className="flex gap-3 text-lg leading-relaxed text-navy">
              <span className="mt-1 text-coral">—</span>
              <span>{l.slice(2)}</span>
            </li>
          ))}
        </ul>
      );
    }
    if (isHeading) {
      return (
        <h3 key={i} className={`text-2xl font-black text-navy sm:text-3xl ${i === 0 ? "" : "mt-12"}`}>
          {trimmed}
        </h3>
      );
    }
    return (
      <p key={i} className="mt-4 text-lg leading-relaxed text-navy">
        {trimmed}
      </p>
    );
  });
}

// The prototype field accepts any embeddable prototype URL — Figma, a v0.dev
// share/deploy link, quant-UX, etc. Figma-specific chrome (the page/footer
// toolbar showing file name, "edited X ago", nav arrows) only applies to
// figma.com URLs, so only add `hide-ui=1` for those; other tools don't have
// that chrome to hide, and forcing the param on them could break their URL.
function isFigmaUrl(url: string) {
  try {
    return /(^|\.)figma\.com$/.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

function embedPrototypeUrl(url: string) {
  if (!isFigmaUrl(url)) return url;
  try {
    const u = new URL(url);
    if (!u.searchParams.has("hide-ui")) u.searchParams.set("hide-ui", "1");
    return u.toString();
  } catch {
    return url;
  }
}

export function CaseBody({ c }: { c: Case }) {
  const screens = c.screens.map((s) => ({ src: s.url, alt: s.alt }));
  const hasStepFlow = c.steps.length > 0;
  const hasStats = c.destaques.length > 0;
  // Split into ring-friendly (percent) and plain stats — a case can mix both
  // (e.g. two % rings plus a qualitative highlight like "redução de
  // chamadas"), so this isn't a strict either/or the way it first looked.
  const percentStats = c.destaques.filter((d) => /%\s*$/.test(d.valor.trim()));
  const otherStats = c.destaques.filter((d) => !/%\s*$/.test(d.valor.trim()));
  const hasStyleGuide = (c.style_guide.colors?.length ?? 0) > 0 || (c.style_guide.patterns?.length ?? 0) > 0;

  let seamToggle = 0;
  const nextSeam = () => SEAM_COLORS[seamToggle++ % SEAM_COLORS.length];

  return (
    <main className="bg-bg text-navy">
      {/* Hero — sempre com o fundo `.animated-gradient` (é o que faz o hero
          ficar "bonito" independente do case ter produto ou não). A coluna da
          direita mostra o Phone3D quando há `screens`, a capa quando não há
          mas existe `capa_url`, ou nada (headline centralizada sozinha)
          quando nenhum dos dois está disponível — nunca cai pro hero "sem
          graça" antigo. `hero_title` é o headline de marketing pro hero
          (ex. "Marcar consulta"), separado de `titulo` (nome formal do case,
          usado em listagens/metadata/nav) — nunca usar `titulo` direto aqui
          quando `hero_title` estiver preenchido. */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24">
        <div className="animated-gradient absolute inset-0" />
        <div className="absolute inset-0 bg-black/30" />

        <div
          className={`relative z-10 mx-auto grid max-w-6xl items-center gap-12 ${
            screens.length > 0 || c.capa_url ? "lg:grid-cols-[1.1fr_0.9fr]" : ""
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={
              screens.length > 0 || c.capa_url ? "text-center lg:text-left" : "mx-auto max-w-3xl text-center"
            }
          >
            <Link href="/cases" className="text-sm font-bold text-white/70 transition-colors hover:text-white">
              ← Voltar para cases
            </Link>
            {c.cliente && (
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.3em] text-white/80">
                {c.cliente} × TPointic
              </p>
            )}
            <h1 className="mx-auto mt-4 max-w-4xl text-5xl font-black leading-[1.02] text-white sm:text-7xl lg:mx-0">
              {c.hero_title ?? c.titulo}
              {c.hero_accent && (
                <>
                  <br />
                  <span className="text-[#66fcf1]">{c.hero_accent}</span>
                </>
              )}
            </h1>
            {c.resumo && (
              <p className="mx-auto mt-8 max-w-lg text-lg text-white/85 lg:mx-0">{c.resumo}</p>
            )}
          </motion.div>

          {screens.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="mx-auto w-full max-w-[300px]"
            >
              <Phone3D screens={screens} />
            </motion.div>
          ) : (
            c.capa_url && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
              >
                <Image src={c.capa_url} alt="" fill className="object-cover" priority sizes="(min-width: 1024px) 480px, 100vw" />
              </motion.div>
            )
          )}
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="absolute bottom-10 z-10 text-white/70"
        >
          <ArrowDown size={28} />
        </motion.div>
      </section>

      {/* O problema */}
      {c.problema_texto && (
        <section className="relative bg-bg px-6 py-32">
          <SectionSeam color={nextSeam()} />
          <Reveal>
            <p className="mx-auto max-w-3xl text-center text-3xl font-black leading-tight text-navy sm:text-5xl">
              {highlightProblemText(c.problema_texto)}
            </p>
          </Reveal>
        </section>
      )}

      {/* Etapas — o fluxo do produto (ex. Sulamérica: Pedido → Match →
          Confirmado) e o processo de design (ex. Imersão → Definição →
          Prototipação) são coisas diferentes e merecem títulos diferentes;
          nunca reaproveitar "A solução / Como funciona" pra um processo. */}
      {hasStepFlow && (
        <section className="relative bg-surface px-6 py-32">
          <SectionSeam color={nextSeam()} />
          <Reveal>
            <p className="text-center text-sm font-bold uppercase tracking-widest text-coral">
              {c.steps_eyebrow ?? "A solução"}
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-center text-4xl font-black text-navy sm:text-5xl">
              {c.steps_title ?? "Como funciona"}
            </h2>
          </Reveal>

          <div className="mx-auto mt-20 grid max-w-5xl gap-12 sm:grid-cols-3">
            {c.steps.map((step, i) => {
              const Icon = ICONS[step.icon] ?? CheckCircle;
              return (
                <Reveal key={step.title} delay={i * 0.15}>
                  <div className="relative flex flex-col items-center text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bg text-coral ring-1 ring-border">
                      <Icon size={32} />
                    </div>
                    <h3 className="mt-6 text-xl font-black text-navy">{step.title}</h3>
                    <p className="mt-2 text-sm text-slate">{step.description}</p>
                    {i < c.steps.length - 1 && (
                      <ArrowRight size={22} className="absolute -right-8 top-8 hidden text-coral/50 sm:block" />
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* Resultados — anel animado pros valores percentuais; os demais
          (qualitativos, ex. "redução de chamadas", ou contáveis, ex. "8
          designers liderados") entram como linha de destaque logo abaixo, ou
          como o grid de contador de sempre quando não há nenhum percentual. */}
      {hasStats &&
        (percentStats.length > 0 ? (
          <section className="animated-gradient relative px-6 py-32">
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative">
              <Reveal>
                <p className="text-center text-sm font-bold uppercase tracking-widest text-white/80">
                  Resultados
                </p>
                <h2 className="mx-auto mt-3 max-w-xl text-center text-4xl font-black text-white sm:text-5xl">
                  O que mudou de verdade
                </h2>
              </Reveal>

              <div className="mx-auto mt-16 flex max-w-3xl flex-wrap items-start justify-center gap-16">
                {percentStats.map((d) => {
                  const percent = Math.abs(parseInt(d.valor, 10));
                  return (
                    <StatRing
                      key={d.label}
                      value={d.valor}
                      percent={Number.isFinite(percent) ? percent : 0}
                      label={d.label}
                      color="#66fcf1"
                      icon={d.icon ? ICONS[d.icon] : undefined}
                    />
                  );
                })}
              </div>

              {otherStats.map((d, i) => (
                <Reveal key={d.label} delay={0.2 + i * 0.1}>
                  <p className="mx-auto mt-12 max-w-md text-center font-bold text-white">
                    + {d.label.toLowerCase()}: {d.valor}
                  </p>
                </Reveal>
              ))}
            </div>
          </section>
        ) : (
          <section className="relative border-y border-border bg-surface/40 px-6 py-20">
            <SectionSeam color={nextSeam()} />
            <Reveal>
              <p className="text-center text-sm font-bold uppercase tracking-widest text-coral">Resultados</p>
              <h2 className="mx-auto mt-3 max-w-xl text-center text-4xl font-black text-navy sm:text-5xl">
                O que mudou de verdade
              </h2>
            </Reveal>

            <div className="mx-auto mt-14 flex max-w-4xl flex-wrap justify-center gap-x-16 gap-y-10">
              {c.destaques.map((d, i) => {
                const Icon = d.icon ? ICONS[d.icon] : undefined;
                return (
                  <Reveal key={d.label} delay={i * 0.1}>
                    <div className="text-center">
                      {Icon && (
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-bg text-coral ring-1 ring-border">
                          <Icon size={22} />
                        </div>
                      )}
                      <p className="text-5xl font-black text-coral sm:text-6xl">
                        <Counter value={d.valor} />
                      </p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-widest text-gray">{d.label}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>
        ))}

      {/* Conteúdo — narrativa longa (objetivo, processo, papel), separada da
          frase de impacto curta da seção "O problema" acima. */}
      {c.conteudo && (
        <Reveal>
          <div className="mx-auto max-w-2xl px-6 py-20">{renderConteudo(c.conteudo)}</div>
        </Reveal>
      )}

      {/* Protótipo Figma — largura total, sem moldura, sem o rodapé do Figma */}
      {c.figma_url && (
        <section className="relative bg-bg px-6 py-32">
          <SectionSeam color={nextSeam()} />
          <Reveal>
            <p className="text-center text-sm font-bold uppercase tracking-widest text-coral">Protótipo</p>
            <h2 className="mx-auto mt-3 max-w-xl text-center text-4xl font-black text-navy sm:text-5xl">
              Explore o fluxo completo
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <Bleed className="mt-14">
              <iframe
                src={embedPrototypeUrl(c.figma_url)}
                className="h-[1500px] w-full"
                allow="fullscreen"
                allowFullScreen
              />
            </Bleed>
            <div className="mx-auto mt-6 flex max-w-3xl justify-center">
              <a
                href={c.figma_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold text-navy transition-colors hover:border-coral hover:text-coral"
              >
                {isFigmaUrl(c.figma_url) ? <Figma size={16} /> : <ArrowUpRight size={16} />}
                {isFigmaUrl(c.figma_url) ? "Abrir no Figma" : "Abrir protótipo"}
              </a>
            </div>
          </Reveal>
        </section>
      )}

      {/* Telas em destaque — esteira contínua */}
      {screens.length > 0 && (
        <section className="relative overflow-hidden bg-bg py-32">
          <SectionSeam color={nextSeam()} />
          <Reveal>
            <p className="px-6 text-center text-sm font-bold uppercase tracking-widest text-coral">O produto</p>
            <h2 className="mx-auto mt-3 max-w-xl px-6 text-center text-4xl font-black text-navy sm:text-5xl">
              Telas em destaque
            </h2>
          </Reveal>
          <div className="mt-14">
            <ScreenMarquee screens={screens} />
          </div>
        </section>
      )}

      {/* Style guide */}
      {hasStyleGuide && (
        <section className="relative bg-surface px-6 py-32">
          <SectionSeam color={nextSeam()} />
          <Reveal>
            <p className="text-center text-sm font-bold uppercase tracking-widest text-coral">Style guide</p>
            <h2 className="mx-auto mt-3 max-w-2xl text-center text-4xl font-black text-navy sm:text-5xl">
              A linguagem visual
            </h2>
          </Reveal>

          <div className="mx-auto mt-16 max-w-4xl">
            {(c.style_guide.colors?.length ?? 0) > 0 && (
              <Reveal delay={0.1}>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {c.style_guide.colors!.map((color) => (
                    <div key={color.hex} className="overflow-hidden rounded-2xl border border-border bg-bg">
                      <div className="h-20" style={{ backgroundColor: color.hex }} />
                      <div className="p-3">
                        <p className="text-sm font-bold text-navy">{color.name}</p>
                        <p className="mt-0.5 font-mono text-xs text-gray">{color.hex}</p>
                        <p className="mt-1 text-xs text-slate">{color.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            {(c.style_guide.patterns?.length ?? 0) > 0 && (
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {c.style_guide.patterns!.map((p, i) => (
                  <Reveal key={p.title} delay={i * 0.06}>
                    <div className="rounded-2xl border border-border bg-bg p-5">
                      <h3 className="font-bold text-navy">{p.title}</h3>
                      <p className="mt-1.5 text-sm text-slate">{p.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Galeria de impacto — pilha com parallax (cada bloco cobre o anterior
          ao rolar). Sem overflow-hidden na seção: os blocos filhos usam
          `position: sticky`, e overflow non-visible em qualquer ancestral
          quebra o efeito (documentado na skill tpointic-wow-case). */}
      {c.gallery.length > 0 ? (
        <section className="relative bg-surface py-32">
          <SectionSeam color={nextSeam()} />
          <Reveal>
            <p className="px-6 text-center text-sm font-bold uppercase tracking-widest text-coral">De perto</p>
            <h2 className="mx-auto mt-3 max-w-xl px-6 text-center text-4xl font-black text-navy sm:text-5xl">
              {c.titulo}
            </h2>
          </Reveal>

          <div className="relative mt-16">
            {c.gallery.map((item, i) => (
              <div
                key={item.url}
                className="sticky top-0 flex h-screen w-full flex-col overflow-hidden lg:flex-row"
                style={{ backgroundColor: item.bg ?? GALLERY_BG_FALLBACK[i % GALLERY_BG_FALLBACK.length] }}
              >
                {item.caption && (
                  <div className="flex flex-1 items-center justify-center px-6 py-10 text-center lg:w-1/2 lg:flex-none lg:justify-end lg:px-16 lg:text-left">
                    <p className="max-w-md text-2xl font-black text-white sm:text-4xl">{item.caption}</p>
                  </div>
                )}
                <div className={`relative flex-1 lg:flex-none ${item.caption ? "lg:w-1/2" : "lg:w-full"}`}>
                  <Image
                    src={item.url}
                    alt={item.alt}
                    fill
                    className={item.fit === "contain" ? "object-contain p-8" : "object-cover"}
                    sizes={item.caption ? "(min-width: 1024px) 50vw, 100vw" : "100vw"}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        c.imagens.map((src, i) => (
          <Reveal key={src}>
            <div className="py-6">
              <div className="relative mx-auto h-[70vh] max-h-[720px] min-h-[320px] w-full max-w-6xl overflow-hidden bg-surface sm:rounded-3xl">
                <Image src={src} alt={`${c.titulo} — artefato ${i + 1}`} fill className="object-contain" sizes="100vw" />
              </div>
            </div>
          </Reveal>
        ))
      )}

      {/* Vídeo */}
      {c.video_url && (
        <section className="relative bg-bg px-6 py-32">
          <SectionSeam color={nextSeam()} />
          <Reveal>
            <p className="text-center text-sm font-bold uppercase tracking-widest text-coral">Vídeo</p>
            <h2 className="mx-auto mt-3 max-w-xl text-center text-4xl font-black text-navy sm:text-5xl">
              Eu explico esse case
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <Bleed className="mt-14">
              {c.video_url.endsWith(".mp4") ? (
                <video src={c.video_url} controls className="w-full" preload="metadata" />
              ) : (
                <div className="relative aspect-video">
                  <iframe
                    src={c.video_url}
                    className="absolute inset-0 h-full w-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </Bleed>
          </Reveal>
        </section>
      )}

      {/* Slides */}
      {c.slides_url && (
        <section className="relative bg-bg px-6 py-32">
          <SectionSeam color={nextSeam()} />
          <Reveal>
            <p className="text-center text-sm font-bold uppercase tracking-widest text-coral">Apresentação</p>
            <h2 className="mx-auto mt-3 max-w-xl text-center text-4xl font-black text-navy sm:text-5xl">
              Veja a apresentação completa
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <Bleed className="mt-14">
              <div className="relative aspect-video">
                <iframe src={c.slides_url} className="absolute inset-0 h-full w-full" allowFullScreen />
              </div>
            </Bleed>
          </Reveal>
        </section>
      )}

      {/* PDF */}
      {c.pdf_url && (
        <section className="mx-auto max-w-2xl px-6 pb-24">
          <Reveal>
            <a
              href={c.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-coral"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bg text-coral">
                <FileText size={22} />
              </span>
              <span className="flex-1">
                <span className="block text-xs font-bold uppercase tracking-widest text-gray">
                  Documento completo
                </span>
                <span className="block font-bold text-navy group-hover:text-coral">Ver PDF do projeto</span>
              </span>
              <ArrowUpRight size={20} className="text-coral" />
            </a>
          </Reveal>
        </section>
      )}

      {/* CTA final */}
      <section className="relative overflow-hidden px-6 py-32 text-center">
        <div className="animated-gradient absolute inset-0 opacity-70" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-white/70">
              Case · TPointic
            </p>
            <h2 className="mx-auto mt-3 max-w-lg text-4xl font-black text-white sm:text-5xl">
              Gostou desse case?
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/cases"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
              >
                Ver todos os cases <ArrowRight size={18} />
              </Link>
              {c.figma_url && (
                <a
                  href={c.figma_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-bold text-white transition-colors hover:border-white"
                >
                  {isFigmaUrl(c.figma_url) ? <Figma size={16} /> : <ArrowUpRight size={16} />}
                  {isFigmaUrl(c.figma_url) ? "Abrir arquivo no Figma" : "Abrir protótipo"}
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
