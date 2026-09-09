import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  Heart,
  Users,
  Star,
  TrendingUp,
  CheckCircle,
} from "@mynaui/icons-react";
import { Reveal } from "@/components/reveal";
import { Counter } from "@/components/counter";
import { StatRing } from "@/components/stat-ring";
import { AnimatedBar } from "@/components/animated-bar";

export const metadata: Metadata = {
  title: "Liderança — TPointic",
  description:
    "Como Tales Pereira liderou 8 designers no Mercado Livre a 92% de engajamento e 88% de excelência no Check Survey 2023.",
};

const PILARES = [
  {
    icon: Heart,
    title: "Promover Diversidade",
    items: [
      "3 contratações afirmativas LGBTQIA+",
      "Minidoc sobre maternidade · Painel sobre LGBT",
      'Palestra "Como ser um aliado LGBT"',
      "Embaixador do comitê de diversidade",
    ],
  },
  {
    icon: Users,
    title: "Equipe engajada e saudável",
    items: [
      "1:1 semanal com cada designer",
      "Feedbacks constantes e team-builds",
      "Autonomia e segurança psicológica",
    ],
  },
  {
    icon: Star,
    title: "Elevar a qualidade",
    items: [
      "Workshops: psicologia aplicada ao design",
      "Feedback efetivo · Personas colaborativas",
      "A importância dos devs na concepção",
      "Design Critiques periódicos",
    ],
  },
  {
    icon: TrendingUp,
    title: "Promover o valor do Design",
    items: [
      "Conectar design a métricas de produto com os POs",
      "Espaços para o time divulgar seu trabalho",
      "Cases com resultados para stakeholders",
      "Bootcamp Mercado Livre — professor e mentor",
    ],
  },
];

const ACOES = [
  {
    title: "1:1 semanais",
    description:
      "Cadência semanal com cada designer: iniciativas, objetivos pessoais, bloqueios e percepção do ambiente. Insights que alimentavam PDIs e ações coletivas.",
    resultado: "100% líder acessível",
  },
  {
    title: "Feedback contínuo",
    description:
      "Modelo SBI (Situação, Comportamento, Impacto) tornando feedbacks concretos e acionáveis, fora dos ciclos formais.",
    resultado: "100% feedback efetivo",
  },
  {
    title: "Backlog co-construído",
    description:
      'Planejamento feito com — não para — o time. Roadmap compartilhado, garantindo o "porquê" de cada história.',
    resultado: "Objetivos conectados à visão Meli",
  },
  {
    title: "Qualificação por gaps reais",
    description:
      "Workshops mapeados a partir dos PDIs e 1:1s: psicologia aplicada ao design, feedback efetivo, personas colaborativas.",
    resultado: "100% líder eleva o nível da equipe",
  },
  {
    title: "Segurança psicológica",
    description:
      "Como embaixador de diversidade, criação intencional de espaços onde todos podiam se expressar — maternidade, LGBTQIA+, escuta ativa.",
    resultado: "100% ambiente de bem-estar",
  },
  {
    title: "Design Critiques",
    description:
      "Rituais periódicos e estruturados para o time apresentar e receber feedback sobre o próprio trabalho.",
    resultado: "Qualidade e colaboração",
  },
  {
    title: "Visibilidade de impacto",
    description:
      "Trabalho junto aos POs para associar cada iniciativa a métricas mensuráveis, e espaços internos para o time apresentar resultados a stakeholders.",
    resultado: "92% engagement geral",
  },
];

// Pontos fortes reais do Check Survey 2023 (5 respostas da equipe direta) —
// `delta` é a variação frente à edição anterior, exatamente como reportado
// na ferramenta (screenshot do relatório real, não estimado).
const FORCAS = [
  { label: "Dinâmicas refletem cultura Meli", valor: "100%", delta: "+12" },
  { label: "Alcance de objetivos com eficiência", valor: "100%", delta: "+13" },
  { label: "Coordenação efetiva de projetos", valor: "100%", delta: "+13" },
  { label: "Líder eleva nível da equipe", valor: "100%", delta: "+10" },
  { label: "Ambiente promove bem-estar", valor: "100%", delta: "+13" },
  { label: "Líder acessível", valor: "100%", delta: "+7" },
  { label: "Feedbacks recorrentes e efetivos", valor: "100%", delta: "+13" },
  { label: "Líder motiva a inovar", valor: "100%", delta: "+12" },
  { label: "Objetivos conectados à visão Meli", valor: "100%", delta: "+8" },
];

