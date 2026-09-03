import Link from "next/link";
import type { Metadata } from "next";
import { getCursoBySlug, getTurmaAberta } from "@/lib/turmas";

export const metadata: Metadata = {
  title: "Os 5 Fundamentos do Design Thinking — TPointic",
  description:
    "Masterclass ao vivo, online e colaborativa com Tales Pereira. Pague quanto quiser.",
};

const FUNDAMENTOS = [
  {
    title: "Pensamento Flexível",
    description: "Questione suposições e recombine ideias com agilidade.",
  },
  {
    title: "Empatia",
    description: "O design começa e termina no ser humano.",
  },
  {
    title: "Cooperação",
    description: "Inteligência coletiva: construir com times diversos.",
  },
  {
    title: "Imaginação",
    description: "Ideias radicais hoje são produtos de amanhã.",
  },
  {
    title: "Experimentação",
    description: "Prototipar rápido, testar cedo, aprender com falhas.",
  },
];

export default async function CursoDesignThinkingPage() {
  const curso = await getCursoBySlug("design-thinking-5-fundamentos");
  const turma = curso ? await getTurmaAberta(curso.id) : null;

  return (
    <main className="flex-1">
      <section className="mx-auto flex max-w-3xl flex-col items-start px-6 py-16 text-left">
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
          <span className="rounded-full border border-border bg-white px-3 py-1">
            Sem taxa de cancelamento
          </span>
          <span className="rounded-full border border-border bg-white px-3 py-1">
            Certificado digital
          </span>
        </div>

        <Link
          href={
            turma
              ? "/treinamentos/design-thinking-5-fundamentos/matricula"
              : "#matricula"
          }
          className="mt-8 rounded-full bg-coral px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-peach"
        >
          {turma ? "Garantir minha vaga" : "Ver próxima turma"}
        </Link>
      </section>

      <section className="border-t border-border bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-2xl font-black text-navy">Os 5 fundamentos</h2>
          <div className="mt-8 space-y-6">
            {FUNDAMENTOS.map((f, i) => (
              <div key={f.title} className="flex gap-4">
                <span className="text-2xl font-black text-coral">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-navy">{f.title}</h3>
                  <p className="text-sm text-slate">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
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
          className="mt-3 inline-block text-sm font-bold text-coral"
        >
          Conheça mais sobre o Tales →
        </Link>
      </section>

      <section
        id="matricula"
        className="border-t border-border bg-white px-6 py-16 text-center"
      >
        {turma ? (
          <>
            <p className="text-sm font-bold text-slate">
              Próxima turma: {turma.nome}
            </p>
            <Link
              href="/treinamentos/design-thinking-5-fundamentos/matricula"
              className="mt-4 inline-block rounded-full bg-coral px-6 py-3 text-sm font-bold text-white hover:bg-peach"
            >
              Garantir minha vaga
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
              className="mt-4 inline-block rounded-full bg-coral px-6 py-3 text-sm font-bold text-white hover:bg-peach"
            >
              Avise-me quando abrir
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
