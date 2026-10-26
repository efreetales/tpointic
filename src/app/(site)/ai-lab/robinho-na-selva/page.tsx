import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Sparkles } from "@mynaui/icons-react";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Robinho na Selva — AI Lab — ${SITE_NAME}`,
  description:
    "Projeto pessoal: um jogo de plataforma em que um náufrago com chapéu de fogo atravessa um arquipélago de ilhas.",
};

const GAME_URL = "https://robinho-na-selva.vercel.app";

const FICHA = [
  { label: "Gênero", valor: "Plataforma 2D com progressão" },
  { label: "Plataforma", valor: "Navegador (versão web) · Godot 4.7" },
  { label: "Controles", valor: "Teclado ou controle" },
  { label: "Ferramentas", valor: "Godot, Claude Code, Codex, Recraft" },
];

export default function RobinhoNaSelvaPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href="/ai-lab"
        className="inline-flex items-center gap-2 text-sm opacity-70 hover:opacity-100"
      >
        <ArrowLeft className="size-4" /> Voltar ao AI Lab
      </Link>

      <header className="mt-8 space-y-4">
        <p className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: "#F5A742" }}>
          <Sparkles className="size-4" /> Projeto pessoal · Jogo de plataforma
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Robinho na Selva</h1>
        <p className="max-w-2xl text-lg opacity-80">
          Um náufrago simpático, um chapéu de palha que solta fogo como um vulcão e um arquipélago para
          atravessar. Cada partida gera uma ilha nova, e o que ele junta no caminho vira progresso.
        </p>
      </header>

      <div className="mt-10 overflow-hidden rounded-2xl border">
        <Image
          src="/ai-lab/robinho/cover.webp"
          alt="Robinho atravessando uma fase da Ilha da Selva"
          width={1280}
          height={714}
          className="h-auto w-full"
          priority
        />
      </div>

      <div className="mt-8">
        <a
          href={GAME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-black"
          style={{ backgroundColor: "#F5A742" }}
        >
          Jogar agora <ArrowUpRight className="size-4" />
        </a>
      </div>

      <section className="mt-16 grid gap-6 sm:grid-cols-2">
        {FICHA.map((item) => (
          <div key={item.label} className="rounded-xl border p-5">
            <p className="text-sm opacity-60">{item.label}</p>
            <p className="mt-1 font-medium">{item.valor}</p>
          </div>
        ))}
      </section>

      <p className="mt-16 text-sm opacity-60">
        Feito em {SITE_NAME}, como parte do AI Lab.
      </p>
    </main>
  );
}
