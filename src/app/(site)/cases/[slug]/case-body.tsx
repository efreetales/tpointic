"use client";

import { useRef, useState, type ComponentType, type ReactNode, type RefObject } from "react";
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
import { StatRing } from "@/components/stat-ring";
import { NpsGauge } from "@/components/nps-gauge";
import { PieChart } from "@/components/pie-chart";
import { GalleryStepCounter } from "@/components/gallery-step-counter";
import { ConnectorLine } from "@/components/connector-line";
import { MascotMaskedVideo } from "@/components/mascot-masked-video";
import { ScreenMarquee } from "@/components/screen-marquee";
import { DesktopScreenShowcase } from "@/components/desktop-screen-showcase";
import { Phone3D } from "@/components/phone-3d";
import { MacbookScreens } from "@/components/macbook-screens";
import { Bleed } from "@/components/bleed";
import type { Case, Destaque, PieChartData } from "@/lib/cases";

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

// Shared dark palette rotated via `nextBg()` (below) across every flat
// section, including the sticky-parallax gallery panels — one continuous
// rotation, not two separate systems, is what makes the gallery header and
// its first panel share the same color instead of clashing (see the
// gallery section's own comment for why that matters). Distinct background
// colors are what actually separates one section from the next; on the
// near-black `bg-bg`/`bg-surface` tones (#0a0a0a/#141414) alternating
// between just those two read as "one big black block" no matter how much
// padding separates them. A glow/seam effect at the section boundary was
// tried before and dropped — didn't read as a strong enough separator and
// got in the way visually. A gallery item can override its own panel via
// `gallery[].bg`.
const SECTION_BG_PALETTE = ["#0a0a0a", "#12102a", "#0a1f1d", "#1a0f1f", "#141420"];

// Fallback bucket for any `destaques`/`pie_charts` item without its own
// `grupo` — every item lands in this one implicit group, so the tab menu
// below only ever appears when a case explicitly opts into multiple groups
// (ex. Sulamérica). A case with just 2-3 results and no `grupo` set keeps
// rendering exactly as before this field existed.
const DEFAULT_RESULT_GROUP = "Resultados";

// Every metric in the Resultados section — ring, NPS gauge, plain
// number/text card, or pie chart — normalized into one shape so they can
// share a single grid + tab-filter instead of four separate hand-wired
// lists. `key` must be unique across ALL items (labels/titles already are,
// since they're also what's shown on screen).
type ResultItem =
  | { kind: "ring"; key: string; grupo: string; data: Destaque }
  | { kind: "nps"; key: string; grupo: string; data: Destaque }
  | { kind: "card"; key: string; grupo: string; data: Destaque }
  | { kind: "pie"; key: string; grupo: string; data: PieChartData };

// Intrinsic pixel size of each case's `problema_bg_url` image — lets the "O
// problema" section size it off its own height (`h-full w-auto`) instead of
// stretching/covering a fixed-width box, which crops off a chunk of the
// image's own left edge whenever the block ends up tall and narrow (long
// problem text = tall block; a portrait image forced into a narrow `cover`
// box loses its left side). Falls back to a plain `object-cover` box for a
// case that hasn't had its natural size recorded here yet.
const PROBLEMA_BG_NATURAL: Record<string, { width: number; height: number }> = {
  "e-sim-vivo-empresas": { width: 1370, height: 1540 },
};

// Same idea, for `capa_url` when `hero_device === "laptop"` — the capa is a
// wide screenshot of laptop/notebook mockups (ex. UOL Deezer), not a portrait
// product shot, so the default `aspect-[4/3] object-cover` hero card crops
// off the edges of the notebooks. Real width/height lets it render at its
// own aspect ratio, uncropped, same as `PROBLEMA_BG_NATURAL` does above.
const CAPA_NATURAL: Record<string, { width: number; height: number }> = {
  "uol-musica-deezer": { width: 829, height: 483 },
};