const DEPOIMENTOS = [
  {
    quote:
      "Tales es una gran profesional que se destaca por su agilidad en resolver desafíos y apoyar a sus equipos de trabajo, generando ambientes comprometidos y proactivos.",
    name: "Laura Molina Castilla",
    role: "UI/UX Sr. Designer · Mercado Libre",
  },
  {
    quote:
      "Su conocimiento en procesos y estrategia de UX, junto con su habilidad para liderar equipos, realmente destacan.",
    name: "Camilo Luna",
    role: "UX Project Lead · Mercado Libre",
  },
  {
    quote:
      "Devo enaltecer sua capacidade de resolver problemas complexos com um sorriso no rosto, sempre buscando colaboração e crescimento de todos.",
    name: "Gabriel Gonzaga",
    role: "Líder de UX · Mercado Livre",
  },
];

export default function LiderancaPage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-gradient absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-3xl px-6 py-20 sm:py-28">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-coral">
              Case de Liderança · Check Survey 2023
            </p>
            <h1 className="mt-2 text-5xl font-black leading-[1.05] text-navy sm:text-7xl">
              Liderança que gera engajamento de verdade
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate">
              Como conduzi 8 designers no Mercado Livre a 92% de engajamento e
              88% de excelência — e as ações concretas por trás desses
              números.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-slate">
              {["Mercado Livre", "8 designers", "UX Project Lead", "Jan 2022 – Jan 2024"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-start justify-center gap-6 sm:justify-start">
              <div className="rounded-2xl border border-white/15 bg-white/5 px-8 py-6 backdrop-blur-sm">
                <StatRing value="92%" percent={92} label="Engagement" />
                <p className="mt-1 text-center text-xs font-bold text-emerald-400">▲ 4 vs. edição anterior</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 px-8 py-6 backdrop-blur-sm">
                <StatRing value="88%" percent={88} label="Excelência (EXE)" />
                <p className="mt-1 text-center text-xs font-bold text-emerald-400">▲ 2 vs. edição anterior</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Missão / pilares */}
      <section className="border-t border-border bg-surface/30 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-coral">
              Missão como líder
            </p>
            <h2 className="mt-2 text-3xl font-black text-navy">
              Meus quatro pilares
            </h2>
            <p className="mt-3 max-w-xl text-slate">
              &ldquo;Garantir um ambiente diverso, engajado e de qualidade,
              onde as pessoas possam se desenvolver com saúde, confiança e
              respeito.&rdquo;
            </p>
          </Reveal>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {PILARES.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
                  <p.icon size={26} className="text-coral" />
                  <h3 className="mt-3 font-bold text-navy">{p.title}</h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-slate">
                    {p.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Resultados */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-coral">
              Resultados
            </p>
            <h2 className="mt-2 text-3xl font-black text-navy">
              Check Survey 2023 — números reais
            </h2>
            <p className="mt-3 text-slate">
              Avaliação semestral anônima do Mercado Livre, respondida pela
              própria equipe direta sobre a liderança recebida (5 respostas).
            </p>
          </Reveal>

          <div className="mt-8 space-y-3">
            {FORCAS.map((f, i) => (
              <Reveal key={f.label} delay={i * 0.05}>
                <div className="rounded-xl border border-white/15 bg-white/5 px-5 py-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold text-navy">
                      <CheckCircle size={16} className="text-coral" />
                      {f.label}
                    </span>
                    <span className="flex items-baseline gap-2">
                      <span className="font-black text-coral">
                        <Counter value={f.valor} />
                      </span>
                      <span className="text-xs font-bold text-emerald-400">{f.delta}</span>
                    </span>
                  </div>
                  <div className="mt-3">
                    <AnimatedBar percent={parseInt(f.valor, 10)} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Ações */}
      <section className="border-t border-border bg-surface/30 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-coral">
              Como cheguei lá
            </p>
            <h2 className="mt-2 text-3xl font-black text-navy">
              As ações por trás dos números
            </h2>
          </Reveal>

          <div className="mt-8 space-y-4">
            {ACOES.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.05}>
                <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
                  <h3 className="font-bold text-navy">{a.title}</h3>
                  <p className="mt-2 text-sm text-slate">{a.description}</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-widest text-coral">
                    ↑ {a.resultado}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-coral">
              Depoimentos
            </p>
            <h2 className="mt-2 text-3xl font-black text-navy">
              O que dizem meus liderados
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {DEPOIMENTOS.map((d, i) => (
              <Reveal key={d.name} delay={i * 0.08}>
                <blockquote className="h-full rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
                  <p className="text-sm text-slate">&ldquo;{d.quote}&rdquo;</p>
                  <footer className="mt-4 text-sm font-bold text-navy">
                    {d.name}
                    <span className="block font-normal text-gray">
                      {d.role}
                    </span>
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-6 py-16 text-center">
        <Reveal>
          <p className="font-bold text-navy">
            Quer conversar sobre liderança de times de design?
          </p>
          <Link
            href="/contato"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
          >
            Vamos conversar <ArrowUpRight size={18} />
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
