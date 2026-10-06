"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowUpRight, Download, Sparkles } from "@mynaui/icons-react";
import {
  LAB_CATEGORIES,
  LAB_PROJECTS,
  LAB_SKILLS,
  type LabCategoryId,
} from "@/lib/ai-lab";

type Filter = "todos" | LabCategoryId;

// Menu de categorias do AI Lab: os projetos são bem distintos entre si, então
// o filtro separa por tipo (jogos, quizzes, SaaS) e dá às skills um espaço
// próprio. A pílula ativa desliza entre as opções (`layoutId`).
export function AiLabHub() {
  const [filter, setFilter] = useState<Filter>("todos");

  const projects = LAB_PROJECTS.filter(
    (p) => filter === "todos" || p.categoria === filter,
  );
  const showSkills = filter === "todos" || filter === "skills";

  const count = (id: Filter) =>
    id === "todos"
      ? LAB_PROJECTS.length + LAB_SKILLS.length
      : id === "skills"
        ? LAB_SKILLS.length
        : LAB_PROJECTS.filter((p) => p.categoria === id).length;

  const options: { id: Filter; label: string }[] = [
    { id: "todos", label: "Tudo" },
    ...LAB_CATEGORIES,
  ];

  return (
    <div>
      <LayoutGroup>
        <div
          role="tablist"
          aria-label="Categorias do AI Lab"
          className="flex flex-wrap gap-2"
        >
          {options.map((o) => {
            const active = filter === o.id;
            return (
              <button
                key={o.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setFilter(o.id)}
                className={`relative rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  active ? "text-black" : "text-slate hover:text-navy"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="lab-pill"
                    className="absolute inset-0 rounded-full bg-coral"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <span className="relative inline-flex items-center gap-2">
                  {o.label}
                  <span
                    className={`rounded-full px-1.5 text-[11px] tabular-nums ${
                      active ? "bg-black/15" : "bg-surface text-gray"
                    }`}
                  >
                    {count(o.id)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <motion.div layout className="mt-10 grid gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {projects.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: "easeOut" }}
              className={
                i === 0 && (filter === "todos" || projects.length === 1)
                  ? "md:col-span-2"
                  : ""
              }
            >
              <Link
                href={p.href}
                className="group relative block overflow-hidden rounded-3xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1"
                style={{ ["--accent" as string]: p.accent }}
              >
                <div
                  className={`relative overflow-hidden ${
                    i === 0 && (filter === "todos" || projects.length === 1)
                      ? "aspect-[16/8]"
                      : "aspect-[16/10]"
                  }`}
                  style={{ backgroundColor: `${p.accent}22` }}
                >
                  <Image
                    src={p.cover}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/10 to-transparent" />
                  <span
                    className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider text-black"
                    style={{ backgroundColor: p.accent }}
                  >
                    {p.tipo}
                  </span>
                </div>
                <div className="flex items-end justify-between gap-4 p-6">
                  <div>
                    <h3 className="text-2xl font-black text-navy">
                      {p.titulo}
                    </h3>
                    <p className="mt-1 max-w-md text-slate">{p.tagline}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tools.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border px-2.5 py-0.5 text-xs text-gray"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-black transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                    style={{ backgroundColor: p.accent }}
                  >
                    <ArrowUpRight size={22} />
                  </span>
                </div>
                <span
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                  style={{ backgroundColor: p.accent }}
                />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showSkills && (
          <motion.section
            key="skills"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-coral">
              Skills
            </p>
            <h2 className="mt-2 text-3xl font-black text-navy">
              O que aprendi, empacotado pra você usar
            </h2>
            <p className="mt-2 max-w-xl text-slate">
              Skills para o Claude nascidas dos meus projetos. A primeira já
              está aqui pra baixar; as outras chegam em breve.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {LAB_SKILLS.map((s, i) => (
                <motion.div
                  key={s.nome}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.07 }}
                  className={`relative overflow-hidden rounded-2xl border p-5 ${
                    s.download
                      ? "border-border bg-surface"
                      : "border-dashed border-border bg-surface/60"
                  }`}
                >
                  <span
                    className="absolute inset-x-0 top-0 h-0.5"
                    style={{ backgroundColor: s.accent }}
                  />
                  <div className="flex items-center justify-between">
                    <Sparkles size={20} style={{ color: s.accent }} />
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                        s.download ? "text-black" : "bg-bg text-gray"
                      }`}
                      style={
                        s.download ? { backgroundColor: s.accent } : undefined
                      }
                    >
                      {s.download ? "Disponível" : "Em breve"}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-black text-navy">
                    {s.nome}
                  </h3>
                  <p className="mt-1 text-sm text-slate">{s.descricao}</p>
                  <p className="mt-4 text-xs text-gray">
                    Nasceu em{" "}
                    <span style={{ color: s.accent }}>{s.origem}</span>
                  </p>
                  {s.download && (
                    <a
                      href={s.download}
                      download
                      className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-black transition-transform hover:scale-105"
                      style={{ backgroundColor: s.accent }}
                    >
                      <Download size={16} /> Baixar skill (.zip)
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