// Supports a simple **destaque** marker inside `problema_texto`. Color is
// passed in by the caller instead of hardcoded — the two branches below
// need different colors on purpose: the light Vivo-branded variant
// (`problema_bg_url` set) matches its own "O desafio" badge in purple
// (#7e20cf, Vivo's brand color specifically), while the generic dark
// centered fallback uses the site's standard coral accent. Never hardcode
// purple as this function's own default — a case like Sulamérica has its
// own brand colors, and purple reads as "this is a Vivo case" to anyone
// who's seen both.
function highlightProblemText(text: string, colorClassName: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className={colorClassName}>
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
// sitting in a wall of text. A bullet line ending in `{{video}}` (marker
// stripped before rendering) gets `videoAnchorRef` attached to its `<li>` —
// used by `<ConnectorLine>` to draw a line from that specific bullet to
// `conteudo_video_url`'s player, when the case sets both.
function renderConteudo(text: string, videoAnchorRef?: RefObject<HTMLLIElement | null>) {
  return text.split(/\n\n+/).map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;
    const lines = trimmed.split("\n").map((l) => l.trim());
    const isBulletList = lines.length > 1 && lines.every((l) => l.startsWith("- "));
    const isHeading = lines.length === 1 && trimmed.length <= 60 && !trimmed.startsWith("-");

    if (isBulletList) {
      return (
        <ul key={i} className="mt-6 space-y-2">
          {lines.map((l, j) => {
            const isVideoAnchor = l.includes("{{video}}");
            const label = l.slice(2).replace(/\s*\{\{video\}\}\s*$/, "");
            return (
              <li
                key={j}
                ref={isVideoAnchor ? videoAnchorRef : undefined}
                className="flex gap-3 text-lg leading-relaxed text-navy"
              >
                <span className="mt-1 text-coral">—</span>
                {/* Mesma cor da linha do ConnectorLine (#66fcf1) + negrito —
                    reforça visualmente que ESTE bullet específico é o que
                    está linkado ao vídeo ao lado, não só a linha sozinha. */}
                <span className={isVideoAnchor ? "font-bold text-[#66fcf1]" : undefined}>{label}</span>
              </li>
            );
          })}
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

// Section eyebrow ("PROTÓTIPO", "RESULTADOS", etc.) as a pill/badge instead
// of plain colored text — plain text in one fixed color broke whenever a
// section's background wasn't dark (ex. cyan eyebrow text on the eSIM Vivo
// prototype's white background was nearly unreadable). The pill's own
// tinted background+border gives it contrast against ANY section
// background, light or dark, so it doesn't need to match the page bg at
// all. `light` picks which brand color: purple (`#7e20cf`) for a light
// section background, the site's standard cyan (`#66fcf1`) for a dark one —
// pick based on the actual background color behind it, not the case.
function SectionEyebrow({
  children,
  light = false,
  justify = "justify-center",
  className = "",
}: {
  children: ReactNode;
  light?: boolean;
  /** Tailwind justify-* classes for the wrapper — defaults to centered, pass
   * e.g. "justify-start" or "justify-center lg:justify-start" to match the
   * surrounding text alignment. */
  justify?: string;
  /** Extra classes on the wrapper (ex. `px-6` to match a section's own
   * horizontal padding when the eyebrow sits outside a padded container). */
  className?: string;
}) {
  const color = light ? "#7e20cf" : "#66fcf1";
  return (
    <div className={`flex ${justify} ${className}`}>
      <span
        className="inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
        style={{ borderColor: `${color}4d`, backgroundColor: `${color}1a`, color }}
      >
        {children}
      </span>
    </div>
  );
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

// A Google Drive share link (`/file/d/<id>/view?usp=...`) isn't embeddable
// as-is — Drive needs the same file id on a `/preview` path instead. Any
// other video URL (Vimeo/YouTube embed link, a direct `.mp4`) passes
// through unchanged, so this is safe to run on every `video_url` regardless
// of source.
function embedVideoUrl(url: string) {
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
}

export function CaseBody({ c }: { c: Case }) {
  const screens = c.screens.map((s) => ({ src: s.url, alt: s.alt }));
  const hasStepFlow = c.steps.length > 0;
  const hasStats = c.destaques.length > 0;
  // Split into ring-friendly (percent), gauge-friendly (NPS), and plain
  // stats — a case can mix all three (e.g. a % ring, an NPS gauge, and a
  // qualitative highlight like "redução de chamadas"), so this isn't a
  // strict either/or. NPS is detected by label containing "NPS" + a plain
  // signed integer valor (-100..100 scale, as reported by the source) —
  // that's the convention `destaques` for an NPS metric should follow.
  const percentStats = c.destaques.filter((d) => /%\s*$/.test(d.valor.trim()));
  const npsStats = c.destaques.filter(
    (d) => !/%\s*$/.test(d.valor.trim()) && /nps/i.test(d.label) && /^-?\d+$/.test(d.valor.trim()),
  );
  const otherStats = c.destaques.filter((d) => !percentStats.includes(d) && !npsStats.includes(d));

  const resultItems: ResultItem[] = [
    ...percentStats.map((d) => ({ kind: "ring" as const, key: d.label, grupo: d.grupo ?? DEFAULT_RESULT_GROUP, data: d })),
    ...npsStats.map((d) => ({ kind: "nps" as const, key: d.label, grupo: d.grupo ?? DEFAULT_RESULT_GROUP, data: d })),
    ...otherStats.map((d) => ({ kind: "card" as const, key: d.label, grupo: d.grupo ?? DEFAULT_RESULT_GROUP, data: d })),
    ...c.pie_charts.map((p) => ({ kind: "pie" as const, key: p.title, grupo: p.grupo ?? DEFAULT_RESULT_GROUP, data: p })),
  ];
  const resultGroups = Array.from(new Set(resultItems.map((item) => item.grupo)));
  // Only meaningful when `resultGroups.length > 1` (tab menu visible) — the
  // grid shows every item when there's just one implicit group, so this
  // state is simply unused in that case.
  const [activeGroup, setActiveGroup] = useState(resultGroups[0] ?? DEFAULT_RESULT_GROUP);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const conteudoGridRef = useRef<HTMLDivElement>(null);
  const conteudoVideoAnchorRef = useRef<HTMLLIElement>(null);
  const conteudoVideoBoxRef = useRef<HTMLDivElement>(null);
  const visibleResultItems = resultGroups.length > 1 ? resultItems.filter((item) => item.grupo === activeGroup) : resultItems;
  const hasStyleGuide = (c.style_guide.colors?.length ?? 0) > 0 || (c.style_guide.patterns?.length ?? 0) > 0;
  // When every gallery panel is white (e.g. a case built from plain
  // diagrams/screenshots on white bg), the dark section header above them
  // reads as a jarring break — flip the header itself to white too so it
  // reads as one continuous surface instead of dark-to-white-to-dark.
  const galleryIsLight = c.gallery.length > 0 && c.gallery.every((g) => (g.bg ?? "").toLowerCase() === "#ffffff");
  const prototypeBg = c.prototipo_bg_color ?? "#000000";
  const prototypeIsLight = prototypeBg.toLowerCase() === "#ffffff";

  let bgToggle = 0;
  const nextBg = () => SECTION_BG_PALETTE[bgToggle++ % SECTION_BG_PALETTE.length];

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
              className={c.hero_device === "laptop" ? "mx-auto w-full max-w-[700px]" : "mx-auto w-full max-w-[300px]"}
            >
              {c.hero_device === "laptop" ? (
                <MacbookScreens screens={screens} />
              ) : (
                <Phone3D screens={screens} />
              )}
            </motion.div>
          ) : (
            c.capa_url &&
            (c.hero_device === "laptop" ? (
              // Sem card/moldura/corte — a capa já É a imagem final (mockups
              // de notebook), enquadrar num `aspect-[4/3] object-cover`
              // cortaria as bordas. `CAPA_NATURAL` dá a proporção real pra
              // ela renderizar no tamanho certo em vez de espremida/cortada.
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="mx-auto w-full max-w-2xl"
              >
                <Image
                  src={c.capa_url}
                  alt=""
                  width={CAPA_NATURAL[c.slug]?.width ?? 1200}
                  height={CAPA_NATURAL[c.slug]?.height ?? 800}
                  className="h-auto w-full"
                  priority
                  sizes="(min-width: 1024px) 640px, 100vw"
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
              >
                <Image
                  src={c.capa_url}
                  alt=""
                  fill
                  className="object-cover"
                  style={{ objectPosition: c.capa_focal ?? "center" }}
                  priority
                  sizes="(min-width: 1024px) 480px, 100vw"
                />
              </motion.div>
            ))
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

      {/* O problema — três variantes. Com `problema_video_url` (ex. eSIM
          Vivo): vídeo recortado na forma do mascote Vivo/Claro
          (`MascotMaskedVideo`) à esquerda, texto à direita, em fluxo normal
          (não absolute/full-height) — o vídeo é um elemento compacto (uma
          silhueta, não um retângulo full-bleed), então não precisa "roubar"
          quase metade da largura do texto do jeito que a variante de imagem
          fazia. **Erro já cometido**: a variante original de imagem
          (`problema_bg_url`) usava posicionamento absoluto cobrindo toda a
          altura do bloco + `lg:pr-[48%]` no texto — pensada pra uma FOTO
          retangular grande, ficava com o texto espremido numa coluna
          estreita quando a frase era mais longa (ex. eSIM Vivo em telas de
          notebook). A variante de vídeo evita isso de propósito, com layout
          flex simples e o vídeo com largura própria limitada, não
          "roubando" espaço do texto. Sem `problema_video_url`, cai pra
          variante de imagem (`problema_bg_url`, mesma lógica de sempre);
          sem nenhum dos dois, cai pro layout centrado padrão sobre um tom
          da paleta de fundo rotativa. */}
      {c.problema_texto &&
        (c.problema_video_url ? (
          <section
            className="relative overflow-hidden px-6 py-32"
            style={{ backgroundColor: c.problema_bg_color ?? "#f6f6f6" }}
          >
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">
              <Reveal>
                <MascotMaskedVideo videoUrl={c.problema_video_url} className="w-full max-w-[280px] sm:max-w-[340px]" />
              </Reveal>
              <Reveal delay={0.1}>
                <div>
                  <SectionEyebrow light justify="justify-center lg:justify-start">
                    O desafio
                  </SectionEyebrow>
                  <p className="mt-5 max-w-lg text-center text-2xl font-black leading-tight text-[#1a1a1a] sm:text-4xl lg:text-left">
                    {highlightProblemText(c.problema_texto, "text-[#7e20cf]")}
                  </p>
                </div>
              </Reveal>
            </div>
          </section>
        ) : c.problema_bg_url ? (
          <section
            className="relative overflow-hidden px-6 py-32"
            style={{ backgroundColor: c.problema_bg_color ?? "#f6f6f6" }}
          >
            <div className="absolute inset-y-0 right-0 hidden lg:block">
              {PROBLEMA_BG_NATURAL[c.slug] ? (
                <Image
                  src={c.problema_bg_url}
                  alt=""
                  width={PROBLEMA_BG_NATURAL[c.slug].width}
                  height={PROBLEMA_BG_NATURAL[c.slug].height}
                  className="h-full w-auto object-cover"
                />
              ) : (
                <div className="relative h-full w-[40vw]">
                  <Image src={c.problema_bg_url} alt="" fill className="object-cover" sizes="40vw" />
                </div>
              )}
            </div>

            <Reveal>
              <div className="relative mx-auto max-w-6xl lg:pr-[48%]">
                <SectionEyebrow light justify="justify-start">
                  O desafio
                </SectionEyebrow>
                <p className="mt-5 max-w-lg text-2xl font-black leading-tight text-[#1a1a1a] sm:text-4xl">
                  {highlightProblemText(c.problema_texto, "text-[#7e20cf]")}
                </p>
              </div>
            </Reveal>

            {/* No mobile a imagem não cabe "colada nas bordas" fazendo
                sentido (não há altura de bloco fixa pra preencher) — cai pro
                tratamento simples de sempre, abaixo do texto. */}
            <div className="relative mx-auto mt-10 aspect-[3/4] w-full max-w-sm lg:hidden">
              <Image
                src={c.problema_bg_url}
                alt=""
                fill
                className="object-contain object-right"
                sizes="80vw"
              />
            </div>
          </section>
        ) : (
          <section className="relative px-6 py-32" style={{ backgroundColor: nextBg() }}>
            <Reveal>
              <p className="mx-auto max-w-3xl text-center text-3xl font-black leading-tight text-navy sm:text-5xl">
                {highlightProblemText(c.problema_texto, "text-coral")}
              </p>
            </Reveal>
          </section>
        ))}

      {/* Etapas — o fluxo do produto (ex. Sulamérica: Pedido → Match →
          Confirmado) e o processo de design (ex. Imersão → Definição →
          Prototipação) são coisas diferentes e merecem títulos diferentes;
          nunca reaproveitar "A solução / Como funciona" pra um processo. */}
      {hasStepFlow && (
        <section className="relative px-6 py-32" style={{ backgroundColor: nextBg() }}>
          <Reveal>
            <SectionEyebrow>{c.steps_eyebrow ?? "A solução"}</SectionEyebrow>
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

      {/* Galeria de impacto — pilha com parallax (cada bloco cobre o anterior
          ao rolar). Sem overflow-hidden na seção: os blocos filhos usam
          `position: sticky`, e overflow non-visible em qualquer ancestral
          quebra o efeito (documentado na skill tpointic-wow-case). Fica
          logo depois de Etapas de propósito — é "olhar de perto" o processo
          que acabou de ser resumido (ex. eSIM Vivo: escopo/roadmap de cada
          fase; Sulamérica: os passos do teste), então pertence junto da
          explicação do processo, não lá no fim perto dos resultados. */}
      {c.gallery.length > 0 ? (
        // IIFE (not a hoisted `const` before the JSX) on purpose: `nextBg()`
        // must fire at exactly this point in render order, same as every
        // other section's inline `nextBg()` call — hoisting this above the
        // earlier sections would grab a color out of turn and shift the
        // whole rotation. Reusing this one `galleryBg` value for both the
        // section background AND panel 0's default is what makes the header
        // and the first panel share the same color (previously they came
        // from two independent color sources — the header from `nextBg()`,
        // panel 0 from a fixed-index array — so they only matched by
        // coincidence, and usually didn't).
        (() => {
          const galleryBg = galleryIsLight ? "#ffffff" : nextBg();
          return (
            // `pt-32` só no topo (antes do título) — nada de `pb-32`: um
            // padding embaixo da trilha de painéis sticky ficaria pintado
            // com `galleryBg` (a cor do header/painel 0), não a cor do
            // ÚLTIMO painel, criando uma faixa vazia com cor destoante bem
            // na virada pra próxima seção. Sem padding aqui, a seção
            // termina exatamente onde o último painel termina.
            <section className="relative pt-32" style={{ backgroundColor: galleryBg }}>
              <Reveal>
                <SectionEyebrow light={galleryIsLight} className="px-6">
                  {c.gallery_eyebrow ?? "De perto"}
                </SectionEyebrow>
                <h2
                  className={`mx-auto mt-3 max-w-xl px-6 text-center text-4xl font-black sm:text-5xl ${
                    galleryIsLight ? "text-[#1a1a1a]" : "text-navy"
                  }`}
                >
                  {c.gallery_title ?? c.titulo}
                </h2>
                {c.gallery_intro && (
                  <p
                    className={`mx-auto mt-6 max-w-2xl px-6 text-center text-lg leading-relaxed ${
                      galleryIsLight ? "text-[#4a4a4a]" : "text-slate"
                    }`}
                  >
                    {c.gallery_intro}
                  </p>
                )}
              </Reveal>

              <div ref={galleryTrackRef} className="relative mt-16">
                {/* Círculo com o número do passo — precisa ser o PRIMEIRO
                    filho da trilha (não o último): um elemento `sticky` só
                    fica "grudado" enquanto sua posição normal no fluxo
                    ainda não passou — perto do topo da trilha ele tem a
                    trilha inteira de scroll pela frente pra ficar sticky;
                    no fim (posição antiga, erro já cometido aqui) ele só
                    "gruda" pertinho do fim da rolagem, ficando invisível
                    durante quase toda a galeria. Continua pintando por cima
                    dos painéis por causa do `z-index` explícito (`z-20`),
                    não da ordem no DOM — ordem no DOM aqui é só sobre
                    quando o elemento começa a existir no fluxo/scroll, não
                    sobre o que pinta por cima do quê. Opt-in via
                    `gallery_numbered` — só faz sentido quando a galeria é
                    uma sequência numerada (ex. Sulamérica: passos do
                    teste), não numa galeria de impacto sem ordem
                    narrativa. */}
                {c.gallery_numbered && c.gallery.length > 1 && (
                  <GalleryStepCounter trackRef={galleryTrackRef} total={c.gallery.length} />
                )}
                {c.gallery.map((item, i) => (
                  <div
                    key={item.url}
                    className="sticky top-0 flex h-screen w-full flex-col overflow-hidden lg:flex-row"
                    style={{ backgroundColor: item.bg ?? (i === 0 ? galleryBg : nextBg()) }}
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
                {/* Espaçador invisível de 1 `h-screen` — sem ele, o ÚLTIMO
                    painel nunca fica "pinado" tempo nenhum: cada painel só
                    fica grudado no topo enquanto o PRÓXIMO ainda não chegou
                    lá, então o último (sem próximo) fica limitado pelo fim
                    da própria trilha — que, sem esse espaçador extra,
                    coincide exatamente com o fim do próprio painel, dando
                    zero tempo de tela pra ele. O usuário via isso como um
                    vão vazio (só o fundo do painel, sem texto/imagem) antes
                    da próxima seção — na real era o painel sumindo rápido
                    demais, sem nunca ficar parado na tela como os outros. */}
                <div aria-hidden className="h-screen" />
              </div>
            </section>
          );
        })()
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

      {/* Conteúdo — narrativa longa (objetivo, processo, papel), separada da
          frase de impacto curta da seção "O problema" acima. Com
          `conteudo_video_url` preenchido, vira duas colunas: texto alinhado
          à esquerda + vídeo à direita (ex. UOL Deezer: um vídeo-resumo das
          entrevistas/testes de usabilidade ao lado do texto que descreve
          esse mesmo processo) — sem o campo, cai no layout centrado padrão
          de sempre. Distinto da seção "Vídeo" mais abaixo (`video_url`,
          própria seção "Eu explico esse case") — esse vídeo aqui ilustra o
          CONTEÚDO ao lado dele, não é um vídeo do case como um todo. */}
      {c.conteudo && (
        <Reveal>
          {c.conteudo_video_url ? (
            <div ref={conteudoGridRef} className="relative mx-auto grid max-w-6xl items-start gap-12 px-6 py-20 lg:grid-cols-2">
              <div>{renderConteudo(c.conteudo, conteudoVideoAnchorRef)}</div>
              {/* `lg:sticky` — o vídeo fica parado na tela enquanto o texto
                  (normalmente bem mais alto) rola ao lado, efeito parallax
                  leve. Só em telas grandes (`lg:`): no mobile as colunas
                  empilham, e sticky não faz sentido pra uma coluna que já
                  não compartilha espaço de rolagem com a outra. */}
              <div className="lg:sticky lg:top-24">
                {c.conteudo_video_titulo && (
                  <h3 className="mb-4 text-xl font-black text-navy">{c.conteudo_video_titulo}</h3>
                )}
                <div ref={conteudoVideoBoxRef} className="overflow-hidden rounded-2xl border border-border shadow-2xl">
                  {c.conteudo_video_url.endsWith(".mp4") ? (
                    <video src={c.conteudo_video_url} controls className="w-full" preload="metadata" />
                  ) : (
                    <div className="relative aspect-video">
                      <iframe
                        src={embedVideoUrl(c.conteudo_video_url)}
                        className="absolute inset-0 h-full w-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              </div>
              <ConnectorLine
                containerRef={conteudoGridRef}
                fromRef={conteudoVideoAnchorRef}
                toRef={conteudoVideoBoxRef}
              />
            </div>
          ) : (
            <div className="mx-auto max-w-2xl px-6 py-20">{renderConteudo(c.conteudo)}</div>
          )}
        </Reveal>
      )}

      {/* Protótipo — largura total, sem moldura, sem rodapé de ferramenta.
          Fundo fixo em `prototipo_bg_color` (não entra na rotação de
          `nextBg()`) — deve ser a MESMA cor de fundo do próprio protótipo
          embutido (preto puro pro canvas do Figma, branco pra um protótipo
          com UI branca, ex. eSIM Vivo), pra fundir com o embed em vez de
          criar uma borda visível entre "moldura do site" e "conteúdo do
          protótipo". Sem `prototipo_bg_color` definido, cai pro preto (era
          o único caso até agora — Figma). */}
      {c.figma_url && (
        <section className="relative px-6 pt-16" style={{ backgroundColor: prototypeBg }}>
          <Reveal>
            <SectionEyebrow light={prototypeIsLight}>Protótipo</SectionEyebrow>
            <h2
              className={`mx-auto mt-3 max-w-xl text-center text-4xl font-black sm:text-5xl ${
                prototypeIsLight ? "text-[#1a1a1a]" : "text-navy"
              }`}
            >
              Explore o fluxo completo
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <Bleed className="mt-10">
              <iframe
                src={embedPrototypeUrl(c.figma_url)}
                className="w-full"
                style={{ height: `${c.prototipo_altura ?? 1500}px` }}
                allow="fullscreen"
                allowFullScreen
              />
            </Bleed>
          </Reveal>
        </section>
      )}

      {/* Abrir no Figma/protótipo — faixa full-bleed clicável, mesmo padrão
          da faixa de PDF/"Ver portfólio completo" (não mais uma pílula
          pequena isolada dentro da seção do protótipo). */}
      {c.figma_url && (
        <a
          href={c.figma_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center overflow-hidden px-6 py-14 text-center"
        >
          <div className="animated-gradient absolute inset-0" />
          <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/10" />
          <Reveal>
            <span className="relative inline-flex items-center gap-3 text-xl font-black text-white sm:text-2xl">
              {isFigmaUrl(c.figma_url) ? <Figma size={22} className="shrink-0" /> : null}
              {isFigmaUrl(c.figma_url) ? "Abrir no Figma" : "Abrir protótipo"}
              <ArrowUpRight
                size={24}
                className="shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </span>
          </Reveal>
        </a>
      )}

      {/* Telas em destaque — esteira contínua */}
      {screens.length > 0 && (
        <section className="relative overflow-hidden py-32" style={{ backgroundColor: nextBg() }}>
          <Reveal>
            <SectionEyebrow className="px-6">O produto</SectionEyebrow>
            <h2 className="mx-auto mt-3 max-w-xl px-6 text-center text-4xl font-black text-navy sm:text-5xl">
              Telas em destaque
            </h2>
          </Reveal>
          <div className="mt-14">
            {c.hero_device === "laptop" ? (
              <DesktopScreenShowcase screens={screens} />
            ) : (
              <ScreenMarquee screens={screens} />
            )}
          </div>
        </section>
      )}

      {/* Style guide */}
      {hasStyleGuide && (
        <section className="relative px-6 py-32" style={{ backgroundColor: nextBg() }}>
          <Reveal>
            <SectionEyebrow>Style guide</SectionEyebrow>
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

      {/* Resultados — anel pra %, gauge pra NPS, card de número grande pro
          resto (texto/tempo), donut pra distribuição por categoria — todos
          no mesmo card transparente (`rounded-2xl border-white/15 bg-white/5`),
          numa grade que estica cada card até a altura da linha (visual
          "blocado"). Fica DEPOIS da Galeria/Etapas/Conteúdo de propósito —
          a lógica narrativa de um case é desafio → processo (como foi
          feito/validado) → resultado (números/entrega), então o resultado
          só faz sentido depois de já termos mostrado o processo que levou
          até ele, nunca antes. **Erro já cometido**: existia um segundo
          caminho aqui — um grid de `<Counter>` solto sobre fundo sólido,
          usado quando nenhum destaque era `%`/NPS/pizza (só texto/contagem,
          ex. UOL Deezer: "crescimento", "2h26", "milhares de usuários/dia").
          Ficava visualmente pobre (números soltos, sem o mesmo peso "bloco"
          dos outros cases) bem do lado de seções cuidadosamente desenhadas.
          Removido — `otherStats`/kind "card" já cobre esse formato dentro
          do MESMO grid de cards transparentes, então não havia razão pra um
          caminho visual à parte. */}
      {hasStats || c.pie_charts.length > 0 ? (
        <section className="animated-gradient relative px-6 py-32">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative">
            <Reveal>
              <SectionEyebrow>Resultados</SectionEyebrow>
              <h2 className="mx-auto mt-3 max-w-xl text-center text-4xl font-black text-white sm:text-5xl">
                O que mudou de verdade
              </h2>
            </Reveal>

            {/* Menu de abas — só aparece quando o case usa `grupo` em mais de
                um destaque/gráfico (ver `DEFAULT_RESULT_GROUP`). Cases com
                poucos resultados (a maioria) nunca setam `grupo`, então tudo
                cai no mesmo grupo implícito e esse menu simplesmente não
                renderiza — comportamento idêntico ao de antes desse campo
                existir. Existe pra casos como a Sulamérica, com resultados
                demais (eficiência + NPS antes/depois + 2 gráficos de pizza)
                pra mostrar tudo de uma vez sem virar uma parede de dados. */}
            {resultGroups.length > 1 && (
              <Reveal delay={0.1}>
                <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-3">
                  {resultGroups.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setActiveGroup(g)}
                      className={`rounded-full border px-5 py-2 text-sm font-bold uppercase tracking-widest transition-colors ${
                        activeGroup === g
                          ? "border-white bg-white text-black"
                          : "border-white/30 text-white/70 hover:border-white/60 hover:text-white"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </Reveal>
            )}

            <Reveal delay={0.15}>
              <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleResultItems.map((item) => (
                  <div
                    key={item.key}
                    className="flex h-full flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-8 text-center backdrop-blur-sm"
                  >
                    {item.kind === "ring" &&
                      (() => {
                        const percent = Math.abs(parseInt(item.data.valor, 10));
                        return (
                          <StatRing
                            value={item.data.valor}
                            percent={Number.isFinite(percent) ? percent : 0}
                            label={item.data.label}
                            color="#66fcf1"
                            icon={item.data.icon ? ICONS[item.data.icon] : undefined}
                          />
                        );
                      })()}
                    {item.kind === "nps" && <NpsGauge value={parseInt(item.data.valor, 10)} label={item.data.label} />}
                    {item.kind === "card" && (
                      <>
                        <p className="text-3xl font-black text-white sm:text-4xl">{item.data.valor}</p>
                        <p className="mt-3 text-sm font-bold uppercase tracking-widest text-white/80">
                          {item.data.label}
                        </p>
                      </>
                    )}
                    {item.kind === "pie" && (
                      <PieChart title={item.data.title} slices={item.data.slices} total={item.data.total} />
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Vídeo — texto à esquerda, vídeo à direita (não full-bleed: em
          telas grandes um vídeo 100% de largura fica "estourado" demais). */}
      {c.video_url && (
        <section className="relative px-6 py-32" style={{ backgroundColor: nextBg() }}>
          <Reveal>
            <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="text-center lg:text-left">
                <SectionEyebrow justify="justify-center lg:justify-start">Vídeo</SectionEyebrow>
                <h2 className="mt-3 text-4xl font-black text-navy sm:text-5xl">Eu explico esse case</h2>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border shadow-2xl">
                {c.video_url.endsWith(".mp4") ? (
                  <video src={c.video_url} controls className="w-full" preload="metadata" />
                ) : (
                  <div className="relative aspect-video">
                    <iframe
                      src={embedVideoUrl(c.video_url)}
                      className="absolute inset-0 h-full w-full"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* Slides */}
      {c.slides_url && (
        <section className="relative px-6 py-32" style={{ backgroundColor: nextBg() }}>
          <Reveal>
            <SectionEyebrow>Apresentação</SectionEyebrow>
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

      {/* PDF — faixa full-bleed clicável, mesmo padrão do "Ver portfólio
          completo" da home (`.animated-gradient` + overlay escuro + texto
          grande), não mais um card pequeno solto na página. O card antigo
          ficava "grudado" no bloco anterior sem respiro nenhum — a faixa
          cheia resolve isso de graça (ocupa a largura toda, com seu próprio
          padding vertical generoso). */}
      {c.pdf_url && (
        <a
          href={c.pdf_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center overflow-hidden px-6 py-20 text-center"
        >
          <div className="animated-gradient absolute inset-0" />
          <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/10" />
          <Reveal>
            <span className="relative inline-flex items-center gap-3 text-2xl font-black text-white sm:text-4xl">
              <FileText size={28} className="shrink-0" />
              Ver PDF do projeto
              <ArrowUpRight
                size={32}
                className="shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </span>
          </Reveal>
        </a>
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
