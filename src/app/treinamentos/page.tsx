import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Treinamentos — TPointic",
  description:
    "Masterclass Os 5 Fundamentos do Design Thinking, com Tales Pereira.",
};

export default function TreinamentosPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <p className="text-sm font-bold uppercase tracking-widest text-coral">
        Treinamentos
      </p>
      <h1 className="mt-2 text-4xl font-black text-navy">Cursos</h1>

      <Link
        href="/treinamentos/design-thinking-5-fundamentos"
        className="mt-10 block rounded-2xl border border-border bg-white p-6 transition-shadow hover:shadow-lg"
      >
        <h2 className="text-xl font-black text-navy">
          Os 5 Fundamentos do Design Thinking
        </h2>
        <p className="mt-2 text-sm text-slate">
          Masterclass ao vivo, online e colaborativa, com apoio de agentes de
          IA. Pague quanto quiser (R$5 a R$500) — sem taxa de cancelamento e
          com certificado digital.
        </p>
        <span className="mt-4 inline-block text-sm font-bold text-coral">
          Ver curso →
        </span>
      </Link>
    </main>
  );
}
