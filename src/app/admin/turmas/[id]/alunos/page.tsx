import Link from "next/link";
import { notFound } from "next/navigation";
import { getTurmaAdmin, getMatriculasDaTurma } from "@/lib/admin";

type Props = { params: Promise<{ id: string }> };

export default async function AdminTurmaAlunosPage({ params }: Props) {
  const { id } = await params;
  const turma = await getTurmaAdmin(id);
  if (!turma) notFound();

  const matriculas = await getMatriculasDaTurma(id);

  return (
    <div>
      <Link href={`/admin/turmas/${id}`} className="text-sm font-bold text-coral">
        ← Voltar para a turma
      </Link>

      <h1 className="mt-4 text-3xl font-black text-navy">
        Alunos — {turma.nome}
      </h1>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-gray">
            <tr>
              <th className="px-4 py-3 font-bold">Nome</th>
              <th className="px-4 py-3 font-bold">E-mail</th>
              <th className="px-4 py-3 font-bold">Telefone</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">Matriculado em</th>
            </tr>
          </thead>
          <tbody>
            {matriculas?.map((m) => {
              const aluno = m.alunos as unknown as {
                nome: string;
                email: string;
                telefone: string | null;
              } | null;
              return (
                <tr key={m.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-bold text-navy">
                    {aluno?.nome}
                  </td>
                  <td className="px-4 py-3 text-slate">{aluno?.email}</td>
                  <td className="px-4 py-3 text-slate">
                    {aluno?.telefone ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate">{m.status}</td>
                  <td className="px-4 py-3 text-slate">
                    {new Date(m.criado_em).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              );
            })}
            {(!matriculas || matriculas.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray">
                  Nenhum aluno matriculado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
