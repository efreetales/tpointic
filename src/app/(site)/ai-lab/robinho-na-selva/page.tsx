import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Fire,
  Keyboard,
  Leaf,
  LayersTwo,
  Map,
  Package,
  Play,
  Search,
  Sparkles,
  VolumeHigh,
  Zap,
} from "@mynaui/icons-react";
import { Counter } from "@/components/counter";
import { Reveal } from "@/components/reveal";
import { GeradorIlha } from "@/components/robinho/gerador-ilha";
import { JogoEmbed } from "@/components/robinho/jogo-embed";
import { labAsset } from "@/lib/ai-lab";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Robinho na Selva — AI Lab — ${SITE_NAME}`,
  description:
    "Projeto pessoal: um jogo de plataforma em que um náufrago com chapéu de fogo atravessa um arquipélago de ilhas geradas na hora, feito em Godot com IA.",
};

const GAME_URL = "/jogo-robinho/index.html";
const ORANGE = "#F5A742";
const GREEN = "#7cc576";

const STATS = [
  { value: "5", label: "segmentos por ilha" },
  { value: "15 mil", label: "pixels de ilha nova a cada partida" },
  { value: "12", label: "animações do Robinho" },
  { value: "100%", label: "das fases verificadas como passáveis" },
];

// Quadros e velocidade iguais aos do jogo (24 quadros por segundo).
const ANIMACOES = [
  { id: "andar", nome: "Andar", n: 22 },
  { id: "pular", nome: "Pular", n: 16 },
  { id: "fogo", nome: "Soltar fogo", n: 23 },
  { id: "comemorar", nome: "Comemorar", n: 44 },
];

const PODERES = [
  {
    nome: "Bola de fogo",
    texto:
      "Um toque e a bola sai do buraco do chapéu em arco curto, explodindo ao bater.",
    estado: "No jogo",
  },
  {
    nome: "Disparo carregado",
    texto:
      "Segure por 1 segundo: a bola sai 60% maior, a explosão pega tudo num raio de 150 px e a tela treme.",
    estado: "No jogo",
  },
  {
    nome: "Erupção",
    texto: "Várias bolas de fogo para cima ao mesmo tempo, como um vulcão.",
    estado: "Proposta",
  },
  {
    nome: "Pulo de vapor",
    texto: "Um segundo pulo no ar, empurrado por um jato de fogo para baixo.",
    estado: "Proposta",
  },
  {
    nome: "Brasa protetora",
    texto: "Um escudo de brasas que gira em volta dele e queima quem encosta.",
    estado: "Proposta",
  },
];

const INIMIGOS = [
  {
    id: "caranguejo",
    nome: "Caranguejo de pedra",
    papel: "Andarilho",
    texto: "Vai de um lado para o outro. Uma bola de fogo resolve.",
  },
  {
    id: "lagarto",
    nome: "Lagarto cuspidor",
    papel: "Atirador",
    texto:
      "Fica parado e cospe quando Robinho chega perto. Ataque entre os cuspes.",
  },
  {
    id: "planta",
    nome: "Planta carnívora",
    papel: "Brotador",
    texto: "Mora no chão e morde quem passa perto demais.",
  },
  {
    id: "cogumelo",
    nome: "Cogumelo de espinhos",
    papel: "Atirador",
    texto: "Solta espinhos de tempos em tempos.",
  },
];

const ILHAS = [
  {
    n: 1,
    nome: "Selva",
    tema: "Cachoeiras, palmeiras e ruínas",
    cor: "#7cc576",
    pronta: true,
  },
  {
    n: 2,
    nome: "Mangue",
    tema: "Lama, raízes e cipós para balançar",
    cor: "#b08a5a",
    pronta: false,
  },
  {
    n: 3,
    nome: "Penhascos",
    tema: "Rochedos, ventania e ninhos",
    cor: "#5bb8e8",
    pronta: false,
  },
  {
    n: 4,
    nome: "Caverna de Cristal",
    tema: "Escuridão e cristais que refletem o fogo",
    cor: "#a78bfa",
    pronta: false,
  },
  {
    n: 5,
    nome: "Navio de Névoa",
    tema: "Convés, gelo e o Capitão Gelo",
    cor: "#9fb3c8",
    pronta: false,
  },
];

const PRONTO = [
  "Ilha da Selva jogável de ponta a ponta",
  "Andar, pular, soltar fogo, carregar, dano, comemorar e dormir",
  "Fases geradas na hora, com verificador de física",
  "Planta carnívora, cogumelo de espinhos, caranguejo e lagarto",
  "Sementes, fatias de laranja e baú",
  "Música da selva e efeitos de fogo, vitória e impacto",
];

const FALTA = [
  "Moedas que ficam entre uma partida e outra",
  "A Cabana do Robinho e a loja de melhorias",
  "As outras quatro ilhas e os chefes",
  "Mapa das ilhas, menu inicial e pausa",
  "Novos poderes do chapéu",
  "A travessia de barco entre as ilhas",
];

const FERRAMENTAS = ["Godot 4.7", "Claude Code", "Codex", "Recraft"];

const CONTROLES = [
  { acao: "Andar", teclas: ["A", "D", "←", "→"] },
  { acao: "Pular (segure para ir mais alto)", teclas: ["Espaço", "W", "↑"] },
  { acao: "Bola de fogo (segure para carregar)", teclas: ["J", "X"] },
  { acao: "Reiniciar a fase", teclas: ["R"] },
];

const PASSOS = [
  {
    icon: Sparkles,
    titulo: "A faísca",
    texto:
      "Queria um plataforma clássico, daqueles com selva, cachoeira e frutas para pegar. Comecei por um mockup e montei o jogo em volta dele.",
    imagem: {
      src: "robinho/mockup.webp",
      alt: "Mockup original da fase, com selva e cachoeira",
      w: 1400,
      h: 700,
      legenda: "O mockup que guiou o layout da primeira fase.",
    },
  },
  {
    icon: Leaf,
    titulo: "Um náufrago otimista",
    texto:
      "Robinho é uma homenagem a Robinson Crusoé: roupa de folhas, bota marrom e um chapéu de palha trançado com a palha de um vulcão antigo. O vulcão adotou o náufrago, e o chapéu carrega um pouco do fogo dele.",
    imagem: {
      src: "robinho/tpose.webp",
      alt: "Robinho em T-pose, de roupa de folhas e chapéu de palha",
      w: 800,
      h: 800,
      legenda: "A pose de referência do personagem.",
    },
  },
  {
    icon: LayersTwo,
    titulo: "Folhas de sprites em fundo magenta",
    texto:
      "A IA desenha folhas inteiras de personagens, perigos e cenário sobre um fundo magenta. Um script recorta cada desenho pela cor-chave, alinha pelos pés e monta as animações. Trocar uma folha é rodar o script de novo.",
    duplo: true,
  },
  {
    icon: Map,
    titulo: "Um mundo que nunca se repete",
    texto:
      "Cada ilha tem 5 segmentos de 3.000 px ligados pelo chão e nasce de novo a cada partida. Antes de aceitar uma fase, um verificador simula o pulo real do Robinho (gravidade, pulo curto, cabeça e paredes) e só deixa passar se a saída, todos os itens, os inimigos e o baú forem alcançáveis. Aqui embaixo está uma versão em miniatura do mesmo raciocínio.",
    gerador: true,
  },
  {
    icon: Fire,
    titulo: "Fogo com peso",
    texto:
      "A bola de fogo deixa rastro de brasas, a explosão tem clarão, faíscas e anel de choque, e a tela treme no disparo carregado e no dano. Efeitos suaves e brilhantes por cima do pixel art, para cada ação ter peso.",
  },
  {
    icon: VolumeHigh,
    titulo: "Trilha e sons",
    texto:
      "A música da selva é a “Jungle Quest 16-Bit”. Vitória, impacto e trovão vêm de um pacote de efeitos; o disparo, o tique da carga e o tremor das plataformas são sintetizados no próprio projeto.",
  },
  {
    icon: Package,
    titulo: "Do Godot ao navegador",
    texto:
      "O jogo é exportado para web e roda direto na página, sem instalar nada. O preço é o peso: cerca de 90 MB na primeira carga.",
  },
];

function Sprite({ id, nome, n }: { id: string; nome: string; n: number }) {
  return (
    <div className="group rounded-3xl border border-border bg-surface p-2 pb-4 text-center transition-transform duration-300 hover:-translate-y-2">
      <div
        className="mx-auto rounded-2xl"
        style={{ backgroundColor: `${GREEN}22`, width: 160 }}
      >
        <div
          className="rb-sprite"
          role="img"
          aria-label={`Robinho animado: ${nome}`}
          style={
            {
              backgroundImage: `url(${labAsset(`robinho/reel-${id}.webp`)})`,
              "--rb-n": n,
              "--rb-dur": `${(n / 24).toFixed(2)}s`,
            } as React.CSSProperties
          }
        />
      </div>
      <p className="mt-3 text-lg font-black text-navy">{nome}</p>
    </div>
  );
}

export default function RobinhoNaSelvaPage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div
            className="absolute -right-20 top-0 h-96 w-96 rounded-full blur-[120px]"
            style={{ backgroundColor: `${ORANGE}33` }}
          />
          <div
            className="absolute -left-24 bottom-0 h-80 w-80 rounded-full blur-[110px]"
            style={{ backgroundColor: `${GREEN}30` }}
          />
        </div>
        <div className="relative z-10 mx-auto grid max-w-5xl gap-10 px-6 pb-16 pt-12 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:pt-20">
          <div>
            <Link
              href="/ai-lab"
              className="animate-fade-up flex w-fit items-center gap-1.5 text-sm font-bold text-slate transition-colors hover:text-coral"
            >
              <ArrowLeft size={16} /> AI Lab
            </Link>
            <p
              className="animate-fade-up mt-6 inline-block rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider text-black"
              style={{ backgroundColor: ORANGE, animationDelay: "0.05s" }}
            >
              Projeto pessoal
            </p>
            <h1
              className="animate-fade-up mt-4 text-5xl font-black leading-[1.02] text-navy sm:text-7xl"
              style={{ animationDelay: "0.1s" }}
            >
              Robinho <span style={{ color: ORANGE }}>na Selva</span>
            </h1>
            <p
              className="animate-fade-up mt-5 max-w-md text-lg text-slate"
              style={{ animationDelay: "0.2s" }}
            >
              Um náufrago simpático, um chapéu de palha que solta fogo como um
              vulcão e um arquipélago para reacender. Cada partida gera uma ilha
              nova.
            </p>
            <div
              className="animate-fade-up mt-8 flex flex-wrap gap-3"
              style={{ animationDelay: "0.3s" }}
            >
              <a
                href="#jogar"
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-black transition-transform hover:scale-105"
                style={{ backgroundColor: ORANGE }}
              >
                <Play size={18} /> Jogar agora
              </a>
              <a
                href={GAME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-bold text-navy transition-colors hover:border-coral hover:text-coral"
              >
                Tela cheia <ArrowUpRight size={18} />
              </a>
            </div>
          </div>

          <div
            className="animate-fade-up relative"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="aspect-video overflow-hidden rounded-3xl border border-border shadow-[0_30px_80px_-30px_rgba(245,167,66,0.45)]">
              <video
                src={labAsset("robinho/clipe.mp4")}
                poster={labAsset("robinho/jogo-1.webp")}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            </div>
            <Image
              src={labAsset("robinho/robinho-parado.webp")}
              alt=""
              width={180}
              height={180}
              aria-hidden
              className="lab-float pointer-events-none absolute -bottom-10 -left-6 h-24 w-auto sm:h-32"
              style={{ "--lab-rot": "-4deg" } as React.CSSProperties}
            />
          </div>
        </div>
      </section>

      {/* Números */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 py-10 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <p className="text-5xl font-black" style={{ color: ORANGE }}>
                <Counter value={s.value} />
              </p>
              <p className="mt-1 text-sm text-slate">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Ficha técnica */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-5xl gap-4 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Gênero",
              valor: "Plataforma 2D de ação, com progressão leve",
            },
            {
              label: "Plataforma",
              valor: "Navegador (versão web), feito em Godot 4.7",
            },
            { label: "Controles", valor: "Teclado ou controle" },
          ].map((item, i) => (
            <Reveal key={item.label} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-border bg-surface p-5">
                <p className="text-sm text-gray">{item.label}</p>
                <p className="mt-1 font-bold text-navy">{item.valor}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.18}>
            <div className="h-full rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm text-gray">Ferramentas</p>
              <p className="mt-2 flex flex-wrap gap-1.5">
                {FERRAMENTAS.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-2.5 py-1 text-xs font-bold text-navy"
                  >
                    {t}
                  </span>
                ))}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Jogar */}
      <section id="jogar" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-16">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-widest text-coral">
            Jogue agora
          </p>
          <h2 className="mt-2 text-3xl font-black text-navy sm:text-4xl">
            Sem baixar nada, direto no navegador
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-8">
          <JogoEmbed src={GAME_URL} cover="/ai-lab/robinho/cover.webp" />
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="grid gap-3 sm:grid-cols-2">
            {CONTROLES.map((c) => (
              <div
                key={c.acao}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4"
              >
                <span className="flex items-center gap-2 text-sm text-slate">
                  <Keyboard size={16} className="shrink-0 text-gray" />
                  {c.acao}
                </span>
                <span className="flex flex-wrap gap-1.5">
                  {c.teclas.map((t) => (
                    <kbd
                      key={t}
                      className="rounded-lg border border-border border-b-4 bg-bg px-2.5 py-1 text-xs font-black text-navy"
                    >
                      {t}
                    </kbd>
                  ))}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray">
            Também funciona com controle: analógico para andar, A para pular e X
            para o fogo.
          </p>
        </Reveal>
      </section>

      {/* História */}
      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-coral">
              A história
            </p>
            <h2 className="mt-2 text-3xl font-black text-navy sm:text-4xl">
              Reacender os vulcões do arquipélago
            </h2>
            <p className="mt-4 text-slate">
              Depois de um naufrágio, Robinho acorda na Ilha da Selva e é
              acolhido pelo Vulcão Velho, um vulcão sábio e sonolento. Cada ilha
              tem um vulcão-coração que mantém a natureza viva, e uma névoa fria
              está apagando todos eles.
            </p>
            <p className="mt-3 text-slate">
              Em cada ilha, ele abre o baú que guarda uma brasa e a devolve ao
              coração do vulcão. Quando a chama volta, a ilha se colore de novo.
              E se ele cair, o Vulcão Velho sempre o devolve à praia, como uma
              faísca que não se apaga: o que juntou fica, e ele volta mais
              forte.
            </p>
            <p className="mt-3 rounded-2xl border border-dashed border-border p-4 text-sm text-gray">
              A história completa ainda é uma proposta de design. O que está
              jogável hoje é a Ilha da Selva.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div
              className="rounded-3xl border border-border p-6 text-center"
              style={{ backgroundColor: `${ORANGE}14` }}
            >
              <Image
                src={labAsset("robinho/tpose.webp")}
                alt="Robinho em T-pose"
                width={800}
                height={800}
                sizes="(min-width: 1024px) 400px, 80vw"
                className="mx-auto h-auto w-full max-w-[340px] rounded-2xl"
              />
              <p className="mt-3 text-sm text-slate">
                Baixinho, otimista e teimoso. Comemora cada conquista, se
                assusta fácil e cochila quando fica parado.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Animações */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-widest text-coral">
            Ele reage a tudo
          </p>
          <h2 className="mt-2 text-3xl font-black text-navy sm:text-4xl">
            Os quadros do Robinho, em movimento
          </h2>
          <p className="mt-3 max-w-xl text-slate">
            Os mesmos quadros e a mesma velocidade do jogo. Além destes, ele
            ainda carrega o disparo, tomba, senta e dorme: quando fica parado,
            não demora a cochilar.
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ANIMACOES.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.08}>
              <Sprite id={a.id} nome={a.nome} n={a.n} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Poderes */}
      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-coral">
              O chapéu
            </p>
            <h2 className="mt-2 text-3xl font-black text-navy sm:text-4xl">
              O vulcão na cabeça é a arma
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <div
                className="flex h-full flex-col items-center justify-center rounded-3xl border border-border p-8 text-center"
                style={{ backgroundColor: `${ORANGE}14` }}
              >
                <Image
                  src={labAsset("robinho/bola.webp")}
                  alt="Bola de fogo do Robinho"
                  width={160}
                  height={160}
                  className="lab-float h-28 w-28 object-contain"
                />
                <p className="mt-4 text-xl font-black text-navy">
                  Fogo que explode
                </p>
                <p className="mt-1 text-sm text-slate">
                  Em arco, com rastro de brasas e clarão no acerto.
                </p>
              </div>
            </Reveal>
            <div className="grid gap-3">
              {PODERES.map((p, i) => (
                <Reveal key={p.nome} delay={i * 0.06}>
                  <div className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-4">
                    <span
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-black"
                      style={{
                        backgroundColor:
                          p.estado === "No jogo" ? ORANGE : "#e5e7eb",
                      }}
                    >
                      <Zap size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-2 font-black text-navy">
                        {p.nome}
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider"
                          style={
                            p.estado === "No jogo"
                              ? {
                                  backgroundColor: GREEN,
                                  color: "#0b1f0a",
                                }
                              : { backgroundColor: "#e5e7eb", color: "#4b5563" }
                          }
                        >
                          {p.estado}
                        </span>
                      </p>
                      <p className="mt-0.5 text-sm text-slate">{p.texto}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Inimigos */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-widest text-coral">
            Quem atrapalha
          </p>
          <h2 className="mt-2 text-3xl font-black text-navy sm:text-4xl">
            Cada perigo tem um jeito de agir
          </h2>
          <p className="mt-3 max-w-xl text-slate">
            O jogador reconhece o inimigo pelo comportamento, não só pela cara:
            quem anda, quem atira, quem brota do chão. Uma bola de fogo derrota
            cada um da Selva.
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {INIMIGOS.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.08}>
              <div className="group h-full rounded-3xl border border-border bg-surface p-4 text-center transition-transform duration-300 hover:-translate-y-2">
                <div
                  className="flex h-36 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${GREEN}1f` }}
                >
                  <Image
                    src={labAsset(`robinho/${e.id}.webp`)}
                    alt={e.nome}
                    width={200}
                    height={200}
                    className="h-28 w-auto object-contain transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                  />
                </div>
                <p className="mt-3 font-black text-navy">{e.nome}</p>
                <p
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: ORANGE }}
                >
                  {e.papel}
                </p>
                <p className="mt-2 text-sm text-slate">{e.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Como foi */}
      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-coral">
              Como foi
            </p>
            <h2 className="mt-2 text-3xl font-black text-navy sm:text-4xl">
              Da ideia ao navegador, passo a passo
            </h2>
          </Reveal>

          <ol className="relative mt-12 space-y-10 border-l border-border pl-8 sm:pl-12">
            {PASSOS.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={s.titulo} className="relative">
                  <Reveal delay={0.05}>
                    <span
                      className="absolute -left-[calc(2rem+21px)] top-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-bg text-black sm:-left-[calc(3rem+21px)]"
                      style={{ backgroundColor: ORANGE }}
                    >
                      <Icon size={20} />
                    </span>
                    <div className="rounded-3xl border border-border bg-surface p-6">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray">
                        Passo {i + 1}
                      </p>
                      <h3 className="mt-1 text-2xl font-black text-navy">
                        {s.titulo}
                      </h3>
                      <p className="mt-2 max-w-xl text-slate">{s.texto}</p>

                      {s.imagem && (
                        <figure className="mt-5">
                          <div className="overflow-hidden rounded-2xl border border-border">
                            <Image
                              src={labAsset(s.imagem.src)}
                              alt={s.imagem.alt}
                              width={s.imagem.w}
                              height={s.imagem.h}
                              sizes="(min-width: 768px) 640px, 100vw"
                              className={`h-auto transition-transform duration-700 hover:scale-[1.03] ${
                                s.imagem.w === s.imagem.h
                                  ? "mx-auto w-full max-w-sm"
                                  : "w-full"
                              }`}
                            />
                          </div>
                          <figcaption className="mt-2 text-xs text-gray">
                            {s.imagem.legenda}
                          </figcaption>
                        </figure>
                      )}

                      {s.duplo && (
                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                          <figure>
                            <div className="overflow-hidden rounded-2xl border border-border">
                              <Image
                                src={labAsset("robinho/folha-magenta.webp")}
                                alt="Folha de perigos desenhada pela IA sobre fundo magenta"
                                width={1400}
                                height={700}
                                sizes="(min-width: 768px) 320px, 100vw"
                                className="h-auto w-full"
                              />
                            </div>
                            <figcaption className="mt-2 text-xs text-gray">
                              1. A folha, desenhada sobre magenta.
                            </figcaption>
                          </figure>
                          <figure>
                            <div className="overflow-hidden rounded-2xl border border-border">
                              <Image
                                src={labAsset("robinho/folha-recorte.webp")}
                                alt="A mesma folha com cada desenho numerado pelo script de recorte"
                                width={1400}
                                height={700}
                                sizes="(min-width: 768px) 320px, 100vw"
                                className="h-auto w-full"
                              />
                            </div>
                            <figcaption className="mt-2 text-xs text-gray">
                              2. O script recorta e numera cada desenho.
                            </figcaption>
                          </figure>
                        </div>
                      )}

                      {s.gerador && (
                        <div className="mt-6">
                          <GeradorIlha />
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

      {/* Fotos do jogo */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-widest text-coral">
            De dentro do jogo
          </p>
          <h2 className="mt-2 text-3xl font-black text-navy sm:text-4xl">
            Três momentos de uma partida
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((n, i) => (
            <Reveal key={n} delay={i * 0.1}>
              <div className="overflow-hidden rounded-2xl border border-border">
                <Image
                  src={labAsset(`robinho/jogo-${n}.webp`)}
                  alt={`Captura de tela ${n} do Robinho na Selva`}
                  width={1280}
                  height={720}
                  sizes="(min-width: 768px) 320px, 100vw"
                  className="h-auto w-full transition-transform duration-700 hover:scale-[1.05]"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Ilhas */}
      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-coral">
              O arquipélago
            </p>
            <h2 className="mt-2 text-3xl font-black text-navy sm:text-4xl">
              Cinco ilhas planejadas, uma já jogável
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {ILHAS.map((ilha, i) => (
              <Reveal key={ilha.n} delay={i * 0.07}>
                <div
                  className="h-full rounded-3xl border p-5"
                  style={{
                    borderColor: ilha.pronta ? ilha.cor : "var(--color-border)",
                    backgroundColor: ilha.pronta
                      ? `${ilha.cor}22`
                      : "transparent",
                  }}
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-black text-black"
                    style={{
                      backgroundColor: ilha.cor,
                      opacity: ilha.pronta ? 1 : 0.55,
                    }}
                  >
                    {ilha.n}
                  </span>
                  <p className="mt-3 font-black text-navy">{ilha.nome}</p>
                  <p className="mt-1 text-sm text-slate">{ilha.tema}</p>
                  <p
                    className="mt-3 text-[10px] font-black uppercase tracking-wider"
                    style={{ color: ilha.pronta ? GREEN : "#9ca3af" }}
                  >
                    {ilha.pronta ? "Jogável" : "Em projeto"}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Estado do protótipo */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-widest text-coral">
            Onde está
          </p>
          <h2 className="mt-2 text-3xl font-black text-navy sm:text-4xl">
            O que já roda e o que ainda falta
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-border bg-surface p-6">
              <p className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-navy">
                <Search size={16} className="text-coral" /> Já roda
              </p>
              <ul className="mt-4 space-y-3">
                {PRONTO.map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-2 text-sm text-slate"
                  >
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-black"
                      style={{ backgroundColor: GREEN }}
                    >
                      <Check size={12} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-3xl border border-dashed border-border p-6">
              <p className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-navy">
                <Map size={16} className="text-coral" /> Falta
              </p>
              <ul className="mt-4 space-y-3">
                {FALTA.map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-2 text-sm text-slate"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gray/50" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Fechamento */}
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-4 text-center">
        <Reveal>
          <Image
            src={labAsset("robinho/robinho-parado.webp")}
            alt=""
            width={160}
            height={160}
            aria-hidden
            className="lab-float mx-auto h-28 w-auto"
          />
          <h2 className="mt-4 text-4xl font-black text-navy sm:text-5xl">
            Bora reacender uma ilha?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-slate">
            Sem cadastro e sem anúncios. Abre, joga e, se cair, a ilha é outra.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#jogar"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-bold text-black transition-transform hover:scale-105"
              style={{ backgroundColor: ORANGE }}
            >
              <Play size={18} /> Jogar Robinho na Selva
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
