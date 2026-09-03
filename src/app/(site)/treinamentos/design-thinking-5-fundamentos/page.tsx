import Link from "next/link";
import type { Metadata } from "next";
import { getCursoBySlug, getTurmaAberta } from "@/lib/turmas";
import { Reveal } from "@/components/reveal";
import {
  ArrowUpRight,
  CheckCircle,
  Compass,
  Heart,
  Users,
  Sparkles,
  Rocket,
} from "@mynaui/icons-react";

export const metadata: Metadata = {
  title: "Os 5 Fundamentos do Design Thinking — TPointic",
  description:
    "Masterclass ao vivo, online e colaborativa com Tales Pereira. Pague quanto quiser.",
};

const FUNDAMENTOS = [
  {
    icon: Compass,
    title: "Pensamento Flexível",
    description: "Questione suposições e recombine ideias com agilidade.",
  },
  {
    icon: Heart,
    title: "Empatia",
    description: "O design começa e termina no ser humano.",
  },
  {
    icon: Users,
    title: "Cooperação",
    description: "Inteligência coletiva: construir com times diversos.",
  },
  {
    icon: Sparkles,
    title: "Imaginação",
    description: "Ideias radicais hoje são produtos de amanhã.",
  },
  {
    icon: Rocket,
    title: "Experimentação",
    description: "Prototipar rápido, testar cedo, aprender com falhas.",
  },
];

export default async function CursoDesignThinkingPage() {
  const curso = await getCursoBySlug("design-thinking-5-fundamentos");
  const turma = curso ? await getTurmaAberta(curso.id) : null;

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden">
        <div className="hero-gradient absolute inset-0 opacity-20" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-start px-6 py-16 text-left">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-coral">
              Masterclass
            </p>
            <h1 className="mt-2 text-4xl font-black text-navy sm:text-5xl">
              Os 5 Fundamentos do Design Thinking
            </h1>
            <p className="mt-4 text-lg text-slate">
              Formato ao vivo, online e colaborativo, com apoio de agentes de IA.
              Pague quanto quiser — de R$5 a R$500.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-slate">
              <span className="flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1">
                <CheckCircle size={14} className="text-coral" /> Sem taxa de
                cancelamento
              </span>
              <span className="flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1">
                <CheckCircle size={14} className="text-coral" /> Certificado
                digital
              </span>
            </div>

            <Link
              href={
                turma
                  ? "/treinamentos/design-thinking-5-fundamentos/matricula"
                  : "#matricula"
              }
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
            >
              {turma ? "Garantir minha vaga" : "Ver próxima turma"}
              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border bg-surface/30">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <Reveal>
            <h2 className="text-2xl font-black text-navy">Os 5 fundamentos</h2>
          </Reveal>
          <div className="mt-8 space-y-6">
            {FUNDAMENTOS.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-coral">
                    <f.icon size={20} />
                  </span>
                  <div>
                    <h3 className="font-bold text-navy">{f.title}</h3>
                    <p className="text-sm text-slate">{f.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <h2 className="text-2xl font-black text-navy">Instrutor</h2>
          <p className="mt-4 text-navy">
            <strong>Tales Pereira</strong> — Gestor de Design, Service Designer
            e UX Researcher com mais de 15 anos de experiência em UX, Produto e
            Liderança. Passagem por Mercado Livre, UOL, CI&amp;T, Vivo,
            Carrefour, SulAmérica, Dasa, RD/Drogasil, Rakuten, Casas Bahia,
            Cofco e Mercado Pago.
          </p>
          <Link
            href="/sobre"
            className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-coral"
          >
            Conheça mais sobre o Tales <ArrowUpRight size={16} />
          </Link>
        </Reveal>
      </section>

      <section
        id="matricula"
        className="border-t border-border bg-surface/30 px-6 py-16 text-center"
      >
        <Reveal>
          {turma ? (
            <>
              <p className="text-sm font-bold text-slate">
                Próxima turma: {turma.nome}
              </p>
              <Link
                href="/treinamentos/design-thinking-5-fundamentos/matricula"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
              >
                Garantir minha vaga <ArrowUpRight size={18} />
              </Link>
            </>
          ) : (
            <>
              <p className="font-bold text-navy">Aguardando nova turma</p>
              <p className="mt-2 text-sm text-slate">
                As matrículas ainda não abriram para a próxima turma.
              </p>
              <Link
                href="/contato"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
              >
                Avise-me quando abrir <ArrowUpRight size={18} />
              </Link>
            </>
          )}
        </Reveal>
      </section>
    </main>
  );
}
