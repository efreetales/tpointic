"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Refresh } from "@mynaui/icons-react";

const ORANGE = "#F5A742";
const GREEN = "#7cc576";

// Gerador de números repetível: a mesma semente sempre dá a mesma ilha.
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Plat = {
  x: number;
  y: number;
  w: number;
  chain: boolean;
  semente: boolean;
  inimigo: boolean;
};

const W = 1500;
const H = 330;
const CHAO = 292;

// Cada plataforma da "trilha" nasce ligada à anterior por um pulo possível,
// igual ao jogo: o verificador depois só confirma o que já foi desenhado.
function gerar(seed: number) {
  const r = rng(seed);
  const trilha: Plat[] = [];
  let x = 40;
  let y = 250;
  while (x < 1340) {
    const dx = 85 + r() * 70;
    const passos = [-44, -44, 0, 0, 44, 44];
    y = Math.min(
      250,
      Math.max(70, y + passos[Math.floor(r() * passos.length)]),
    );
    const w = 62 + r() * 52;
    x += dx;
    trilha.push({
      x,
      y,
      w,
      chain: true,
      semente: r() < 0.65,
      inimigo: r() < 0.22,
    });
    x += w * 0.35;
  }
  const extras: Plat[] = [];
  for (let i = 0; i < 9; i++) {
    const ex = 80 + r() * 1280;
    const ey = 70 + Math.floor(r() * 5) * 44;
    if (trilha.some((p) => Math.abs(p.x - ex) < 90 && Math.abs(p.y - ey) < 44))
      continue;
    extras.push({
      x: ex,
      y: ey,
      w: 50 + r() * 50,
      chain: false,
      semente: r() < 0.5,
      inimigo: false,
    });
  }
  const buracos = [1, 2, 3, 4].map((s) => s * 300 + 90 + r() * 90);
  return { trilha, extras, buracos };
}

export function GeradorIlha() {
  const [seed, setSeed] = useState(7);
  const [prog, setProg] = useState({ seed: 7, n: 0 });
  const ilha = useMemo(() => gerar(seed), [seed]);
  const total = ilha.trilha.length;
  const progresso = prog.seed === seed ? prog.n : 0;

  useEffect(() => {
    const id = setInterval(() => {
      setProg((p) =>
        p.seed === seed
          ? { seed, n: Math.min(p.n + 1, total + 1) }
          : { seed, n: 1 },
      );
    }, 260);
    return () => clearInterval(id);
  }, [seed, total]);

  const pulos = Math.min(progresso, total);
  const aprovada = progresso > total;
  const todas = [...ilha.extras, ...ilha.trilha];
  const ultima = ilha.trilha[total - 1];

  return (
    <div className="rounded-3xl border border-border bg-surface p-4 sm:p-6">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Uma ilha gerada com 5 segmentos, plataformas, sementes, inimigos e o baú no fim"
          className="h-auto w-full min-w-[640px] rounded-2xl"
          style={{
            background: "linear-gradient(180deg,#bfe3d0 0%,#e8f4df 100%)",
          }}
        >
          {[1, 2, 3, 4].map((s) => (
            <line
              key={s}
              x1={s * 300}
              x2={s * 300}
              y1={30}
              y2={CHAO}
              stroke="#2d3142"
              strokeOpacity="0.25"
              strokeDasharray="4 6"
            />
          ))}
          {[0, 1, 2, 3, 4].map((s) => (
            <text
              key={s}
              x={s * 300 + 12}
              y={22}
              fontSize="14"
              fontWeight="800"
              fill="#2d3142"
              fillOpacity="0.55"
            >
              Segmento {s + 1}
            </text>
          ))}

          {/* chão com buracos */}
          <rect x={0} y={CHAO} width={W} height={H - CHAO} fill="#8a5a3a" />
          <rect x={0} y={CHAO} width={W} height={9} fill={GREEN} />
          {ilha.buracos.map((bx) => (
            <rect
              key={bx}
              x={bx}
              y={CHAO - 2}
              width={46}
              height={H - CHAO + 2}
              fill="#4aa3c7"
            />
          ))}

          {todas.map((p, i) => (
            <g key={i}>
              <rect
                x={p.x}
                y={p.y}
                width={p.w}
                height={14}
                rx={4}
                fill="#8a5a3a"
              />
              <rect
                x={p.x - 2}
                y={p.y - 5}
                width={p.w + 4}
                height={9}
                rx={4}
                fill={GREEN}
              />
              {p.semente && (
                <ellipse
                  cx={p.x + p.w / 2}
                  cy={p.y - 18}
                  rx={5}
                  ry={7}
                  fill={ORANGE}
                  stroke="#b9741a"
                />
              )}
              {p.inimigo && (
                <path
                  d={`M${p.x + p.w * 0.25} ${p.y - 5} l9 -18 l9 18 z`}
                  fill="#c0392b"
                />
              )}
            </g>
          ))}

          {/* baú no fim */}
          <rect
            x={1448}
            y={CHAO - 26}
            width={34}
            height={26}
            rx={4}
            fill="#6b4a2b"
            stroke="#2d3142"
            strokeWidth="2"
          />
          <rect
            x={1448}
            y={CHAO - 26}
            width={34}
            height={9}
            rx={4}
            fill="#d9a441"
          />

          {/* arcos do verificador */}
          {ilha.trilha.map((p, i) => {
            const ant =
              i === 0 ? { x: 14, y: CHAO - 4, w: 60 } : ilha.trilha[i - 1];
            const x1 = ant.x + ant.w / 2;
            const y1 = (i === 0 ? CHAO : ant.y) - 6;
            const x2 = p.x + p.w / 2;
            const y2 = p.y - 6;
            const topo = Math.min(y1, y2) - 34;
            return (
              <path
                key={i}
                d={`M${x1} ${y1} Q${(x1 + x2) / 2} ${topo} ${x2} ${y2}`}
                fill="none"
                stroke={ORANGE}
                strokeWidth={i < pulos ? 3 : 0}
                strokeDasharray="7 6"
                strokeLinecap="round"
                style={{ transition: "stroke-width 0.25s" }}
              />
            );
          })}
          <path
            d={`M${ultima.x + ultima.w / 2} ${ultima.y - 6} Q1380 ${CHAO - 120} 1465 ${CHAO - 30}`}
            fill="none"
            stroke={ORANGE}
            strokeWidth={aprovada ? 3 : 0}
            strokeDasharray="7 6"
            strokeLinecap="round"
            style={{ transition: "stroke-width 0.25s" }}
          />
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p
          className="flex items-center gap-2 text-sm font-bold text-navy"
          aria-live="polite"
        >
          {aprovada ? (
            <>
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-black"
                style={{ backgroundColor: GREEN }}
              >
                <Check size={14} />
              </span>
              Fase aprovada: saída, itens e baú alcançáveis
            </>
          ) : (
            <>
              Verificando pulos: {pulos}/{total}
            </>
          )}
        </p>
        <button
          type="button"
          onClick={() => setSeed(Math.floor(Math.random() * 1_000_000))}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-black transition-transform hover:scale-105"
          style={{ backgroundColor: ORANGE }}
        >
          <Refresh size={16} /> Gerar outra ilha
        </button>
      </div>
    </div>
  );
}
