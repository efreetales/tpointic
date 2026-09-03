import Link from "next/link";
import type { Metadata } from "next";
import { getCursoBySlug, getTurmaAberta } from "@/lib/turmas";
import { MatriculaForm } from "./form";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Matrícula — Os 5 Fundamentos do Design Thinking",
};

export default async function MatriculaPage() {
  const curso = await getCursoBySlug("design-thinking-5-fundamentos");
  const turma = curso ? await getTurmaAberta(curso.id) : null;

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 py-16">
      <Link
        href="/treinamentos/design-thinking-5-fundamentos"
        className="text-sm font-bold text-coral"
      >
        ← Voltar para o curso
      </Link>

      <h1 className="mt-6 text-3xl font-black text-navy">Matrícula</h1>
      <p className="mt-2 text-slate">
        Os 5 Fundamentos do Design Thinking
      </p>

      <Reveal delay={0.1}>
        <div className="mt-8">
          {!curso || !turma ? (
            <div className="rounded-2xl border border-border bg-surface p-6 text-navy">
              <p className="font-bold">Aguardando nova turma</p>
              <p className="mt-2 text-sm text-slate">
                As matrículas para a próxima turma ainda não abriram. Deixe seu
                e-mail em contato que avisamos assim que abrir.
              </p>
              <Link
                href="/contato"
                className="mt-4 inline-block rounded-full bg-coral px-5 py-2 text-sm font-bold text-black transition-transform hover:scale-105"
              >
                Avise-me
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-6 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-slate">
                <strong className="text-navy">{turma.nome}</strong>
                <br />
                {new Date(turma.data_aula).toLocaleString("pt-BR", {
                  dateStyle: "long",
                  timeStyle: "short",
                  timeZone: "America/Sao_Paulo",
                })}
              </p>
              <MatriculaForm turmaId={turma.id} />
            </>
          )}
        </div>
      </Reveal>
    </main>
  );
}
