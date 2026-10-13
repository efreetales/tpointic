"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ShieldX } from "@mynaui/icons-react";
import { Avatar } from "./avatars";
import { PEOPLE, ROLES, type PersonId, type RoleId } from "./data";

type Assign = Record<RoleId, PersonId[]>;

const INICIAL: Assign = {
  operar: ["rose"],
  acompanhar: ["marcos"],
  aprovar: ["marina", "clara"],
};

const etapasDe = (operador: string) => [
  `${operador} tenta um Pix de R$ 480 acima do limite.`,
  "O banco segura a operação e avisa quem aprova.",
  "Basta um validador aprovar: o Pix é liberado.",
];

// Modelo de papéis: escolha uma pessoa, toque num papel para atribuir. A
// regra do case é imposta de verdade: quem opera nunca valida o próprio gasto.
export function Modelo() {
  const [assign, setAssign] = useState<Assign>(INICIAL);
  const [sel, setSel] = useState<PersonId | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [etapa, setEtapa] = useState(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const nome = (id: PersonId) => PEOPLE.find((p) => p.id === id)!.nome;

  function atribuir(role: RoleId) {
    if (!sel) {
      setAviso("Escolha uma pessoa primeiro.");
      return;
    }
    const ja = assign[role].includes(sel);
    if (ja) {
      setAssign({ ...assign, [role]: assign[role].filter((p) => p !== sel) });
      setAviso(null);
      return;
    }
    const conflito =
      (role === "aprovar" && assign.operar.includes(sel)) ||
      (role === "operar" && assign.aprovar.includes(sel));
    if (conflito) {
      setAviso(
        `${nome(sel)} não pode operar e aprovar: quem gasta não aprova o próprio gasto.`,
      );
      setShakeKey((k) => k + 1);
      return;
    }
    if (role === "operar" && assign.operar.length >= 1) {
      setAviso("Neste modelo há um operador por vez. Remova o atual antes.");
      setShakeKey((k) => k + 1);
      return;
    }
    if (role === "aprovar" && assign.aprovar.length >= 2) {
      setAviso("Dois validadores bastam para o nível 4.");
      setShakeKey((k) => k + 1);
      return;
    }
    setAssign({ ...assign, [role]: [...assign[role], sel] });
    setAviso(null);
  }

  function simular() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setEtapa(0);
    [1, 2, 3].forEach((e, i) =>
      timers.current.push(setTimeout(() => setEtapa(e), (i + 1) * 1500)),
    );
  }

  const semValidador = assign.aprovar.length === 0;
  const ETAPAS = etapasDe(
    assign.operar[0] ? nome(assign.operar[0]) : "A pessoa",
  );
  const semOperador = assign.operar.length === 0;

  return (
    <section className="relative bg-[#0b0f1d] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a78bfa]">
          O modelo
        </p>
        <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl">
          Separar poderes para manter escolhas.
        </h2>
        <p className="mt-5 max-w-2xl text-lg text-white/65">
          Operar, acompanhar e aprovar não precisam morar na mesma pessoa. Só a
          titular decide quem fica com cada um. Monte o arranjo de Dona Lúcia:
          escolha alguém e toque no papel.
        </p>

        <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-xs font-bold uppercase tracking-widest text-white/45">
              Pessoas
            </span>
            {PEOPLE.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSel(sel === p.id ? null : p.id)}
                aria-pressed={sel === p.id}
                className={`flex h-11 items-center gap-2 rounded-full border py-1 pl-1 pr-4 text-sm font-bold transition-all ${
                  sel === p.id
                    ? "scale-105 border-white bg-white text-black"
                    : "border-white/20 text-white hover:border-white/50"
                }`}
              >
                <Avatar who={p.id} size={32} className="block" />
                <span className="ad-t">{p.nome}</span>
                <span className="ad-t hidden text-xs font-normal opacity-60 sm:inline-block">
                  {p.papel}
                </span>
              </button>
            ))}
          </div>

          <div className="relative mt-8 grid gap-4 md:grid-cols-3">
            {ROLES.map((r) => {
              const lit =
                (etapa === 0 && r.id === "operar") ||
                (etapa >= 1 && etapa < 3 && r.id === "aprovar") ||
                (etapa === 3 && r.id === "aprovar");
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => atribuir(r.id)}
                  className="relative rounded-2xl border p-5 text-left transition-all hover:-translate-y-1"
                  style={{
                    borderColor: lit ? r.cor : `${r.cor}55`,
                    background: `linear-gradient(180deg, ${r.cor}${lit ? "33" : "14"}, transparent)`,
                    boxShadow: lit ? `0 0 50px ${r.cor}55` : "none",
                  }}
                >
                  <p className="text-xl font-black" style={{ color: r.cor }}>
                    {r.nome}
                  </p>
                  <p className="mt-1 min-h-[3.5rem] text-sm text-white/65">
                    {r.desc}
                  </p>
                  <div className="mt-3 flex min-h-9 flex-wrap gap-2">
                    <AnimatePresence>
                      {assign[r.id].map((id) => (
                        <motion.span
                          key={id}
                          layout
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          className="inline-flex h-9 items-center gap-1.5 rounded-full py-1 pl-1 pr-3.5 text-sm font-black text-black"
                          style={{ backgroundColor: r.cor }}
                        >
                          <Avatar who={id} size={28} className="block" />
                          <span className="ad-t">{nome(id)}</span>
                        </motion.span>
                      ))}
                    </AnimatePresence>
                    {assign[r.id].length === 0 && (
                      <span className="inline-flex h-9 items-center rounded-full border border-dashed border-white/25 px-4 text-sm text-white/40">
                        <span className="ad-t">ninguém</span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 min-h-12" aria-live="polite">
            <AnimatePresence mode="wait">
              {aviso && (
                <motion.div
                  key={shakeKey + aviso}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="ad-shake flex items-center gap-2 rounded-xl border border-[#f43f5e]/50 bg-[#f43f5e]/10 px-4 py-3 text-sm font-bold text-[#fda4af]"
                >
                  <ShieldX size={18} /> {aviso}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-white/70">
              <p className="font-black text-white">
                O banco registra cada ação.
              </p>
              <p>
                Uma pessoa pode acumular papéis (a filha supervisiona e valida),
                mas quem opera nunca valida o próprio gasto.
              </p>
            </div>
            <button
              type="button"
              onClick={simular}
              disabled={semOperador}
              className="shrink-0 rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition-transform hover:scale-105 disabled:opacity-40"
            >
              Simular um Pix fora do padrão
            </button>
          </div>

          <AnimatePresence>
            {etapa >= 0 && (
              <motion.ol
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 space-y-2 overflow-hidden"
              >
                {ETAPAS.map((t, i) => {
                  const feito = etapa >= i;
                  const falha = i === 2 && semValidador;
                  return (
                    <li
                      key={t}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-500 ${
                        feito
                          ? falha
                            ? "border-[#f43f5e]/60 bg-[#f43f5e]/10 text-white"
                            : "border-white/25 bg-white/10 text-white"
                          : "border-white/5 text-white/25"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                          feito
                            ? falha
                              ? "bg-[#f43f5e] text-white"
                              : "bg-[#66fcf1] text-black"
                            : "bg-white/10"
                        }`}
                      >
                        {feito && !falha ? <Check size={14} /> : i + 1}
                      </span>
                      {falha
                        ? "Sem validador: ninguém responde no prazo e a operação é cancelada. Todos são avisados."
                        : t}
                    </li>
                  );
                })}
              </motion.ol>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
