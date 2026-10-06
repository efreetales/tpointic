"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "@mynaui/icons-react";
import type { Case } from "@/lib/cases";
import { getCaseBgColor } from "@/lib/case-colors";

// Hero da página de cases em duas camadas, ligadas pelo scroll:
//
//   camada 1 (em cima)  — o vídeo de fundo, recortado por uma máscara
//                         circular (`clip-path: circle`) que ENCOLHE conforme
//                         a página rola, de "cobrindo tudo" até virar uma
//                         bolinha no centro e sumir;
//   camada 2 (embaixo)  — fundo preto com os cases num "globo" 3D invisível,
//                         que vai sendo revelado pelo recorte (o preto
//                         aparece primeiro nos cantos).
//
// O globo é maior que a tela de propósito: os cards podem sangrar pra fora
// das bordas, o que dá mais espaço entre eles e permite cards grandes. Cada
// case é um ponto numa esfera; quem está na frente fica grande, nítido e
// opaco; quem está atrás encolhe, desfoca e quase some. Gira arrastando (com
// inércia). Clicar num card abre uma visão em destaque (`CaseViewer`) com a
// galeria do case passando, uma barra de tempo mostrando quando a imagem vai
// mudar, e o texto embaixo.
//
// Sem three.js: a projeção é feita à mão (rotação yaw+pitch de pontos de uma
// esfera → posição/escala/blur/opacidade por card), atualizada por ref
// dentro de um requestAnimationFrame — sem re-render do React por frame.

type Vec = { x: number; y: number; z: number };

// Pontos espalhados numa esfera: longitude pelo ângulo áureo e latitude por
// uma sequência de baixa discrepância, limitada a ±0,95 rad pra ninguém
// ficar colado num polo.
function spherePoints(n: number): Vec[] {
  return Array.from({ length: n }, (_, i) => {
    // `+ 0.5` evita o ponto 0 cair sempre num polo quando há poucos cards
    // (ex.: um filtro com 1 ou 2 cases).
    const lat = ((((i + 0.5) * 0.618034) % 1) * 2 - 1) * 0.95;
    const lon = i * 2.399963;
    return {
      x: Math.cos(lat) * Math.sin(lon),
      y: Math.sin(lat),
      z: Math.cos(lat) * Math.cos(lon),
    };
  });
}

// Gira em torno de Y (yaw) e depois de X (pitch). z>0 = voltado pra tela.
function rotate(p: Vec, yaw: number, pitch: number): Vec {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = p.x * cy + p.z * sy;
  const z1 = -p.x * sy + p.z * cy;
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  return { x: x1, y: p.y * cp - z1 * sp, z: p.y * sp + z1 * cp };
}

// Rotação de Rodrigues: gira o vetor `v` em torno do eixo unitário `k`.
function axisRotate(v: Vec, k: Vec, ang: number): Vec {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const dot = k.x * v.x + k.y * v.y + k.z * v.z;
  return {
    x: v.x * c + (k.y * v.z - k.z * v.y) * s + k.x * dot * (1 - c),
    y: v.y * c + (k.z * v.x - k.x * v.z) * s + k.y * dot * (1 - c),
    z: v.z * c + (k.x * v.y - k.y * v.x) * s + k.z * dot * (1 - c),
  };
}

// Física individual de cada card — é o que evita o globo girar como um bloco
// rígido (um card "seguindo" o outro). Cada card tem:
//   - a sua própria órbita (eixo, velocidade e sentido próprios);
//   - o seu raio e tamanho (não ficam todos na mesma esfera);
//   - uma mola própria (rigidez/amortecimento) que o faz seguir o arrasto do
//     visitante com atraso e "balanço" diferentes dos vizinhos;
//   - uma flutuação lenta própria em x/y.
// Determinístico (pseudo-aleatório por índice), então servidor e cliente
// concordam e a composição é a mesma a cada visita.
type Body = {
  axis: Vec;
  omega: number;
  phase: number;
  radius: number;
  size: number;
  k: number;
  c: number;
  wf1: number;
  wp1: number;
  wf2: number;
  wp2: number;
  yaw: number;
  pitch: number;
  vy: number;
  vp: number;
  // Deslocamento extra (px de tela) pra evitar sobrepor o vizinho — ver a
  // resolução de colisão no loop de animação. Não faz parte da órbita em si,
  // é somado por cima dela.
  avoidX: number;
  avoidY: number;
};

