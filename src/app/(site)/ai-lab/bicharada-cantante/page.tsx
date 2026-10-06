import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowUpRight,
  Film,
  LayersTwo,
  Microphone,
  Moon,
  Music,
  Play,
  Puzzle,
  Rocket,
  Sparkles,
  Users,
} from "@mynaui/icons-react";
import { Counter } from "@/components/counter";
import { LabVideo } from "@/components/lab-video";
import { Reveal } from "@/components/reveal";
import { labAsset } from "@/lib/ai-lab";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Bicharada Cantante — AI Lab — ${SITE_NAME}`,
  description:
    "Projeto pessoal: um jogo infantil que conta, canta e põe pra dormir, criado com IA em um dia.",
};

const GAME_URL = "https://tpointic-kids.vercel.app";
const GOLD = "#FFD54A";

const STATS = [
  { value: "4", label: "bichos do Brasil" },
  { value: "36", label: "falas dirigidas" },
  { value: "4", label: "músicas" },
  { value: "1", label: "dia do zero ao ar" },
];

const CAST = [
  { id: "caca", nome: "Cacá", especie: "capivara", cor: "#c98f5b" },
  { id: "zeca", nome: "Zeca", especie: "sapo", cor: "#6cc04a" },
  { id: "nina", nome: "Nina", especie: "onça-pintada", cor: "#f5a742" },
  { id: "tuca", nome: "Tuca", especie: "tucano", cor: "#38bdf8" },
];

const STEPS = [
  {
    icon: Sparkles,
    titulo: "A faísca",
    texto:
      "Queria testar jeitos de criar jogos. Comecei simples: tenho sobrinhos na idade certa. Eram os testers.",
  },
  {
    icon: Users,
    titulo: "O elenco",
    texto:
      "Capivara, sapo, onça e tucano. Quatro bichos, quatro personalidades.",
  },
  {
    icon: Microphone,
    titulo: "Vozes que parecem gente",
    texto:
      "36 falas geradas com ElevenLabs e dirigidas até a entonação certa. Cada bicho soletra a fruta: ma-nga.",
  },
  {
    icon: Music,
    titulo: "Trilha na medida",
    texto:
      "Letra própria e músicas. A boca só abre nas palavras cantadas, e o karaokê acende no tempo exato.",
  },
  {
    icon: Puzzle,
    titulo: "Contar e responder",
    texto:
      "A criança conta frutas e responde falando. O microfone já escuta sozinho, sem botão.",
    shot: "bicharada/game-round.webp",
  },
  {
    icon: Moon,
    titulo: "Boa noite, Bicharada",
    texto:
      "O dia vira noite, a lua sobe, os bichos bocejam e dormem, um por um.",
    shot: "bicharada/game-night.webp",
  },
  {
    icon: LayersTwo,
    titulo: "O que não rolou",
    texto:
      "Tentei 3D com Tripo e Blender. Lindo, mas trabalho demais pra bicho que mexe a boca. Voltei pro 2D e segui.",
    twist: true,
  },
  {
    icon: Film,
    titulo: "Videoclipe de diretor",
    texto:
      "Cenas geradas por IA, picotadas e montadas à mão pra casar com cada verso.",
  },
  {
    icon: Rocket,
    titulo: "No ar",
    texto: "GitHub, Vercel e pronto. De zero a online em um dia.",
  },
];

export default function BicharadaPage() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div
            className="absolute -right-20 top-0 h-96 w-96 rounded-full blur-[120px]"
            style={{ backgroundColor: `${GOLD}30` }}
          />
          <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#38bdf8]/20 blur-[110px]" />
        </div>
        <div className="relative z-10 mx-auto grid max-w-5xl gap-10 px-6 pb-16 pt-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:pt-20">
          <div>
            <Link
              href="/ai-lab"
              className="animate-fade-up flex w-fit items-center gap-1.5 text-sm font-bold text-slate transition-colors hover:text-coral"
            >
              <ArrowLeft size={16} /> AI Lab
            </Link>
            <p
              className="animate-fade-up mt-6 inline-block rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider text-black"
              style={{ backgroundColor: GOLD, animationDelay: "0.05s" }}
            >
              Projeto pessoal
            </p>
            <h1
              className="animate-fade-up mt-4 text-5xl font-black leading-[1.02] text-navy sm:text-7xl"
              style={{ animationDelay: "0.1s" }}
            >
              Bicharada <span style={{ color: GOLD }}>Cantante</span>
            </h1>
            <p
              className="animate-fade-up mt-5 max-w-md text-lg text-slate"
              style={{ animationDelay: "0.2s" }}
            >
              Um jogo que conta frutas, canta e põe a criançada pra dormir.
              Feito pra testar como a IA cria jogos.
            </p>
            <div
              className="animate-fade-up mt-8 flex flex-wrap gap-3"
              style={{ animationDelay: "0.3s" }}
            >
              <a
                href={GAME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-black transition-transform hover:scale-105"
                style={{ backgroundColor: GOLD }}
              >
                <Play size={18} /> Jogar agora
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>

          <div
            className="animate-fade-up relative"
            style={{ animationDelay: "0.2s" }}
          >
            <LabVideo
              src={labAsset("bicharada/clipe.mp4")}
              className="aspect-video overflow-hidden rounded-3xl border border-border shadow-[0_30px_80px_-30px_rgba(255,213,74,0.35)]"
            />
            <Image
              src={labAsset("bicharada/caca.webp")}
              alt=""
              width={180}
              height={180}
              aria-hidden
              className="lab-float pointer-events-none absolute -bottom-10 -left-6 h-24 w-24 sm:h-32 sm:w-32"
              style={{ "--lab-rot": "-6deg" } as React.CSSProperties}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 py-10 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <p className="text-5xl font-black" style={{ color: GOLD }}>
                <Counter value={s.value} />
              </p>
              <p className="mt-1 text-sm text-slate">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-widest text-coral">
            O elenco
          </p>
          <h2 className="mt-2 text-3xl font-black text-navy">
            Conheça a Bicharada
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CAST.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.1}>
              <div
                className="group rounded-3xl border border-border p-4 text-center transition-all duration-300 hover:-translate-y-2"
                style={{ backgroundColor: `${c.cor}18` }}
              >
                <Image
                  src={labAsset(`bicharada/${c.id}.webp`)}
                  alt={`${c.nome}, ${c.especie}`}
                  width={240}
                  height={240}
                  className="mx-auto h-36 w-36 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                />
                <p className="mt-2 text-lg font-black text-navy">{c.nome}</p>
                <p className="text-sm" style={{ color: c.cor }}>
                  {c.especie}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-coral">
              Como foi
            </p>
            <h2 className="mt-2 text-3xl font-black text-navy sm:text-4xl">
              Da ideia ao ar, passo a passo
            </h2>
          </Reveal>

          <ol className="relative mt-12 space-y-10 border-l border-border pl-8 sm:pl-12">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={s.titulo} className="relative">
                  <Reveal delay={0.05}>
                    <span
                      className="absolute -left-[calc(2rem+21px)] top-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-bg text-black sm:-left-[calc(3rem+21px)]"
                      style={{ backgroundColor: s.twist ? "#f472b6" : GOLD }}
                    >
                      <Icon size={20} />
                    </span>
                    <div
                      className={`rounded-3xl p-6 ${
                        s.twist
                          ? "border border-dashed border-[#f472b6]/60 bg-[#f472b6]/5"
                          : "border border-border bg-surface"
                      }`}
                    >
                      <p className="text-xs font-bold uppercase tracking-widest text-gray">
                        {s.twist ? "Plot twist" : `Passo ${i + 1}`}
                      </p>
                      <h3 className="mt-1 text-2xl font-black text-navy">
                        {s.titulo}
                      </h3>
                      <p className="mt-2 max-w-xl text-slate">{s.texto}</p>
                      {s.shot && (
                        <div className="relative mt-5 overflow-hidden rounded-2xl border border-border">
                          <Image
                            src={labAsset(s.shot)}
                            alt={s.titulo}
                            width={800}
                            height={634}
                            sizes="(min-width: 768px) 640px, 100vw"
                            className="h-auto w-full transition-transform duration-700 hover:scale-[1.03]"
                          />
                        </div>
                      )}
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <Reveal>
          <Image
            src={labAsset("bicharada/tuca.webp")}
            alt=""
            width={160}
            height={160}
            aria-hidden
            className="lab-float mx-auto h-28 w-28"
          />
          <h2 className="mt-4 text-4xl font-black text-navy sm:text-5xl">
            Chama a criançada
          </h2>
          <p className="mx-auto mt-3 max-w-md text-slate">
            Sem anúncios e sem cadastro. Roda direto no navegador.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={GAME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-bold text-black transition-transform hover:scale-105"
              style={{ backgroundColor: GOLD }}
            >
              <Play size={18} /> Jogar Bicharada Cantante
            </a>
            <Link
              href="/ai-lab"
              className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 font-bold text-navy transition-colors hover:border-coral hover:text-coral"
            >
              Ver outros projetos
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
