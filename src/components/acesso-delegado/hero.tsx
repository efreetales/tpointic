"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Avatar, type Who } from "./avatars";
import { ROLES } from "./data";

const WORDS = ["Acesso", "delegado", "com", "consentimento."];

// Hero: a titular no centro e os três poderes (operar, acompanhar, aprovar)
// orbitando — a ideia do case numa imagem só: quem manda é a dona da conta.
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#070a14]">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(103,76,255,0.22),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse at 70% 50%, black 10%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 70% 50%, black 10%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-72px)] max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Link
            href="/cases"
            className="mb-6 inline-block text-sm font-bold text-white/70 transition-colors hover:text-white"
          >
            ← Voltar para cases
          </Link>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs font-bold uppercase tracking-[0.25em] text-[#a78bfa]"
          >
            Caso de Estudo × Fintech
          </motion.p>
          <h1 className="mt-5 text-[2.45rem] font-black leading-[1.02] text-white min-[420px]:text-5xl sm:text-6xl lg:text-[4.25rem]">
            {WORDS.map((w, i) => (
              <motion.span
                key={w}
                initial={{ opacity: 0, y: 40, rotate: 2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.15 + i * 0.12,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
                className="mr-[0.25em] inline-block last:mr-0"
              >
                {i === 3 ? <span className="text-[#66fcf1]">{w}</span> : w}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-7 max-w-lg text-lg text-white/75 sm:text-xl"
          >
            Como um banco pode proteger o dinheiro de quem precisa de ajuda sem
            tirar dele a autonomia que ainda tem?
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <a
              href="#prototipo"
              className="rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
            >
              Ver os protótipos
            </a>
            <a
              href="#problema"
              className="rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white transition-colors hover:border-white/60"
            >
              Ler o raciocínio
            </a>
          </motion.div>
        </div>

        <Orbit />
      </div>
    </section>
  );
}

function Orbit() {
  const rings = [
    {
      r: 105,
      dur: "46s",
      start: -90,
      role: { ...ROLES[0], who: "rose" as Who },
    },
    {
      r: 150,
      dur: "62s",
      start: 30,
      role: { ...ROLES[1], who: "marcos" as Who },
    },
    {
      r: 195,
      dur: "78s",
      start: 150,
      role: { ...ROLES[2], who: "marina" as Who },
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
      className="relative mx-auto h-[380px] w-full max-w-[520px] sm:h-[520px]"
      aria-label="A titular no centro, com os papéis operar, acompanhar e aprovar em órbita"
      role="img"
    >
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 scale-[0.66] sm:scale-100">
        {rings.map(({ r, dur, start, role }) => (
          <div
            key={role.id}
            className="absolute left-1/2 top-1/2"
            style={{
              width: r * 2,
              height: r * 2,
              marginLeft: -r,
              marginTop: -r,
            }}
          >
            <svg
              viewBox={`0 0 ${r * 2} ${r * 2}`}
              className="absolute inset-0 h-full w-full"
              aria-hidden
            >
              <circle
                cx={r}
                cy={r}
                r={r - 1}
                fill="none"
                stroke={role.cor}
                strokeOpacity="0.35"
                strokeWidth="1"
                strokeDasharray="4 8"
                className="ad-dash"
              />
            </svg>
            <div
              className="ad-spin absolute inset-0"
              style={{ ["--ad-dur" as string]: dur }}
            >
              <div
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `rotate(${start}deg) translateX(${r}px) rotate(${-start}deg)`,
                }}
              >
                <div
                  className="ad-spin-rev"
                  style={{ ["--ad-dur" as string]: dur }}
                >
                  <div className="flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 whitespace-nowrap rounded-full border border-white/15 bg-[#0d1224]/90 py-1.5 pl-1.5 pr-4 backdrop-blur-md">
                    <Avatar who={role.who} size={36} className="block" />
                    <span>
                      <span
                        className="block text-sm font-black leading-none"
                        style={{ color: role.cor }}
                      >
                        {role.nome}
                      </span>
                      <span className="mt-1 block text-[11px] leading-none text-white/60">
                        {role.curto}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="ad-pulse absolute inset-0 -m-6 rounded-full bg-white/30" />
          <div className="relative flex flex-col items-center">
            <div className="rounded-full bg-white p-1 shadow-[0_0_80px_rgba(255,255,255,0.35)]">
              <Avatar who="lucia" size={96} className="block" />
            </div>
            <span className="absolute -bottom-3 whitespace-nowrap rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black">
              <span className="ad-t">Dona Lúcia · 78</span>
            </span>
          </div>
        </div>
        <p className="absolute -bottom-6 left-1/2 w-full max-w-sm -translate-x-1/2 text-center text-xs font-bold uppercase tracking-[0.18em] text-white/50">
          Cada pessoa tem um papel. A senha fica com a dona da conta.
        </p>
      </div>
    </motion.div>
  );
}
