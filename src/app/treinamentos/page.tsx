import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Treinamentos — TPointic",
  description: "Masterclass Os 5 Fundamentos do Design Thinking, com Tales Pereira.",
};

export default function TreinamentosPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start px-6 py-16">
      <p className="text-sm font-bold uppercase tracking-widest text-coral">
        Treinamentos
      </p>
      <h1 className="mt-2 text-4xl font-black text-navy">
        Os 5 Fundamentos do Design Thinking
      </h1>
      <p className="mt-4 text-lg text-slate">
        Masterclass ao vivo, online e colaborativa, com apoio de agentes de
        IA. Pague quanto quiser (R$5 a R$500) — sem taxa de cancelamento e com
        certificado digital.
      </p>
      <ul className="mt-8 space-y-2 text-navy">
        <li>1. Pensamento Flexível</li>
        <li>2. Empatia</li>
        <li>3. Cooperação</li>
        <li>4. Imaginação</li>
        <li>5. Experimentação</li>
      </ul>
      <p className="mt-8 rounded-2xl border border-border bg-white px-5 py-4 text-sm text-slate">
        Matrículas abrindo em breve — a landing completa e o formulário de
        inscrição chegam na próxima fase do site.
      </p>
    </main>
  );
}
