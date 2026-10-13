"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "@mynaui/icons-react";
import { ALTERNATIVAS, REFERENCIAS } from "./data";

// "Tudo ou nada": uma régua de quanto controle a pessoa entrega, com as
// saídas de hoje todas amontoadas do lado do "entrega tudo" e um vazio no
// meio, que é exatamente onde o case entra.
export function Problema() {
  const [ativo, setAtivo] = useState<number | null>(null);

  return (
    <section id="problema" className="relative bg-[#0a0a0a] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#66fcf1]">
          O problema
        </p>
        <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl">
          Hoje, pedir ajuda com o dinheiro é uma escolha de{" "}
          <span className="text-[#fbbf24]">tudo ou nada.</span>
        </h2>
        <p className="mt-5 max-w-2xl text-lg text-white/65">
          Entre fazer tudo sozinho e entregar a senha, falta um meio-termo
          seguro. Toque nas opções de hoje.
        </p>

        <div className="mt-16">
          <div className="relative h-24">
            <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#66fcf1] via-[#a78bfa] to-[#f43f5e]" />

            <div className="absolute inset-y-0 left-[10%] w-[46%] rounded-2xl border border-dashed border-white/25">
              <span className="ad-pulse absolute inset-0 rounded-2xl bg-white/5" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                delay: 0.5,
                type: "spring",
                stiffness: 200,
                damping: 14,
              }}
              className="absolute left-[33%] top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="rounded-full bg-white px-4 py-2 text-xs font-black text-black shadow-[0_0_40px_rgba(255,255,255,0.4)] sm:text-sm">
                Acesso delegado
              </div>
            </motion.div>

            {ALTERNATIVAS.map((a, i) => (
              <button
                key={a.nome}
                type="button"
                onClick={() => setAtivo(ativo === i ? null : i)}
                onMouseEnter={() => setAtivo(i)}
                aria-pressed={ativo === i}
                aria-label={a.nome}
                className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${a.pos}%` }}
              >
                <span
                  className={`block h-5 w-5 rounded-full border-2 transition-all ${
                    ativo === i
                      ? "scale-150 border-white bg-[#f43f5e]"
                      : "border-white/60 bg-[#0a0a0a] group-hover:scale-125"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="mt-2 flex justify-between text-xs font-bold uppercase tracking-widest text-white/45">
            <span>Faz tudo sozinho</span>
            <span>Entrega tudo</span>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ALTERNATIVAS.map((a, i) => (
            <motion.div
              key={a.nome}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08 }}
              onMouseEnter={() => setAtivo(i)}
              className={`rounded-2xl border p-5 transition-colors ${
                ativo === i
                  ? "border-[#f43f5e]/70 bg-[#f43f5e]/10"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <p className="text-xs font-bold text-white/40">0{i + 1}</p>
              <h3 className="mt-2 text-lg font-black text-white">{a.nome}</h3>
              <p className="mt-2 text-sm text-white/65">{a.texto}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#fbbf24]">
              Por que agora
            </p>
            <h3 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
              Uma lacuna entre ajuda e controle.
            </h3>
            <p className="mt-4 text-white/70">
              O <strong className="text-white">PL 1453/2026</strong> propõe uma
              validação por pessoa de confiança para clientes 60+, sem que ela
              veja saldo ou extrato. O case parte dessa conversa, mas amplia o
              modelo: mais de uma pessoa, papéis diferentes e um caminho para
              quem já não consegue aprovar sozinho.
            </p>
            <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/60">
              Procuração, curatela e Tomada de Decisão Apoiada são pontos de
              partida para validação jurídica, não conclusões do projeto.
            </p>
          </div>

          <motion.figure
            initial={{ opacity: 0, y: 30, rotate: 1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-2xl border border-white/15 bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-center gap-2 border-b border-black/10 bg-[#f1f1f1] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 truncate rounded-md bg-white px-3 py-1 text-[11px] text-black/50">
                nsctotal.com.br/economia
              </span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cases/acesso-delegado/noticia-pl.webp"
              alt="Manchete: Pix e transferências de idosos podem exigir aprovação de parente para evitar golpes bancários"
              width={800}
              height={240}
              className="block h-auto w-full"
            />
            <figcaption className="flex items-center justify-between gap-3 bg-[#0d0a1a] px-4 py-3 text-xs text-white/65">
              <span>
                Recorte de notícia · NSC Total, 15/07/2026. Projeto que cria a
                &ldquo;trava humana&rdquo; para idosos.
              </span>
              <a
                href="https://www.nsctotal.com.br/economia/nova-regra-bancos-idosos-golpe-pix"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir a matéria completa"
                className="shrink-0 text-white/60 transition-colors hover:text-[#66fcf1]"
              >
                <ArrowUpRight size={18} />
              </a>
            </figcaption>
          </motion.figure>
        </div>

        <div className="mt-24">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#66fcf1]">
            Benchmark
          </p>
          <h3 className="mt-3 max-w-2xl text-3xl font-black leading-tight text-white sm:text-4xl">
            O que o mercado já fez, e onde cada solução para.
          </h3>

          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10">
            <div className="hidden grid-cols-[1.1fr_1.4fr_1.4fr] gap-6 border-b border-white/10 bg-white/[0.05] px-6 py-3 text-xs font-bold uppercase tracking-widest md:grid">
              <span className="text-white/50">Referência</span>
              <span className="text-[#66fcf1]">O que já resolve</span>
              <span className="text-[#f43f5e]">Onde ainda falha</span>
            </div>
            {REFERENCIAS.map((r, i) => (
              <motion.div
                key={r.nome}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.06 }}
                className="grid gap-2 border-b border-white/10 px-6 py-5 last:border-b-0 md:grid-cols-[1.1fr_1.4fr_1.4fr] md:gap-6"
              >
                <div className="flex items-start gap-2">
                  <p className="font-black text-white">{r.nome}</p>
                  {r.url && (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Abrir ${r.nome}`}
                      className="mt-0.5 shrink-0 text-white/40 transition-colors hover:text-[#66fcf1]"
                    >
                      <ArrowUpRight size={16} />
                    </a>
                  )}
                </div>
                <p className="text-sm text-white/75">
                  <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-widest text-[#66fcf1] md:hidden">
                    O que já resolve
                  </span>
                  {r.faz}
                </p>
                <p className="text-sm text-white/75">
                  <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-widest text-[#f43f5e] md:hidden">
                    Onde ainda falha
                  </span>
                  {r.falta}
                </p>
              </motion.div>
            ))}
          </div>

          <p className="mt-6 rounded-2xl border border-[#a78bfa]/40 bg-[#a78bfa]/10 p-5 text-white/85">
            <span className="font-black text-white">Diferencial do case:</span>{" "}
            juntar o melhor de cada um num modelo com papéis separados,
            configurável pelo próprio titular no app e adaptado ao contexto
            brasileiro (Pix, PL 1453/2026).
          </p>
        </div>

        <blockquote className="mt-24 border-l-4 border-[#a78bfa] pl-6 text-2xl font-black leading-snug text-white sm:text-4xl">
          Delegar não é desaparecer da própria conta.
          <span className="block text-white/55">
            É escolher como o cuidado entra nela.
          </span>
        </blockquote>
      </div>
    </section>
  );
}
