"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "@mynaui/icons-react";
import { Avatar, type Who } from "./avatars";
import {
  FONTES,
  HIPOTESES,
  METRICAS,
  MOSTRAR_PESQUISA,
  PASSOS,
  PERSONAS,
  RISCOS,
} from "./data";

const H2 =
  "mt-3 max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl";
const EYEBROW = "text-xs font-bold uppercase tracking-[0.25em]";

export function Personas() {
  return (
    <section className="bg-[#0b0f1d] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className={`${EYEBROW} text-[#66fcf1]`}>Para quem desenhar</p>
        <h2 className={H2}>Quatro perspectivas. Um acordo mais justo.</h2>
        <p className="mt-5 max-w-2xl text-lg text-white/65">
          O case trata quem cuida como usuário de verdade, não só como risco:
          regras claras também protegem a cuidadora de acusações e
          mal-entendidos. Todas as personas são hipóteses a validar.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PERSONAS.map((p, i) => (
            <motion.article
              key={p.nome}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <motion.span
                className="block w-fit rounded-full p-[3px]"
                style={{ backgroundColor: p.cor }}
                whileHover={{ rotate: -6, scale: 1.08 }}
              >
                <Avatar who={p.who as Who} size={72} className="block" />
              </motion.span>
              <p className="mt-4 text-xl font-black text-white">{p.nome}</p>
              <p
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: p.cor }}
              >
                {p.papel}
              </p>
              <p className="mt-4 text-base font-bold leading-snug text-white">
                “{p.quote}”
              </p>
              <p className="mt-3 text-sm text-white/55">{p.texto}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Hipoteses() {
  return (
    <section className="bg-[#0a0a0a] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <p className={`${EYEBROW} text-[#fbbf24]`}>O que validar em pesquisa</p>
        <h2 className={H2}>
          O produto só protege se continuar parecendo escolha.
        </h2>
        <p className="mt-5 max-w-2xl text-lg text-white/65">
          A hipótese central: titulares aceitam delegar mais quando conseguem
          escolher o quanto delegar e a quem, e quando a delegação é reversível.
        </p>
        <div className="mt-12 space-y-3">
          {HIPOTESES.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06 }}
              className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-[64px_1.4fr_1fr] sm:items-center"
            >
              <span className="text-3xl font-black text-[#fbbf24]">{h.id}</span>
              <p className="font-bold text-white">{h.titulo}</p>
              <p className="text-sm text-white/55">
                <span className="font-bold text-white/80">Como validar: </span>
                {h.como}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Riscos() {
  const [aberto, setAberto] = useState<number | null>(0);
  return (
    <section className="bg-[#14090f] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <p className={`${EYEBROW} text-[#f43f5e]`}>Princípio de segurança</p>
        <h2 className={H2}>
          O maior risco é a proteção{" "}
          <span className="text-[#f43f5e]">virar controle.</span>
        </h2>
        <p className="mt-5 max-w-2xl text-lg text-white/65">
          A imprensa já levantou que o validador pode ser justamente quem abusa
          financeiramente do idoso. Cada caso-limite ganhou uma resposta de
          design.
        </p>
        <div className="mt-12 divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/[0.03]">
          {RISCOS.map((r, i) => {
            const on = aberto === i;
            return (
              <div key={r.caso}>
                <button
                  type="button"
                  onClick={() => setAberto(on ? null : i)}
                  aria-expanded={on}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="flex items-center gap-4">
                    <span className="text-sm font-black text-white/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg font-black text-white">
                      {r.caso}
                    </span>
                  </span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-white/60 transition-transform ${on ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 pl-16 text-white/75">
                        <span className="font-bold text-[#66fcf1]">
                          Resposta de design:{" "}
                        </span>
                        {r.resposta}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-sm text-white/50">
          Fora do escopo do case: contestação judicial de curatela, herança e
          regras de outros produtos (crédito consignado, investimentos).
        </p>
      </div>
    </section>
  );
}

export function Fechamento() {
  return (
    <section className="relative overflow-hidden bg-[#070a14] py-28">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(103,76,255,0.25),transparent_70%)]" />
      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <p className={`${EYEBROW} text-[#66fcf1]`}>Fechamento do case</p>
        <h2 className="mt-3 text-5xl font-black leading-[1.02] text-white sm:text-7xl">
          Menos dinheiro perdido.
          <br />
          <span className="text-[#66fcf1]">Mais gente no comando.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-white/70">
          O sucesso se mede em duas frentes: menos dinheiro perdido em golpes e
          titulares que continuam se sentindo donos da própria conta. Como o
          case ainda é uma proposta, estes são os indicadores a acompanhar, não
          resultados.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {METRICAS.map((m, i) => (
            <motion.div
              key={m.nome}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="text-xl font-black text-white">{m.nome}</p>
              <p className="mt-2 text-sm text-white/60">{m.texto}</p>
            </motion.div>
          ))}
        </div>

        {MOSTRAR_PESQUISA && (
          <>
            <h3 className="mt-20 text-3xl font-black text-white">
              O protótipo é o começo. A pesquisa decide o resto.
            </h3>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2">
              {PASSOS.map((p, i) => (
                <li
                  key={p.t}
                  className="flex gap-4 rounded-2xl border border-white/10 p-5"
                >
                  <span className="text-3xl font-black text-[#a78bfa]">
                    0{i + 1}
                  </span>
                  <span>
                    <span className="block text-lg font-black text-white">
                      {p.t}
                    </span>
                    <span className="block text-sm text-white/60">{p.d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </>
        )}

        <details className="mt-16 rounded-2xl border border-white/10 p-5">
          <summary className="cursor-pointer text-sm font-bold uppercase tracking-widest text-white/60">
            Fontes
          </summary>
          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {FONTES.map((f) => (
              <li key={f.u}>
                <a
                  href={f.u}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-white/70 transition-colors hover:text-[#66fcf1]"
                >
                  {f.t} <ArrowUpRight size={14} />
                </a>
              </li>
            ))}
          </ul>
        </details>

        <div className="mt-14 flex flex-wrap gap-3">
          <Link
            href="/cases"
            className="rounded-full bg-white px-7 py-3.5 font-bold text-black transition-transform hover:scale-105"
          >
            Ver todos os cases
          </Link>
          <a
            href="#prototipo"
            className="rounded-full border border-white/25 px-7 py-3.5 font-bold text-white transition-colors hover:border-white/60"
          >
            Voltar aos protótipos
          </a>
        </div>
      </div>
    </section>
  );
}