function cardBodies(n: number, yaw0: number, pitch0: number): Body[] {
  return Array.from({ length: n }, (_, i) => {
    const r = (k: number) => {
      const x = Math.sin((i + 1) * 12.9898 + k * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    const th = r(1) * Math.PI * 2;
    const la = (r(2) * 2 - 1) * 1.1;
    const k = 18 + r(7) * 32;
    return {
      axis: {
        x: Math.cos(la) * Math.cos(th),
        y: Math.sin(la),
        z: Math.cos(la) * Math.sin(th),
      },
      // rad/s — lento de propósito: a esfera é grande (sangra da tela), então
      // poucos centésimos de rad/s já são dezenas de px/s na tela.
      omega: (0.018 + r(3) * 0.035) * (r(4) < 0.5 ? -1 : 1),
      phase: r(11) * Math.PI * 2,
      radius: 0.85 + r(5) * 0.35,
      // Variação de tamanho quase cosmética (±4%) — o grosso da diferença de
      // tamanho entre os cards já vem da perspectiva (`t`, abaixo): um card
      // mais perto da "câmera" fica maior, um mais longe fica menor, como
      // profundidade de verdade. Esse fator aqui só evita que todos os cards
      // no MESMO plano de profundidade pareçam clones idênticos.
      size: 0.96 + r(6) * 0.08,
      k,
      c: 2 * (0.5 + r(8) * 0.35) * Math.sqrt(k),
      wf1: 0.15 + r(9) * 0.3,
      wp1: r(10) * Math.PI * 2,
      wf2: 0.12 + r(12) * 0.3,
      wp2: r(13) * Math.PI * 2,
      yaw: yaw0,
      pitch: pitch0,
      vy: 0,
      vp: 0,
      avoidX: 0,
      avoidY: 0,
    };
  });
}

// Card mais na frente "pesa" mais que um mais atrás — na resolução de
// sobreposição abaixo, o mais pesado cede menos espaço (o de trás é quem
// desvia na maior parte).
const cardWeight = (t: number) => 0.35 + t;
// Fração do tamanho do card considerada "território" pra efeito de
// sobreposição — menor que 1 pra permitir um leve encavalamento intencional
// (como na referência) e só corrigir sobreposições grandes de verdade.
const AVOID_PACK = 0.86;
// Deslocamento máximo (px) que a resolução pode empurrar um card — evita que
// muitas sobreposições simultâneas somem um empurrão exagerado.
// Fração do tamanho do card (`cardW`) que a resolução pode empurrá-lo —
// proporcional, não um px fixo: um card na frente é bem maior que um no
// fundo (a perspectiva os aumenta), então um limite fixo pequeno bastava
// pra separar dois cards pequenos do fundo mas não dava conta de dois cards
// grandes da frente, que ficavam parcialmente presos um sobre o outro.
const AVOID_MAX_FACTOR = 0.7;

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
const clamp01 = (v: number) => clamp(v, 0, 1);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const DRAG_SENSITIVITY = 0.0065;
const CLICK_MOVE_TOLERANCE = 6; // px de arrasto acima disso deixa de ser "clique"
const SLIDE_MS = 3600; // tempo de cada imagem na visão em destaque

// A página de cases (desktop) cabe inteira na tela, rodapé incluído — não há
// rolagem da página. O portal é controlado por uma "rolagem virtual": a roda
// do mouse (ou setas/PageDown) anda o progresso de 0 (vídeo) a 1 (globo), sem
// rolar o documento. Quantos px de roda equivalem ao percurso todo:
const WHEEL_RANGE_PX = 1100;
// Passou daqui o menu troca pro estilo escuro (os cantos já ficam pretos).
const NAV_SWITCH = 0.04;

// O vídeo do puppet (20 s) é uma aproximação lenta da câmera até o iMac e a
// volta. Ele "conversa" (boca abrindo e fechando) por volta de 18,5–19,8 s e
// de novo em 0,3–1,5 s (depois do loop). Quando o balão de fala aparece, o
// vídeo pula pra um pouco antes do primeiro trecho, então ele fala junto.
const TALK_START = 18.3;
function puppetTalk() {
  document
    .querySelectorAll<HTMLVideoElement>("video[data-puppet-video]")
    .forEach((v) => {
      v.currentTime = TALK_START;
      void v.play().catch(() => {});
    });
}

const ALL = "__all__";
// Ordem das categorias no menu (só aparecem as que têm ao menos 1 case).
const CATEGORY_ORDER = [
  "Service Design",
  "Product Design",
  "UX Research",
  "Liderança",
  "Educação",
  "IA",
];

type ViewMode = "orbital" | "lista";
type CategoryOption = { value: string; label: string; count: number };

// Alternador de modo de exibição (desktop): orbital (globo) ou lista.
function ModeToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  const items: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
    {
      mode: "orbital",
      label: "Orbital",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="8" cy="8" r="6.2" />
          <ellipse cx="8" cy="8" rx="6.2" ry="2.6" />
        </svg>
      ),
    },
    {
      // Token interno continua "lista" (não afeta nada visível — é só a
      // chave salva no localStorage e usada nos `if`s do resto do arquivo);
      // só o rótulo e o ícone mudaram de uma lista vertical pra esta galeria
      // em carrossel.
      mode: "lista",
      label: "Galeria",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <rect x="1" y="4.3" width="3.2" height="7.4" rx="1" />
          <rect x="6.4" y="1.8" width="3.2" height="12.4" rx="1" />
          <rect x="11.8" y="4.3" width="3.2" height="7.4" rx="1" />
        </svg>
      ),
    },
  ];
  return (
    <div
      role="group"
      aria-label="Modo de exibição"
      className="flex rounded-full border border-white/20 bg-black/40 p-1 backdrop-blur-md"
    >
      {items.map((it) => {
        const active = it.mode === value;
        return (
          <button
            key={it.mode}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(it.mode)}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#66fcf1] ${
              active
                ? "bg-white/15 text-[#66fcf1]"
                : "text-white/60 hover:text-white"
            }`}
          >
            {it.icon}
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

// Menu suspenso de categorias (desktop): botão + lista com a contagem de
// cada uma. Fecha com Esc, clique fora ou ao escolher.
function CategoryMenu({
  options,
  value,
  onChange,
}: {
  options: CategoryOption[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-3 rounded-full border border-white/20 bg-black/40 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-md outline-none transition-colors hover:border-[#66fcf1]/70 focus-visible:ring-2 focus-visible:ring-[#66fcf1]"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
          Categoria
        </span>
        <span>{current.label}</span>
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] tabular-nums text-white/80">
          {current.count}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden
          className={`text-white/70 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M2 4l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Categoria"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 top-[calc(100%+8px)] min-w-full overflow-hidden rounded-2xl border border-white/15 bg-[#141414]/95 p-1.5 shadow-2xl backdrop-blur-xl"
          >
            {options.map((o) => {
              const selected = o.value === value;
              return (
                <li key={o.value} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-6 rounded-xl px-4 py-2 text-left text-sm font-bold outline-none transition-colors focus-visible:bg-white/10 ${
                      selected
                        ? "bg-white/10 text-[#66fcf1]"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {o.label}
                    <span className="text-[11px] tabular-nums text-white/50">
                      {o.count}
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// Imagens do case para a galeria da visão em destaque: capa + galeria + telas
// + artefatos, sem repetir.
function caseImages(c: Case): string[] {
  const urls = [
    c.capa_url,
    ...c.gallery.map((g) => g.url),
    ...c.screens.map((s) => s.url),
    ...c.imagens,
  ];
  return Array.from(new Set(urls.filter((u): u is string => !!u))).slice(0, 8);
}

// Onde a janelinha do puppet "estaciona" (canto inferior esquerdo do palco):
// raio e centro, em px do palco. Usado pelo portal e pelo balão de fala.
function dockFor(W: number, H: number) {
  const r1 = Math.max(110, Math.min(180, Math.min(W, H) * 0.18));
  return { r1, c1x: 44 + r1, c1y: H - 44 - r1 };
}

// Geometria do portal para um progresso `m` (0 = cobrindo tudo, 1 = janelinha
// estacionada), num palco de W×H px e um vídeo de proporção `ratio`:
//   - (cx, cy, r): círculo do recorte;
//   - (x, y, s): transformação do vídeo que leva o "ponto de interesse"
//     (puppet + iMac) ao centro do círculo, reduzindo o vídeo o suficiente.
// Fica fora do componente porque a cópia da janelinha (por cima da visão em
// destaque) precisa da mesma conta.
function portalGeometry(m: number, W: number, H: number, ratio: number) {
  const { r1, c1x, c1y } = dockFor(W, H);
  const r0 = Math.hypot(W, H) / 2 + 12;
  const cx = W / 2 + (c1x - W / 2) * m;
  const cy = H / 2 + (c1y - H / 2) * m;
  const r = r0 + (r1 - r0) * m;
  // Ponto de interesse do vídeo (fração do quadro): puppet + iMac.
  const p0x = 0.285 * W;
  const p0y = 0.5 * H;
  // O vídeo usa o quadro natural (cobrindo o palco, como object-cover mas com
  // o retângulo real, que passa das bordas do palco). A escala final NUNCA
  // pode ser menor do que a que faz esse retângulo cobrir o círculo inteiro —
  // senão aparecem as bordas do vídeo (e o fundo atrás) dentro da janelinha.
  // Caso o enquadramento ideal (~58% da largura no diâmetro) peça menos zoom,
  // prevalece a cobertura.
  const vw = Math.max(W, H * ratio);
  const vh = Math.max(H, W / ratio);
  const vLeft = (W - vw) * 0.78;
  const vTop = (H - vh) / 2;
  const cover =
    1.04 *
    Math.max(
      r1 / (p0x - vLeft),
      r1 / (vLeft + vw - p0x),
      r1 / (p0y - vTop),
      r1 / (vTop + vh - p0y),
    );
  const fit = (2 * r1 * 1.05) / (0.58 * W);
  const sFinal = Math.min(1, Math.max(cover, fit));
  const s = 1 + (sFinal - 1) * m;
  return {
    m,
    cx,
    cy,
    r,
    s,
    x: p0x + (c1x - p0x) * m - s * p0x,
    y: p0y + (c1y - p0y) * m - s * p0y,
  };
}

// Cópia da janelinha do puppet, `fixed` por cima da visão em destaque (que
// escurece e desfoca o palco inteiro): sem ela, com um case aberto o puppet
// ficaria borrado e o balão de fala sairia do nada. Mesma posição e mesmo
// enquadramento da janelinha original — por cima dela, parece a mesma.
function PuppetDockCopy({
  w,
  h,
  footerH,
  ratio,
}: {
  w: number;
  h: number;
  footerH: number;
  ratio: number;
}) {
  const { r1, c1x, c1y } = dockFor(w, h);
  const g = portalGeometry(1, w, h, ratio);
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[310] hidden overflow-hidden rounded-full bg-white shadow-[0_0_50px_rgba(102,252,241,0.25)] ring-[3px] ring-[#66fcf1]/80 lg:block"
      style={{
        left: c1x - r1,
        bottom: footerH + (h - c1y) - r1,
        width: r1 * 2,
        height: r1 * 2,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div
        className="absolute"
        style={{
          left: -(c1x - r1),
          top: -(c1y - r1),
          width: w,
          height: h,
          transform: `translate(${g.x}px, ${g.y}px) scale(${g.s})`,
          transformOrigin: "0px 0px",
        }}
      >
        <video
          data-puppet-video
          onLoadedMetadata={(e) => {
            e.currentTarget.currentTime = TALK_START; // a cópia só existe quando um case foi aberto (o puppet acabou de falar)
          }}
          src="https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/hero-cases-typing.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute max-w-none min-h-full min-w-full"
          style={{
            left: "78%",
            top: "50%",
            width: "auto",
            height: "auto",
            transform: "translate(-78%, -50%)",
          }}
        />
        <div
          className="pointer-events-none absolute -inset-[60%] mix-blend-multiply"
          style={{ backgroundColor: "#e8ecef" }}
        />
      </div>
    </motion.div>
  );
}

// Frases de reserva do puppet pra cases que ainda não têm as suas
// (`frases_puppet` no banco).
const GENERIC_CASE_LINES = [
  "Esse case deu trabalho!",
  "O user journey desse aí é insano!",
  "Esse eu conto a história inteira.",
  "Esse aqui vale o clique!",
];

// Texto que "é digitado" letra a letra dentro do balão. O tamanho do balão já
// nasce com o texto completo (versão invisível por baixo), então ele não
// cresce enquanto digita. Com "reduzir movimento", aparece de uma vez.
function Typewriter({ text }: { text: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(text.length);
      return;
    }
    setN(0);
    const id = setInterval(() => {
      setN((v) => {
        if (v >= text.length) {
          clearInterval(id);
          return v;
        }
        return v + 1;
      });
    }, 26);
    return () => clearInterval(id);
  }, [text]);
  return (
    <span className="relative block">
      <span className="invisible">{text}</span>
      <span className="absolute inset-0">{text.slice(0, n)}</span>
    </span>
  );
}

// Visão em destaque de um case: galeria com barra de tempo + texto embaixo.
function CaseViewer({
  c,
  index,
  onClose,
}: {
  c: Case;
  index: number;
  onClose: () => void;
}) {
  const images = useMemo(() => caseImages(c), [c]);
  const [slide, setSlide] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  const next = () => setSlide((i) => (i + 1) % Math.max(1, images.length));
  const prev = () =>
    setSlide((i) => (i - 1 + images.length) % Math.max(1, images.length));

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    // Sem mexer em `overflow` aqui: no desktop a página de cases já trava a
    // rolagem do documento (e a limpa ao sair). Quando a visão em destaque
    // também gravava/restaurava esse valor, clicar em "Ver case completo"
    // (que desmonta as duas ao mesmo tempo) podia restaurar o "hidden" DEPOIS
    // da limpeza da página e travar a rolagem da página do case.
    return () => {
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={c.titulo}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/75 px-6 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      data-lenis-prevent
    >
      <motion.div
        className="relative w-full max-w-[min(92vw,680px)]"
        initial={{ opacity: 0, y: 30, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute -top-12 right-0 flex h-9 w-9 items-center justify-center rounded-full text-white/80 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#66fcf1]"
        >
          <X size={24} />
        </button>

        {/* Galeria: cada imagem entra com fade; clicar avança. */}
        <div
          className="relative aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-2xl ring-1 ring-white/10"
          style={{ backgroundColor: getCaseBgColor(c.slug, index) }}
          onClick={next}
        >
          <AnimatePresence initial={false}>
            {images.length > 0 ? (
              <motion.div
                key={images[slide]}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Image
                  src={images[slide]}
                  alt={`${c.titulo} — imagem ${slide + 1}`}
                  fill
                  className="object-contain"
                  sizes="680px"
                  priority
                />
              </motion.div>
            ) : (
              <div className="grid h-full place-items-center px-6 text-center text-2xl font-black text-white">
                {c.titulo}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Barra de tempo: enche até a próxima imagem entrar. */}
        {images.length > 1 && (
          <div
            className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-white/15"
            aria-hidden
          >
            <motion.div
              key={`${c.id}-${slide}`}
              className="h-full origin-left rounded-full bg-[#66fcf1]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
              onAnimationComplete={next}
            />
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            {c.cliente && (
              <p className="text-xs font-bold uppercase tracking-widest text-[#66fcf1]">
                {c.cliente}
              </p>
            )}
            <h2 className="mt-1 text-2xl font-black leading-tight text-white">
              {c.titulo}
            </h2>
            {c.resumo && (
              <p className="mt-2 line-clamp-3 max-w-md text-sm text-white/70">
                {c.resumo}
              </p>
            )}
          </div>
          <Link
            href={`/cases/${c.slug}`}
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105 sm:self-auto"
          >
            Ver case completo
            <ArrowUpRight
              size={18}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Galeria/carrossel (a antiga "Lista"): filme horizontal com um case em
// destaque no centro (maior, nítido) e os vizinhos menores e desbotados pros
// lados, como na referência. Clicar num vizinho o traz pro centro; o card em
// destaque já mostra a galeria de imagens com barra de tempo (mesma lógica
// da visão em destaque do modo Orbital) direto ali — sem precisar de um
// segundo clique pra abrir um modal por cima — e clicar nele leva pra página
// completa do case.
function GalleryCarousel({
  cases,
  category,
}: {
  cases: Case[];
  category: string;
}) {
  const router = useRouter();
  const filtered = useMemo(
    () =>
      cases
        .map((c, i) => ({ c, i }))
        .filter(({ c }) => category === ALL || c.categorias.includes(category)),
    [cases, category],
  );
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // Qual item está mais perto do centro do trilho — é esse que fica "em
  // destaque" (maior, nítido, clicável pra abrir).
  const updateActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    itemRefs.current.forEach((el, idx) => {
      if (!el) return;
      const dist = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = idx;
      }
    });
    setActive(best);
  }, []);

  // Troca de categoria muda os itens: volta pro início em vez de manter um
  // índice que agora aponta pra outro case.
  useEffect(() => {
    setActive(0);
    trackRef.current?.scrollTo({ left: 0 });
  }, [category]);

  useEffect(() => {
    updateActive();
  }, [filtered.length, updateActive]);

  const goTo = (idx: number) => {
    itemRefs.current[idx]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  // A roda do mouse é vertical por padrão — sem isso, só quem tem trackpad
  // conseguiria rolar o carrossel. `stopPropagation` pra não deixar a mesma
  // rolagem também mover o portal (ver o handler global no componente pai).
  // Em vez de aplicar o delta bruto no scroll (ficava brusco, sem a mesma
  // suavidade das setas), cada "entalhe" da roda avança um card por vez com
  // o mesmo `goTo` (scrollIntoView suave) usado pelas setas — trava novos
  // passos até a animação atual assentar, pra não disparar vários cards de
  // uma vez num flick rápido.
  const wheelAccum = useRef(0);
  const wheelLocked = useRef(false);
  const onWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (wheelLocked.current) return;
    wheelAccum.current += e.deltaY + e.deltaX;
    const THRESHOLD = 40;
    if (Math.abs(wheelAccum.current) < THRESHOLD) return;
    const dir = wheelAccum.current > 0 ? 1 : -1;
    wheelAccum.current = 0;
    const next = clamp(active + dir, 0, filtered.length - 1);
    if (next === active) return;
    wheelLocked.current = true;
    goTo(next);
    window.setTimeout(() => {
      wheelLocked.current = false;
    }, 420);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(Math.min(filtered.length - 1, active + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(Math.max(0, active - 1));
    } else if ((e.key === "Enter" || e.key === " ") && filtered[active]) {
      e.preventDefault();
      router.push(`/cases/${filtered[active].c.slug}`);
    }
  };

  const activeCase = filtered[active]?.c;
  const SHELL = 300; // px — tamanho "neutro" do slot; o destaque cresce por cima via scale
  const ACTIVE_SCALE = 1.5;
  const CARD_W = SHELL * ACTIVE_SCALE; // largura real do card em destaque na tela
  // Altura fixa da trilha (em vez de `flex-1` esticando até o rodapé): o
  // card em destaque cresce 1.5x por `transform: scale` (não conta pro
  // layout), então a trilha só precisa de espaço pra caber ele já ampliado
  // + a sombra. Sem isso, o card ficava centralizado no meio de uma área
  // enorme, deixando um vão enorme até a legenda embaixo.
  const TRACK_H = Math.ceil(SHELL * 0.75 * ACTIVE_SCALE) + 32;

  // Galeria de imagens + barra de tempo do card em destaque — mesma ideia da
  // `CaseViewer`, só que embutida direto no card ampliado (sem modal).
  const activeImages = useMemo(
    () => (activeCase ? caseImages(activeCase) : []),
    [activeCase],
  );
  const [slide, setSlide] = useState(0);
  useEffect(() => setSlide(0), [activeCase?.id]);
  const nextSlide = () =>
    setSlide((s) => (s + 1) % Math.max(1, activeImages.length));
  // No quadro logo após trocar de case (antes do efeito acima zerar
  // `slide`), o índice antigo pode estourar o novo array — usa módulo pra
  // nunca cair num índice vazio.
  const safeSlide = activeImages.length > 0 ? slide % activeImages.length : 0;

  return (
    <div
      data-list-scroll
      data-lenis-prevent
      className="flex h-full flex-col justify-center"
      onPointerDown={(e) => e.stopPropagation()}
      // Mesmo fora do trilho (ex. sobre a legenda/paginação embaixo), a roda
      // do mouse aqui dentro nunca deve mexer no portal.
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="relative shrink-0" style={{ height: TRACK_H }}>
        <button
          type="button"
          aria-label="Case anterior"
          onClick={() => goTo(Math.max(0, active - 1))}
          disabled={active === 0}
          className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-opacity hover:bg-black/75 disabled:pointer-events-none disabled:opacity-0 sm:left-6"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          type="button"
          aria-label="Próximo case"
          onClick={() => goTo(Math.min(filtered.length - 1, active + 1))}
          disabled={active === filtered.length - 1}
          className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-opacity hover:bg-black/75 disabled:pointer-events-none disabled:opacity-0 sm:right-6"
        >
          <ArrowRight size={20} />
        </button>

        <div
          ref={trackRef}
          tabIndex={0}
          role="listbox"
          aria-label="Cases"
          onScroll={() => window.requestAnimationFrame(updateActive)}
          onWheel={onWheel}
          onKeyDown={onKeyDown}
          className="flex h-full items-center gap-8 overflow-x-auto outline-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            scrollSnapType: "x mandatory",
            paddingInline: `calc(50% - ${SHELL / 2}px)`,
          }}
        >
          {filtered.map(({ c, i }, idx) => {
            const dist = Math.abs(idx - active);
            const isActive = dist === 0;
            const scale = isActive
              ? ACTIVE_SCALE
              : Math.max(0.46, 1 - dist * 0.17);
            const bright = isActive ? 1 : Math.max(0.3, 1 - dist * 0.16);
            const blurPx = isActive ? 0 : Math.min(5, dist * 1.3);
            return (
              <div
                key={c.id}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                role="option"
                aria-selected={isActive}
                style={{
                  scrollSnapAlign: "center",
                  width: SHELL,
                  height: SHELL * 0.75,
                }}
                className="relative shrink-0"
              >
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => {
                    if (isActive) router.push(`/cases/${c.slug}`);
                    else goTo(idx);
                  }}
                  aria-label={
                    isActive
                      ? `Ver a página completa do case ${c.titulo}`
                      : `Ver o case ${c.titulo}`
                  }
                  className="absolute inset-0 block overflow-hidden rounded-2xl bg-[#1a1a1a] shadow-[0_24px_60px_-18px_rgba(0,0,0,0.8)] ring-1 ring-white/10 outline-none transition-[filter,opacity] duration-300 focus-visible:ring-2 focus-visible:ring-[#66fcf1]"
                  style={{
                    transform: `scale(${scale})`,
                    filter: `brightness(${bright}) blur(${blurPx}px)`,
                    opacity: dist > 5 ? 0 : 1,
                    zIndex: 100 - dist,
                    // Card em destaque usa o mesmo fundo colorido + imagem
                    // "contida" (sem recortar) da visão em destaque do modo
                    // Orbital — só os vizinhos pequenos da fita continuam
                    // recortados (cover), que é o que faz sentido numa
                    // miniatura.
                    backgroundColor: isActive
                      ? getCaseBgColor(c.slug, i)
                      : undefined,
                  }}
                >
                  {isActive && activeImages.length > 0 ? (
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={activeImages[safeSlide]}
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Image
                          src={activeImages[safeSlide]}
                          alt=""
                          fill
                          className="pointer-events-none object-contain"
                          sizes="450px"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>
                  ) : isActive && c.capa_url ? (
                    <Image
                      src={c.capa_url}
                      alt=""
                      fill
                      className="pointer-events-none object-contain"
                      sizes="450px"
                    />
                  ) : !isActive && c.capa_url ? (
                    <Image
                      src={c.capa_url}
                      alt=""
                      fill
                      className="pointer-events-none object-cover"
                      sizes="450px"
                    />
                  ) : (
                    <div
                      className="grid h-full place-items-center px-4 text-center text-sm font-black text-white"
                      style={{
                        backgroundColor: isActive
                          ? undefined
                          : getCaseBgColor(c.slug, i),
                      }}
                    >
                      {c.titulo}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legenda do case em destaque + paginação — mesmo alinhamento à
          esquerda e espaçamento compacto da visão em destaque do Orbital
          (`CaseViewer`), com a MESMA largura do card (sem padding lateral
          próprio) pra ficar com as bordas alinhadas com ele. */}
      <div
        className="mx-auto w-full pb-8 pt-3"
        style={{ maxWidth: `min(${CARD_W}px, 100%)` }}
      >
        {/* Barra de tempo da galeria de imagens do card em destaque. */}
        {activeImages.length > 1 && (
          <div
            className="mb-4 h-[3px] w-full overflow-hidden rounded-full bg-white/15"
            aria-hidden
          >
            <motion.div
              key={`${activeCase?.id}-${slide}`}
              className="h-full origin-left rounded-full bg-[#66fcf1]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
              onAnimationComplete={nextSlide}
            />
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCase?.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            {activeCase?.cliente && (
              <p className="text-xs font-bold uppercase tracking-widest text-[#66fcf1]">
                {activeCase.cliente}
              </p>
            )}
            <h2 className="mt-1 text-xl font-black leading-tight text-white">
              {activeCase?.titulo}
            </h2>
            {activeCase?.resumo && (
              <p className="mt-1.5 text-sm text-white/60">
                {activeCase.resumo}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
        <p className="mt-4 text-xs font-bold tabular-nums text-white/35">
          {filtered.length > 0 ? active + 1 : 0} / {filtered.length}
        </p>
      </div>
    </div>
  );
}

export function CasesOrbitHero({ cases }: { cases: Case[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const cursorRef = useRef<HTMLDivElement>(null);

  const [hover, setHover] = useState<number | null>(null);
  const [hinted, setHinted] = useState(true); // dica "arraste" some após a 1ª interação
  const [dragging, setDragging] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [revealed, setRevealed] = useState(false); // globo já aparece o bastante pra receber cliques
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // --- Máscara circular do vídeo, ligada à "rolagem virtual" ----------------
  // `virt` é o alvo (0..1) movido pela roda/teclado; `virtSm` é a versão
  // suavizada por mola, que é o que de fato anima a máscara.
  const virt = useMotionValue(0);
  const virtSm = useSpring(virt, { stiffness: 90, damping: 26, mass: 0.6 });
  const maskT = useTransform(virtSm, (v) => easeInOut(clamp01(v)));
  // Geometria do portal. Começa cobrindo tudo, centrado; termina como uma
  // janelinha circular no canto inferior esquerdo — o círculo NÃO fecha. Lá
  // dentro o vídeo fica enquadrado no puppet digitando no iMac, como se ele
  // estivesse vendo os cases flutuando na tela dele.
  //   - (cx, cy, r): círculo do recorte, em px do palco;
  //   - (x, y, s): transformação do vídeo pra levar o "ponto de interesse"
  //     (puppet + iMac) até o centro do círculo, reduzindo o vídeo o
  //     suficiente pra caber lá dentro.
  const videoElRef = useRef<HTMLVideoElement>(null);
  const videoRatioRef = useRef(16 / 9); // proporção real do vídeo (lida no metadata)
  const geo = useTransform(maskT, (m) => {
    // Portal totalmente aberto (estado inicial, e o que o servidor renderiza):
    // valores fixos, independentes do tamanho da janela — senão o HTML do
    // servidor e o do navegador divergem na hidratação.
    if (m <= 0) return { m: 0, cx: 0, cy: 0, r: 0, s: 1, x: 0, y: 0 };
    const st = stageRef.current;
    const W =
      st?.clientWidth ??
      (typeof window === "undefined" ? 1440 : window.innerWidth);
    const H =
      st?.clientHeight ??
      (typeof window === "undefined" ? 900 : window.innerHeight);
    return portalGeometry(m, W, H, videoRatioRef.current);
  });
  const clipPath = useTransform(geo, (g) =>
    // Sem scroll (ou no servidor) devolve sempre a MESMA string, pra o HTML do
    // servidor e o primeiro render do cliente baterem na hidratação.
    g.m <= 0
      ? "circle(150% at 50% 50%)"
      : `circle(${g.r}px at ${g.cx}px ${g.cy}px)`,
  );
  const vidX = useTransform(geo, (g) => g.x);
  const vidY = useTransform(geo, (g) => g.y);
  const vidScale = useTransform(geo, (g) => g.s);
  // Aro e botão da janelinha (aparecem quando ela já está pequena).
  const ringX = useTransform(geo, (g) => g.cx - g.r);
  const ringY = useTransform(geo, (g) => g.cy - g.r);
  const ringSize = useTransform(geo, (g) => g.r * 2);
  const ringOpacity = useTransform(maskT, [0.85, 1], [0, 1]);
  const [docked, setDocked] = useState(false);
  useMotionValueEvent(maskT, "change", (m) => setDocked(m > 0.97));

  // --- Fala do puppet ---------------------------------------------------------
  // Balão ao lado da janelinha. Fala quando o visitante escolhe uma categoria,
  // troca o modo, abre um case (frase do case, sorteada em rodízio) e uma vez
  // ao "estacionar". Só fala com a janelinha visível (`docked`).
  const [msg, setMsg] = useState<{ id: number; text: string } | null>(null);
  const msgTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const msgId = useRef(0);
  const lineCursor = useRef<Record<string, number>>({});
  const dockedRef = useRef(false);
  useEffect(() => {
    dockedRef.current = docked;
  }, [docked]);
  useEffect(
    () => () => {
      if (msgTimer.current) clearTimeout(msgTimer.current);
    },
    [],
  );
  const say = useCallback((text: string) => {
    if (!dockedRef.current) return;
    msgId.current += 1;
    setMsg({ id: msgId.current, text });
    puppetTalk();
    if (msgTimer.current) clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMsg(null), 4800);
  }, []);
  const sayCase = useCallback(
    (c: Case) => {
      const pool = c.frases_puppet?.length
        ? c.frases_puppet
        : GENERIC_CASE_LINES;
      const cur =
        lineCursor.current[c.id] ?? Math.floor(Math.random() * pool.length);
      lineCursor.current[c.id] = (cur + 1) % pool.length;
      say(pool[cur % pool.length]);
    },
    [say],
  );

  const greeted = useRef(false);
  useEffect(() => {
    if (!docked || greeted.current) return;
    greeted.current = true;
    const t = setTimeout(() => say("Oi! Escolhe um case aí."), 600);
    return () => clearTimeout(t);
  }, [docked, say]);

  // Posição do balão (fixed) e medidas do palco: o balão nasce DENTRO da
  // janelinha (invade o topo do círculo e vaza pra fora), pra parecer que a
  // fala sai do puppet.
  const [dockPos, setDockPos] = useState({ left: 220, bottom: 320 });
  const [stageBox, setStageBox] = useState({ w: 0, h: 0, footerH: 0 });
  useEffect(() => {
    const st = stageRef.current;
    const footer = document.querySelector("footer");
    if (!st) return;
    const update = () => {
      const fh = footer?.getBoundingClientRect().height ?? 0;
      const { r1, c1x, c1y } = dockFor(st.clientWidth, st.clientHeight);
      setStageBox({ w: st.clientWidth, h: st.clientHeight, footerH: fh });
      setDockPos({
        left: c1x - r1 * 0.15,
        bottom: fh + (st.clientHeight - c1y) + r1 * 0.55,
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(st);
    return () => ro.disconnect();
  }, []);
  // Bolinha central "Arraste para orbitar": nasce quando o círculo quase fechou.
  const bubbleBase = useTransform(maskT, [0.72, 0.95], [0, 1]);
  // 1 = dica visível; vira 0 na 1ª interação (motion value, e não um
  // ternário no style, pra o framer não trocar de "valor animado" para
  // "número fixo" no meio do caminho).
  const hintMV = useMotionValue(1);
  const bubbleOpacity = useTransform(
    [bubbleBase, hintMV],
    ([a, b]: number[]) => a * b,
  );
  const bubbleScale = useTransform(maskT, [0.72, 1], [0.6, 1]);
  // Dica de rolagem no vídeo, some assim que a máscara começa a fechar.
  const scrollHintOpacity = useTransform(virtSm, [0, 0.05], [1, 0]);

  useMotionValueEvent(maskT, "change", (m) => setRevealed(m > 0.6));

  // Avisa o menu (Nav) quando o portal começou a abrir, pra ele trocar pro
  // estilo escuro — e limpa o aviso ao sair da página.
  const pastRef = useRef(false);
  useMotionValueEvent(virtSm, "change", (v) => {
    const past = v > NAV_SWITCH;
    if (past === pastRef.current) return;
    pastRef.current = past;
    document.documentElement.dataset.heroPast = past ? "1" : "0";
    window.dispatchEvent(new CustomEvent("hero:past", { detail: past }));
  });
  useEffect(
    () => () => {
      delete document.documentElement.dataset.heroPast;
    },
    [],
  );

  // Altura do rodapé: o palco ocupa a tela MENOS o rodapé, e assim página +
  // rodapé cabem em 100% da altura, sem barra de rolagem.
  const [footerH, setFooterH] = useState(0);
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const update = () => setFooterH(footer.getBoundingClientRect().height);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(footer);
    return () => ro.disconnect();
  }, []);

  // Desktop: trava a rolagem do documento (a página já cabe na tela) e usa a
  // roda do mouse / teclado como rolagem virtual. No mobile a página é uma
  // lista normal, que rola como sempre.
  const openRef = useRef(false);
  useEffect(() => {
    openRef.current = openIndex !== null;
  }, [openIndex]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const root = document.documentElement;
    const apply = () => {
      if (mq.matches) root.style.overflow = "hidden";
      else root.style.removeProperty("overflow");
    };
    apply();
    mq.addEventListener("change", apply);

    const goTo = (target: number) =>
      animate(virt, target, { duration: 1.1, ease: [0.65, 0, 0.35, 1] });

    const onWheel = (e: WheelEvent) => {
      if (!mq.matches || openRef.current) return;
      // Dentro do menu de categorias a roda não anda o portal.
      const target = e.target as HTMLElement | null;
      if (target?.closest?.("[role='listbox']")) return;
      // No modo lista, a roda sobre a lista rola a própria lista; só quando
      // ela já está no topo/fim é que a roda volta a mover o portal.
      const list = target?.closest?.(
        "[data-list-scroll]",
      ) as HTMLElement | null;
      if (list) {
        const canDown =
          list.scrollTop + list.clientHeight < list.scrollHeight - 1;
        const canUp = list.scrollTop > 0;
        if ((e.deltaY > 0 && canDown) || (e.deltaY < 0 && canUp)) return;
      }
      e.preventDefault();
      virt.set(clamp01(virt.get() + e.deltaY / WHEEL_RANGE_PX));
    };
    const onKey = (e: KeyboardEvent) => {
      if (!mq.matches || openRef.current) return;
      const el = e.target as HTMLElement | null;
      if (el?.closest?.("button, a, input, select, textarea, [role='option']"))
        return;
      if (["ArrowDown", "PageDown", "End", " "].includes(e.key)) {
        e.preventDefault();
        goTo(1);
      } else if (["ArrowUp", "PageUp", "Home"].includes(e.key)) {
        e.preventDefault();
        goTo(0);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", apply);
      // Sempre remove (em vez de "restaurar" o que estava): não deixa um
      // `hidden` velho preso ao sair da página.
      root.style.removeProperty("overflow");
    };
  }, [virt]);

  // A dica some (com fade) assim que o visitante interage com o globo.
  useEffect(() => {
    if (!hinted) animate(hintMV, 0, { duration: 0.5 });
  }, [hinted, hintMV]);

  // --- Estado do globo (fora do React: muda a cada frame) -------------------
  const s = useRef({
    yaw: 0.35,
    pitch: -0.12,
    vYaw: 0,
    vPitch: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    moved: 0,
    pressed: false, // botão apertado, mas ainda não virou arrasto
    interacted: false,
    orbitT: 0, // relógio (s) das órbitas individuais
    lastInteraction: 0,
    cursorX: 0,
    cursorY: 0,
    cursorTX: 0,
    cursorTY: 0,
    cursorSeen: false,
    hovering: false,
    paused: false, // visão em destaque aberta: globo parado
  });

  // Estado físico de cada card (mutado a cada quadro, fora do React).
  const bodies = useMemo(
    () => cardBodies(cases.length, 0.35, -0.12),
    [cases.length],
  );

  // --- Filtro por categoria --------------------------------------------------
  // Todos os cards ficam montados; o filtro só muda a "presença" de cada um
  // (fade) e redistribui os que ficam pela esfera.
  // Modo de exibição (lembrado entre visitas). Desktop: orbital ou lista.
  const [mode, setMode] = useState<ViewMode>("orbital");
  const modeRef = useRef<ViewMode>("orbital");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cases-view");
      if (saved === "orbital" || saved === "lista") setMode(saved);
    } catch {}
  }, []);
  // Grava só quando o visitante troca o modo (não num efeito sobre `mode`):
  // com o efeito, o valor inicial "orbital" era gravado antes de o salvo ser
  // lido de novo (React Strict Mode em dev roda os efeitos duas vezes) e a
  // preferência se perdia.
  const changeMode = useCallback((m: ViewMode) => {
    setMode(m);
    try {
      localStorage.setItem("cases-view", m);
    } catch {}
  }, []);
  useEffect(() => {
    modeRef.current = mode;
    setHover(null);
    s.current.hovering = false;
  }, [mode]);

  const [category, setCategory] = useState(ALL);

  // O puppet comenta a escolha de categoria e a troca de modo (não no
  // carregamento inicial: `say` só fala com a janelinha visível).
  const prevCategory = useRef(ALL);
  useEffect(() => {
    if (prevCategory.current === category) return;
    prevCategory.current = category;
    say(
      category === ALL
        ? "Todos os meus cases, sem filtro!"
        : `Aqui estão meus cases de ${category}!`,
    );
  }, [category, say]);
  const prevMode = useRef<ViewMode>("orbital");
  useEffect(() => {
    if (prevMode.current === mode) return;
    prevMode.current = mode;
    say(
      mode === "lista" ? "Modo galeria, um de cada vez!" : "De volta à órbita!",
    );
  }, [mode, say]);
  const categoryOptions = useMemo(() => {
    const present = CATEGORY_ORDER.filter((cat) =>
      cases.some((c) => c.categorias.includes(cat)),
    );
    return [
      { value: ALL, label: "Todos os cases", count: cases.length },
      ...present.map((cat) => ({
        value: cat,
        label: cat,
        count: cases.filter((c) => c.categorias.includes(cat)).length,
      })),
    ];
  }, [cases]);

  const pointsTarget = useRef<Vec[]>(spherePoints(cases.length));
  const pointsCur = useRef<Vec[]>(pointsTarget.current.map((p) => ({ ...p })));
  const presence = useRef<number[]>(cases.map(() => 1));
  const matchRef = useRef<boolean[]>(cases.map(() => true));
  // Posição/profundidade "de órbita" de cada card (sem o desvio de
  // sobreposição), recalculadas a cada quadro — servem de entrada pra
  // resolução de colisão, que roda numa segunda passada depois de todas
  // estarem prontas.
  const baseX = useRef<number[]>(cases.map(() => 0));
  const baseY = useRef<number[]>(cases.map(() => 0));
  const baseT = useRef<number[]>(cases.map(() => 0));
  const baseScale = useRef<number[]>(cases.map(() => 0));
  const corrX = useRef<number[]>(cases.map(() => 0));
  const corrY = useRef<number[]>(cases.map(() => 0));
  // Cópia de trabalho do desvio, usada pra relaxar contra VÁRIOS vizinhos
  // dentro do mesmo quadro (ver Passo 2 abaixo).
  const workX = useRef<number[]>(cases.map(() => 0));
  const workY = useRef<number[]>(cases.map(() => 0));

  useEffect(() => {
    const idx = cases.flatMap((c, i) =>
      category === ALL || c.categorias.includes(category) ? [i] : [],
    );
    matchRef.current = cases.map((_, i) => idx.includes(i));
    const pts = spherePoints(idx.length);
    idx.forEach((cardIndex, k) => {
      pointsTarget.current[cardIndex] = pts[k];
    });
    setHover(null);
    s.current.hovering = false;
  }, [category, cases]);

  useEffect(() => {
    s.current.paused = openIndex !== null;
  }, [openIndex]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let raf = 0;
    let last = performance.now();
    s.current.lastInteraction = last;

    // Pré-aquecimento: resolve a sobreposição ANTES do primeiro quadro
    // visível, pro globo já nascer com os cards espaçados (em vez de
    // aparecerem amontoados e só se separarem aos poucos, visivelmente, nos
    // primeiros segundos). Roda a mesma relaxação do passo 2 do loop
    // principal, só que de uma vez, com bem mais iterações — não precisa
    // ser suave aqui, ninguém está vendo ainda.
    {
      const w = stage.clientWidth || 1440;
      const h = stage.clientHeight || 900;
      const cardW0 = Math.max(280, Math.min(520, w * 0.3));
      const rx0 = w * 0.66;
      const ry0 = h * 0.58;
      const n = cases.length;
      const bx: number[] = new Array(n).fill(0);
      const by: number[] = new Array(n).fill(0);
      const bt: number[] = new Array(n).fill(0);
      const bs: number[] = new Array(n).fill(0);
      const wx: number[] = new Array(n).fill(0);
      const wy: number[] = new Array(n).fill(0);
      const cx: number[] = new Array(n).fill(0);
      const cy: number[] = new Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        const b = bodies[i];
        const pt = pointsTarget.current[i];
        // orbitT ainda é 0 e a mola do card ainda não rodou: yaw/pitch do
        // card já começam iguais aos do globo (ver `cardBodies`).
        const q = axisRotate(pt, b.axis, b.phase);
        const p = rotate(q, b.yaw, b.pitch);
        const t = clamp01((p.z + 1) / 2);
        const persp = 0.6 + 0.4 * t;
        bt[i] = t;
        bs[i] = (0.62 + 0.38 * t) * b.size;
        bx[i] = p.x * b.radius * rx0 * persp;
        by[i] = p.y * b.radius * ry0 * persp;
      }
      const avoidMax0 = cardW0 * AVOID_MAX_FACTOR;
      for (let iter = 0; iter < 50; iter++) {
        cx.fill(0);
        cy.fill(0);
        for (let i = 0; i < n; i++) {
          const hwi = cardW0 * bs[i] * 0.5 * AVOID_PACK;
          const hhi = hwi * 0.75;
          const exi = bx[i] + wx[i];
          const eyi = by[i] + wy[i];
          for (let j = i + 1; j < n; j++) {
            const hwj = cardW0 * bs[j] * 0.5 * AVOID_PACK;
            const hhj = hwj * 0.75;
            const dx = bx[j] + wx[j] - exi;
            const dy = by[j] + wy[j] - eyi;
            const dist = Math.hypot(dx, dy);
            const nx = dx / (hwi + hwj);
            const ny = dy / (hhi + hhj);
            const ndist = Math.hypot(nx, ny);
            if (ndist >= 1) continue;
            const ang = dist > 0.5 ? 0 : (i * 7 + j * 13) * 0.9;
            const ux = dist > 0.5 ? dx / dist : Math.cos(ang);
            const uy = dist > 0.5 ? dy / dist : Math.sin(ang);
            const overlap =
              dist > 0.5
                ? dist * (1 / Math.max(ndist, 1e-4) - 1)
                : Math.max(hwi + hwj, hhi + hhj) * (1 - ndist);
            const wi = cardWeight(bt[i]);
            const wj = cardWeight(bt[j]);
            cx[i] -= ux * (overlap * (wj / (wi + wj)));
            cy[i] -= uy * (overlap * (wj / (wi + wj)));
            cx[j] += ux * (overlap * (wi / (wi + wj)));
            cy[j] += uy * (overlap * (wi / (wi + wj)));
          }
        }
        for (let i = 0; i < n; i++) {
          wx[i] = clamp(wx[i] + cx[i] * 0.85, -avoidMax0, avoidMax0);
          wy[i] = clamp(wy[i] + cy[i] * 0.85, -avoidMax0, avoidMax0);
        }
      }
      for (let i = 0; i < n; i++) {
        bodies[i].avoidX = wx[i];
        bodies[i].avoidY = wy[i];
      }
    }

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const st = s.current;

      // O arrasto do visitante move uma rotação "global" (com inércia); cada
      // card a persegue com a sua própria mola (ver `cardBodies`).
      if (!st.dragging && !st.paused) {
        st.yaw += st.vYaw * dt * 60;
        st.pitch += st.vPitch * dt * 60;
        const decay = Math.pow(0.95, dt * 60);
        st.vYaw *= decay;
        st.vPitch *= decay;
      }
      // Relógio das órbitas próprias: quase para com o mouse sobre um card
      // (fica fácil de clicar) e para com a visão em destaque aberta.
      const clockSpeed = st.paused || reduceMotion ? 0 : st.hovering ? 0.12 : 1;
      st.orbitT += dt * clockSpeed;
      // Globo maior que a tela: os cards sangram pra fora das bordas, o que
      // abre espaço entre eles e permite cards grandes.
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      const cardW = Math.max(280, Math.min(520, w * 0.3));
      const rx = w * 0.66;
      const ry = h * 0.58;

      // A grade de fundo desliza junto com a rotação (profundidade).
      if (gridRef.current) {
        gridRef.current.style.backgroundPosition = `${-st.yaw * 70}px ${st.pitch * 70}px`;
      }

      // Presença (0..1) de cada card sempre roda (é barata, O(n)) — é o que
      // faz o globo sumir com fade ao trocar pro modo Galeria. O resto do
      // cálculo de posição (física da órbita + resolução de sobreposição,
      // bem mais caro) só roda de verdade no modo Orbital: sem esse corte,
      // os cards continuavam sendo recalculados em segundo plano mesmo
      // escondidos, competindo pela thread principal com a rolagem/encaixe
      // suave da galeria — dava pra ver o item "ativo" do carrossel derivar
      // sozinho por causa disso.
      const orbitalActive = modeRef.current === "orbital";
      for (let i = 0; i < cases.length; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const targetPresence = matchRef.current[i] && orbitalActive ? 1 : 0;
        presence.current[i] +=
          (targetPresence - presence.current[i]) * (1 - Math.exp(-dt * 6));
        const pr = presence.current[i];
        if (pr < 0.01) {
          el.style.visibility = "hidden";
          el.style.pointerEvents = "none";
        } else {
          el.style.visibility = "visible";
          // Cada card recebe seu próprio `pointer-events` aqui (não dá pra
          // confiar só no `pointer-events-none` do palco pai: um filho com
          // `auto` sempre vence o `none` do ancestral). Por isso o card só
          // fica clicável depois que a janelinha do puppet estacionou no
          // canto (`dockedRef`) — sem isso, um clique durante a animação do
          // portal podia cair sobre um card e abrir o case sem querer.
          el.style.pointerEvents =
            pr > 0.5 && dockedRef.current ? "auto" : "none";
        }
      }

      if (orbitalActive) {
        for (let i = 0; i < cases.length; i++) {
          const el = cardRefs.current[i];
          const b = bodies[i];
          const pr = presence.current[i];
          if (!el || !b || pr < 0.01) continue;

          // Ponto na esfera: acompanha suavemente o novo ponto quando o filtro
          // redistribui os cards (senão os que ficam "teletransportariam").
          const cp = pointsCur.current[i];
          const tp = pointsTarget.current[i];
          const kp = 1 - Math.exp(-dt * 3.5);
          cp.x += (tp.x - cp.x) * kp;
          cp.y += (tp.y - cp.y) * kp;
          cp.z += (tp.z - cp.z) * kp;
          const len = Math.hypot(cp.x, cp.y, cp.z) || 1;
          const pt = { x: cp.x / len, y: cp.y / len, z: cp.z / len };

          // Mola do card atrás da rotação global (2 subpassos: estável mesmo
          // com quadros longos).
          const hStep = dt / 2;
          for (let sub = 0; sub < 2; sub++) {
            b.vy += (b.k * (st.yaw - b.yaw) - b.c * b.vy) * hStep;
            b.yaw += b.vy * hStep;
            b.vp += (b.k * (st.pitch - b.pitch) - b.c * b.vp) * hStep;
            b.pitch += b.vp * hStep;
          }

          // Órbita própria + rotação global (com atraso) + flutuação própria.
          const q = axisRotate(pt, b.axis, b.phase + b.omega * st.orbitT);
          const p = rotate(q, b.yaw, b.pitch);
          const wx = Math.sin(st.orbitT * b.wf1 + b.wp1) * 0.05;
          const wy = Math.sin(st.orbitT * b.wf2 + b.wp2) * 0.05;

          const t = clamp01((p.z + 1) / 2); // 0 = atrás, 1 = frente
          const persp = 0.6 + 0.4 * t; // aproxima do centro quem está longe
          // Variação de tamanho por profundidade mais contida (0.62–1.0, era
          // 0.45–1.0): na referência os cards da frente não crescem tanto —
          // isso por si só reduz bastante a área que dois cards grandes podem
          // ocupar em comum quando se cruzam.
          const scale = (0.62 + 0.38 * t) * b.size * (0.75 + 0.25 * pr);
          el.style.width = `${cardW}px`;
          baseX.current[i] = (p.x * b.radius + wx) * rx * persp;
          baseY.current[i] = (p.y * b.radius + wy) * ry * persp;
          baseT.current[i] = t;
          baseScale.current[i] = scale;
          // Profundidade = desfoque + ESCURECIMENTO (como na referência): os
          // cards de trás continuam opacos — um cobre o outro — só ficam
          // escuros e borrados. A opacidade só entra na transição do filtro
          // de categorias (`pr`).
          const dim = 0.2 + 0.8 * Math.pow(t, 0.85);
          el.style.opacity = String(pr);
          el.style.filter = `blur(${(Math.pow(1 - t, 1.3) * 10).toFixed(2)}px) brightness(${dim.toFixed(3)})`;
          el.style.zIndex = String(Math.round(t * 100));
        }

        // Passo 2: resolução de sobreposição em tela, relaxada em algumas
        // iterações DENTRO do mesmo quadro (não só 1 passada). Com só 1
        // passada, resolver a sobreposição contra um vizinho podia empurrar o
        // card direto pra cima de um TERCEIRO (efeito toca-toca) — comum
        // quando 3+ cards grandes se cruzam perto do centro. Card em primeiro
        // plano (t alto) "pesa" mais e cede menos; o de trás é quem desvia na
        // maior parte.
        const avoidMax = cardW * AVOID_MAX_FACTOR;
        const decay = Math.pow(0.985, dt * 60);
        for (let i = 0; i < cases.length; i++) {
          // Parte de onde o card já estava (decaindo um pouco a cada quadro,
          // pra voltar sozinho à órbita normal quando ninguém mais sobrepõe).
          workX.current[i] = bodies[i].avoidX * decay;
          workY.current[i] = bodies[i].avoidY * decay;
        }
        const RELAX_ITERS = 3;
        for (let iter = 0; iter < RELAX_ITERS; iter++) {
          corrX.current.fill(0);
          corrY.current.fill(0);
          for (let i = 0; i < cases.length; i++) {
            if (!cardRefs.current[i] || presence.current[i] < 0.01) continue;
            // Metade-largura/altura reais do card (aspect 4/3) — usadas como
            // uma ELIPSE (não um círculo): um círculo baseado só na altura
            // deixava muita margem sobrando nas laterais, já que o card é bem
            // mais largo que alto.
            const hwi = cardW * baseScale.current[i] * 0.5 * AVOID_PACK;
            const hhi = hwi * 0.75;
            const exi = baseX.current[i] + workX.current[i];
            const eyi = baseY.current[i] + workY.current[i];
            for (let j = i + 1; j < cases.length; j++) {
              if (!cardRefs.current[j] || presence.current[j] < 0.01) continue;
              const hwj = cardW * baseScale.current[j] * 0.5 * AVOID_PACK;
              const hhj = hwj * 0.75;
              const exj = baseX.current[j] + workX.current[j];
              const eyj = baseY.current[j] + workY.current[j];
              const dx = exj - exi;
              const dy = eyj - eyi;
              const dist = Math.hypot(dx, dy);
              // Distância normalizada pela elipse combinada: <1 = sobrepondo.
              const nx = dx / (hwi + hwj);
              const ny = dy / (hhi + hhj);
              const ndist = Math.hypot(nx, ny);
              if (ndist >= 1) continue;
              // Concêntricos (dist~0): direção determinística (não aleatória),
              // pra não tremer entre quadros.
              const ang = dist > 0.5 ? 0 : (i * 7 + j * 13) * 0.9;
              const ux = dist > 0.5 ? dx / dist : Math.cos(ang);
              const uy = dist > 0.5 ? dy / dist : Math.sin(ang);
              // Quanto empurrar ao longo de (dx,dy) pra normalizar a
              // distância elíptica até 1 (fronteira das elipses).
              const overlap =
                dist > 0.5
                  ? dist * (1 / Math.max(ndist, 1e-4) - 1)
                  : Math.max(hwi + hwj, hhi + hhj) * (1 - ndist);
              const wi = cardWeight(baseT.current[i]);
              const wj = cardWeight(baseT.current[j]);
              const moveI = overlap * (wj / (wi + wj));
              const moveJ = overlap * (wi / (wi + wj));
              corrX.current[i] -= ux * moveI;
              corrY.current[i] -= uy * moveI;
              corrX.current[j] += ux * moveJ;
              corrY.current[j] += uy * moveJ;
            }
          }
          // Só uma fração da correção por iteração (não o valor cheio): evita
          // que a relaxação "atire longe demais" quando há vários vizinhos
          // empurrando o mesmo card em direções diferentes.
          for (let i = 0; i < cases.length; i++) {
            if (presence.current[i] < 0.01) continue;
            workX.current[i] = clamp(
              workX.current[i] + corrX.current[i] * 0.6,
              -avoidMax,
              avoidMax,
            );
            workY.current[i] = clamp(
              workY.current[i] + corrY.current[i] * 0.6,
              -avoidMax,
              avoidMax,
            );
          }
        }

        // Passo 3: suaviza a transição até o desvio relaxado (evita que ele
        // "salte" de um quadro pro outro) e escreve a posição final.
        const followUp = 1 - Math.exp(-dt * 14);
        for (let i = 0; i < cases.length; i++) {
          const el = cardRefs.current[i];
          const b = bodies[i];
          if (!el || !b || presence.current[i] < 0.01) continue;
          b.avoidX += (workX.current[i] - b.avoidX) * followUp;
          b.avoidY += (workY.current[i] - b.avoidY) * followUp;
          el.style.transform = `translate3d(${baseX.current[i] + b.avoidX}px, ${baseY.current[i] + b.avoidY}px, 0) translate(-50%, -50%) scale(${baseScale.current[i]})`;
        }
      }

      // Cursor (bolinha) seguindo o mouse com suavização.
      const cur = cursorRef.current;
      if (cur) {
        const kc = 1 - Math.exp(-dt * 16);
        st.cursorX += (st.cursorTX - st.cursorX) * kc;
        st.cursorY += (st.cursorTY - st.cursorY) * kc;
        cur.style.transform = `translate3d(${st.cursorX}px, ${st.cursorY}px, 0) translate(-50%, -50%)`;
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [cases, bodies]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (modeRef.current !== "orbital") return; // modo lista: sem arrasto do globo
    const st = s.current;
    // Ainda NÃO captura o ponteiro nem vira arrasto: com captura, o
    // navegador redireciona o `click` pro palco e o clique num card
    // deixaria de chegar nele. A captura só começa depois de mover de fato.
    st.pressed = true;
    st.lastX = e.clientX;
    st.lastY = e.clientY;
    st.moved = 0;
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const st = s.current;
    const r = e.currentTarget.getBoundingClientRect();
    st.cursorTX = e.clientX - r.left;
    st.cursorTY = e.clientY - r.top;
    if (!st.cursorSeen) {
      st.cursorSeen = true;
      st.cursorX = st.cursorTX;
      st.cursorY = st.cursorTY;
    }
    if (!st.pressed) return;
    const dx = e.clientX - st.lastX;
    const dy = e.clientY - st.lastY;
    st.lastX = e.clientX;
    st.lastY = e.clientY;
    st.moved += Math.abs(dx) + Math.abs(dy);
    if (!st.dragging) {
      if (st.moved <= CLICK_MOVE_TOLERANCE) return;
      // Virou arrasto.
      st.dragging = true;
      st.vYaw = 0;
      st.vPitch = 0;
      st.interacted = true;
      setDragging(true);
      setHinted(false);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    // Sem limite de rotação vertical: com o globo de cabeça pra baixo
    // (cos(pitch) < 0) o arrasto horizontal inverte de sentido, então o
    // `flip` desfaz isso e o movimento continua acompanhando a mão.
    const flip = Math.cos(st.pitch) < 0 ? -1 : 1;
    st.yaw += dx * flip * DRAG_SENSITIVITY;
    st.pitch -= dy * DRAG_SENSITIVITY;
    // Velocidade (suavizada) pra inércia ao soltar.
    st.vYaw = st.vYaw * 0.6 + dx * flip * DRAG_SENSITIVITY * 0.4;
    st.vPitch = st.vPitch * 0.6 - dy * DRAG_SENSITIVITY * 0.4;
    st.lastInteraction = performance.now();
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const st = s.current;
    st.pressed = false;
    if (st.dragging) {
      st.dragging = false;
      st.lastInteraction = performance.now();
      setDragging(false);
    }
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
  }

  function onCardClick(e: React.MouseEvent, i: number) {
    // Ctrl/Cmd/botão do meio: deixa o navegador abrir o case em outra aba.
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    // Foi um arrasto, não um clique: não abre.
    if (s.current.moved > CLICK_MOVE_TOLERANCE) return;
    s.current.interacted = true;
    setHinted(false);
    setOpenIndex(i);
    sayCase(cases[i]);
  }

  const cursorLabel = hover !== null && !dragging ? "Ver" : null;
  const openCase = openIndex !== null ? cases[openIndex] : null;

  return (
    <>
      {/* ---------------- Desktop: portal + globo ---------------- */}
      <div className="relative hidden lg:block">
        <div
          className="relative w-full overflow-hidden bg-[#0d0d0d]"
          style={{
            // Sobe por trás do menu (--nav-h) e termina onde começa o rodapé.
            marginTop: "calc(-1 * var(--nav-h, 0px))",
            height: `calc(100dvh - ${footerH}px)`,
          }}
        >
          <h1 className="sr-only">Cases</h1>

          {/* Camada 2 (embaixo): fundo preto + globo. */}
          <div
            ref={stageRef}
            className={`absolute inset-0 touch-pan-y select-none ${mode !== "orbital" ? "" : dragging ? "cursor-grabbing" : "cursor-grab"} ${
              revealed ? "" : "pointer-events-none"
            }`}
            // Contexto de empilhamento próprio: os z-index dos cards (até 100)
            // ficam contidos aqui e o vídeo (irmão seguinte) cobre o globo.
            style={{
              paddingTop: "var(--nav-h, 0px)",
              isolation: "isolate",
              zIndex: 0,
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerEnter={(e) => {
              s.current.hovering = false;
              if (e.pointerType === "mouse") setCursorVisible(true);
            }}
            onPointerLeave={() => setCursorVisible(false)}
          >
            {/* Grade de fundo: linhas finas que somem nas bordas (máscara
                radial) e deslizam com a rotação do globo. */}
            <div
              ref={gridRef}
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)",
                backgroundSize: "72px 72px",
                maskImage:
                  "radial-gradient(ellipse 70% 65% at 50% 50%, black 25%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 70% 65% at 50% 50%, black 25%, transparent 100%)",
              }}
            />

            <div className="relative h-full w-full">
              {/* Origem dos cards: o centro do palco. */}
              <div className="absolute left-1/2 top-1/2">
                {cases.map((c, i) => (
                  <Link
                    key={c.id}
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    href={`/cases/${c.slug}`}
                    draggable={false}
                    tabIndex={docked ? 0 : -1}
                    onClick={(e) => onCardClick(e, i)}
                    onPointerEnter={(e) => {
                      if (e.pointerType === "mouse") {
                        setHover(i);
                        s.current.hovering = true;
                      }
                    }}
                    onPointerLeave={() => {
                      setHover(null);
                      s.current.hovering = false;
                    }}
                    aria-label={`Ver o case ${c.titulo}`}
                    className="absolute left-0 top-0 block aspect-[4/3] overflow-hidden rounded-2xl bg-[#1a1a1a] shadow-[0_24px_70px_-18px_rgba(0,0,0,0.9)] ring-1 ring-white/10 outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-[#66fcf1]"
                    style={{ backgroundColor: getCaseBgColor(c.slug, i) }}
                  >
                    {c.capa_url ? (
                      <Image
                        src={c.capa_url}
                        alt=""
                        fill
                        draggable={false}
                        className="pointer-events-none object-cover"
                        sizes="440px"
                      />
                    ) : (
                      <div className="grid h-full place-items-center px-4 text-center text-base font-black text-white">
                        {c.titulo}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Filtro por categoria (aparece quando o portal abre). Não deixa
                o clique virar arrasto do globo. */}
            <div
              className={`absolute left-8 z-[250] flex items-center gap-3 transition-opacity duration-500 ${
                revealed ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              style={{ top: "calc(var(--nav-h, 0px) + 20px)" }}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerMove={(e) => e.stopPropagation()}
              onPointerEnter={() => setCursorVisible(false)}
            >
              <CategoryMenu
                options={categoryOptions}
                value={category}
                onChange={setCategory}
              />
              <ModeToggle value={mode} onChange={changeMode} />
            </div>

            {/* Galeria/carrossel (a antiga "Lista"): filme horizontal com um
                case em destaque no centro, rolagem interna (a página em si
                não rola) e o mesmo filtro. */}
            <AnimatePresence>
              {mode === "lista" && revealed && (
                <motion.div
                  key="lista"
                  // A galeria aparece com o portal a 60%, mas só captura a
                  // roda/cliques depois de o portal estacionar: antes disso
                  // ela engolia a rolagem virtual (`stopPropagation`) e o
                  // círculo do puppet parava antes do tamanho final.
                  className={`absolute inset-x-0 bottom-0 z-[20] ${
                    docked ? "" : "pointer-events-none"
                  }`}
                  style={{ top: "calc(var(--nav-h, 0px) + 84px)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <GalleryCarousel cases={cases} category={category} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cursor: bolinha que segue o mouse; vira um círculo com "Ver"
                sobre um card. */}
            <div
              ref={cursorRef}
              className="pointer-events-none absolute left-0 top-0 z-[200]"
            >
              <div
                className={`grid place-items-center rounded-full bg-[#058fa1] text-center text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-300 ${
                  !cursorVisible || !revealed || mode !== "orbital"
                    ? "h-3.5 w-3.5 opacity-0"
                    : cursorLabel
                      ? "h-[76px] w-[76px] opacity-100"
                      : "h-3.5 w-3.5 opacity-90"
                } ${dragging ? "scale-75" : "scale-100"}`}
              >
                {cursorLabel}
              </div>
            </div>
          </div>

          {/* Bolinha central (a "gravidade" do globo): é o que sobra do
              círculo quando a máscara fecha. Some depois da 1ª interação. */}
          {mode === "orbital" && (
            <motion.div
              className="pointer-events-none absolute left-1/2 z-[150] grid h-[104px] w-[104px] -translate-x-1/2 place-items-center rounded-full bg-[#058fa1] text-center text-[11px] font-black uppercase leading-tight tracking-wider text-white shadow-2xl"
              style={{
                top: "calc(50% + var(--nav-h, 0px) / 2)",
                marginTop: -52,
                opacity: bubbleOpacity,
                scale: bubbleScale,
              }}
            >
              <span className="px-3">Arraste para orbitar</span>
            </motion.div>
          )}

          {/* Camada 1 (em cima): vídeo recortado pela máscara circular. */}
          <motion.div
            className="pointer-events-none absolute inset-0 bg-white"
            style={{ clipPath, WebkitClipPath: clipPath }}
            // Se a página abre já rolada (posição restaurada pelo navegador), o
            // recorte inicial difere do HTML do servidor por definição.
            suppressHydrationWarning
          >
            {/* Vídeo + multiply andam juntos na transformação que enquadra o
                puppet dentro da janelinha (origem no canto: 0 0). */}
            <motion.div
              className="absolute inset-0"
              style={{
                x: vidX,
                y: vidY,
                scale: vidScale,
                transformOrigin: "0px 0px",
              }}
            >
              {/* "Cover" com o retângulo real do vídeo (largura/altura auto +
                  mínimos de 100%): preserva a proporção e cobre o palco, e o
                  quadro inteiro (inclusive o que passa das bordas) fica
                  disponível pra janelinha. `left: 78%` + translate(-78%)
                  reproduz o `object-position: 78% center` de antes. */}
              <video
                ref={videoElRef}
                data-puppet-video
                src="https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/hero-cases-typing.mp4"
                autoPlay
                muted
                loop
                playsInline
                onLoadedMetadata={(e) => {
                  const v = e.currentTarget;
                  if (v.videoWidth && v.videoHeight)
                    videoRatioRef.current = v.videoWidth / v.videoHeight;
                }}
                className="absolute max-w-none min-h-full min-w-full"
                style={{
                  left: "78%",
                  top: "50%",
                  width: "auto",
                  height: "auto",
                  transform: "translate(-78%, -50%)",
                }}
              />
              {/* Mesmas camadas do hero anterior: multiply pra tirar o branco
                  chapado do vídeo. Bem maior que o vídeo (-inset-[60%]) pra
                  não deixar uma borda cinza aparente dentro da janelinha. */}
              <div
                className="pointer-events-none absolute -inset-[60%] mix-blend-multiply"
                style={{ backgroundColor: "#e8ecef" }}
              />
            </motion.div>
            <div
              className="absolute inset-x-0 top-0 bg-white/55"
              style={{ height: "var(--nav-h, 0px)" }}
            />
            {/* Dica (clicável): leva ao globo com a mesma animação da roda. */}
            <motion.button
              type="button"
              onClick={() =>
                animate(virt, 1, { duration: 1.1, ease: [0.65, 0, 0.35, 1] })
              }
              className="pointer-events-auto absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#058fa1] outline-none focus-visible:ring-2 focus-visible:ring-[#058fa1]"
              style={{ opacity: scrollHintOpacity }}
            >
              Role ou clique para entrar nos cases ↓
            </motion.button>
          </motion.div>

          {/* Aro da janelinha do puppet (canto inferior esquerdo). Depois que
              o portal "estaciona", clicar nela volta ao vídeo em tela cheia. */}
          <motion.button
            type="button"
            aria-label="Voltar ao vídeo"
            tabIndex={docked ? 0 : -1}
            onClick={() =>
              animate(virt, 0, { duration: 1.1, ease: [0.65, 0, 0.35, 1] })
            }
            className="absolute left-0 top-0 z-[240] rounded-full outline-none ring-[3px] ring-[#66fcf1]/80 shadow-[0_0_50px_rgba(102,252,241,0.25)] transition-shadow hover:shadow-[0_0_60px_rgba(102,252,241,0.5)] focus-visible:ring-white"
            style={{
              x: ringX,
              y: ringY,
              width: ringSize,
              height: ringSize,
              opacity: ringOpacity,
              pointerEvents: docked ? "auto" : "none",
            }}
          />
        </div>
      </div>

      {/* Balão de fala do puppet: sai da janelinha do canto inferior esquerdo.
          `fixed` e acima da visão em destaque (z-300), pra ele comentar o
          case enquanto o visitante o vê. */}
      <AnimatePresence>
        {msg && (
          <motion.div
            key={msg.id}
            role="status"
            aria-live="polite"
            className="pointer-events-none fixed z-[320] hidden lg:block"
            style={{
              left: dockPos.left,
              bottom: dockPos.bottom,
              transformOrigin: "0% 100%",
            }}
            initial={{ opacity: 0, scale: 0.55, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 6 }}
            transition={{ type: "spring", stiffness: 340, damping: 20 }}
          >
            <div className="relative max-w-[270px] rounded-2xl bg-white px-4 py-3 text-sm font-bold leading-snug text-[#1a1a1a] shadow-[0_18px_50px_-12px_rgba(0,0,0,0.6)]">
              <Typewriter text={msg.text} />
              {/* Rabinho do balão: triângulo com a ponta pra baixo e pra
                  ESQUERDA, apontando pro puppet (que fica à esquerda). */}
              <span
                aria-hidden
                className="absolute left-4 top-full h-4 w-5 bg-white"
                style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Janelinha do puppet por cima da visão em destaque (senão ele fica
          borrado atrás do fundo escurecido e não dá pra vê-lo falando). */}
      <AnimatePresence>
        {docked && openIndex !== null && stageBox.w > 0 && (
          <PuppetDockCopy
            key="puppet-copy"
            w={stageBox.w}
            h={stageBox.h}
            footerH={stageBox.footerH}
            ratio={videoRatioRef.current}
          />
        )}
      </AnimatePresence>

      {/* Visão em destaque de um case (desktop). */}
      <AnimatePresence>
        {openCase && openIndex !== null && (
          <CaseViewer
            key={openCase.id}
            c={openCase}
            index={openIndex}
            onClose={() => setOpenIndex(null)}
          />
        )}
      </AnimatePresence>

      {/* ---------------- Mobile/tablet: lista simples ---------------- */}
      <div
        className="relative w-full bg-white px-6 pb-16 pt-28 lg:hidden"
        style={{ marginTop: "calc(-1 * var(--nav-h, 0px))" }}
      >
        <h1 className="sr-only">Cases</h1>
        <div className="mx-auto mb-6 flex max-w-2xl items-center gap-3">
          <label
            htmlFor="cases-categoria"
            className="text-[10px] font-bold uppercase tracking-widest text-[#4a4a4a]"
          >
            Categoria
          </label>
          <select
            id="cases-categoria"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-full border border-[#e5e5e7] bg-white px-4 py-2 text-sm font-bold text-[#1a1a1a] shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[#058fa1]"
          >
            {categoryOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label} ({o.count})
              </option>
            ))}
          </select>
        </div>
        <div className="mx-auto grid max-w-2xl gap-5 sm:grid-cols-2">
          {cases
            .map((c, i) => ({ c, i }))
            .filter(
              ({ c }) => category === ALL || c.categorias.includes(category),
            )
            .map(({ c, i }) => (
              <Link
                key={c.id}
                href={`/cases/${c.slug}`}
                className="group block overflow-hidden rounded-2xl border border-[#e5e5e7] bg-white shadow-lg"
              >
                <div
                  className="relative aspect-video overflow-hidden"
                  style={{ backgroundColor: getCaseBgColor(c.slug, i) }}
                >
                  {c.capa_url ? (
                    <Image
                      src={c.capa_url}
                      alt={c.titulo}
                      fill
                      className="object-cover"
                      sizes="(min-width: 640px) 320px, 90vw"
                    />
                  ) : (
                    <div className="grid h-full place-items-center px-4 text-center text-sm font-black text-white">
                      {c.titulo}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  {c.cliente && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#058fa1]">
                      {c.cliente}
                    </p>
                  )}
                  <p className="text-base font-black text-[#1a1a1a]">
                    {c.titulo}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
}
