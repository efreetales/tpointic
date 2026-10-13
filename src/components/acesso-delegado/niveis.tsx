"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, type Who } from "./avatars";
import { NIVEIS } from "./data";

const QUEM: Record<string, { rot: string; cor: string; who: Who }> = {
  titular: { rot: "Titular", cor: "#f9fafb", who: "lucia" },
  confianca: { rot: "Pessoa de confiança", cor: "#a78bfa", who: "helena" },
  familiar: { rot: "Familiar", cor: "#fbbf24", who: "marcos" },
  cuidador: { rot: "Cuidador", cor: "#66fcf1", who: "rose" },
  validador: { rot: "Validador", cor: "#a78bfa", who: "marina" },
  banco: { rot: "Banco", cor: "#94a3b8", who: "banco" },
};

// Autonomia não é binária: o mesmo modelo acompanha quatro momentos de vida.
// Arrastar o seletor muda quem faz o quê, e quanto da decisão sai das mãos
// do titular.
export function Niveis() {
  const [i, setI] = useState(0);
  const n = NIVEIS[i];
  const autonomia = 100 - i * 24;

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#fbbf24]">
          Cenários de autonomia
        </p>
        <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl">
          Autonomia não é binária.
        </h2>
        <p className="mt-5 max-w-2xl text-lg text-white/65">
          O mesmo modelo serve do idoso que só quer uma rede de segurança até
          quem já não consegue aprovar nada, com o arranjo mudando ao longo do
          tempo.
        </p>

        <div className="mt-14">
          <div className="relative">
            <div className="h-1.5 rounded-full bg-white/10" />
            <motion.div
              className="absolute left-0 top-0 h-1.5 rounded-full bg-gradient-to-r from-[#66fcf1] to-[#f43f5e]"
              animate={{ width: `${(i / (NIVEIS.length - 1)) * 100}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 26 }}
            />
            <div className="absolute inset-x-0 -top-4 flex justify-between">
              {NIVEIS.map((x, k) => (
                <button
                  key={x.n}
                  type="button"
                  onClick={() => setI(k)}
                  aria-label={`Nível ${x.n}: ${x.nome}`}
                  aria-pressed={i === k}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-black transition-all ${
                    k <= i
                      ? "border-white bg-white text-black"
                      : "border-white/30 bg-[#0a0a0a] text-white/60 hover:border-white/70"
                  } ${i === k ? "scale-125" : ""}`}
                >
                  {x.n}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8 grid grid-cols-4 gap-2 text-center text-[11px] font-bold uppercase tracking-wider text-white/45 sm:text-xs">
            {NIVEIS.map((x) => (
              <span key={x.n}>{x.nome}</span>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="relative flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <AnimatePresence mode="popLayout">
                {n.quem.map((q, k) => {
                  const w = QUEM[q];
                  const who: Who =
                    q === "titular"
                      ? n.n === 4
                        ? "antonio"
                        : "lucia"
                      : q === "validador"
                        ? (n.quem as readonly string[])
                            .slice(0, k)
                            .includes("validador")
                          ? "clara"
                          : "marina"
                        : QUEM[q].who;
                  return (
                    <motion.div
                      key={`${n.n}-${q}-${k}`}
                      layout
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{
                        delay: k * 0.07,
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <span
                        className="block rounded-full p-[3px]"
                        style={{ backgroundColor: w.cor }}
                      >
                        <Avatar who={who} size={64} className="block" />
                      </span>
                      <span className="text-[11px] font-bold text-white/65">
                        {q === "titular" && n.n === 4 ? "Seu Antônio" : w.rot}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            <div className="mt-8 w-full">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-white/45">
                <span>Decisão com o titular</span>
                <span>
                  {n.n === 4 ? "Com respaldo legal" : "Reversível por ele"}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-white"
                  animate={{ width: `${autonomia}%` }}
                  transition={{ type: "spring", stiffness: 160, damping: 22 }}
                />
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.dl
              key={n.n}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-white/45">
                  Situação do titular
                </dt>
                <dd className="mt-1 text-xl font-black text-white">
                  {n.situacao}
                </dd>
              </div>
              {[
                ["Quem faz o dia a dia", n.dia, "#66fcf1"],
                ["Quem aprova o que é sensível", n.aprova, "#a78bfa"],
                ["Quem acompanha", n.acompanha, "#fbbf24"],
              ].map(([t, v, c]) => (
                <div key={t} className="border-t border-white/10 pt-4">
                  <dt
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: c }}
                  >
                    {t}
                  </dt>
                  <dd className="mt-1 text-white/85">{v}</dd>
                </div>
              ))}
              {n.nota && (
                <p className="rounded-xl bg-white/10 px-4 py-3 text-sm font-bold text-white">
                  {n.nota}
                </p>
              )}
            </motion.dl>
          </AnimatePresence>
        </div>

        <p className="mt-10 max-w-3xl text-white/65">
          <span className="font-black text-white">Quem sobe o nível?</span> Nos
          níveis 1 a 3, o próprio titular ajusta ou revoga. No nível 4, o
          arranjo precisa nascer de um documento legal validado pelo banco, não
          de uma tela, para ninguém “rebaixar” a autonomia sem respaldo.
        </p>
      </div>
    </section>
  );
}
