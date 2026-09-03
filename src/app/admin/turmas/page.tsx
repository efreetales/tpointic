import Link from "next/link";
import { getTurmasAdmin, getCursos } from "@/lib/admin";
import { criarTurma } from "./actions";

export default async function AdminTurmasPage() {
  const [turmas, cursos] = await Promise.all([getTurmasAdmin(), getCursos()]);

  return (
    <div>
      <h1 className="text-3xl font-black text-navy">Turmas</h1>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-gray">
            <tr>
              <th className="px-4 py-3 font-bold">Turma</th>
              <th className="px-4 py-3 font-bold">Curso</th>
              <th className="px-4 py-3 font-bold">Aula</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">Matrículas</th>
            </tr>
          </thead>
          <tbody>
            {turmas.map((t) => (
              <tr key={t.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/turmas/${t.id}`}
                    className="font-bold text-navy hover:text-coral"
                  >
                    {t.nome}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate">{t.curso_titulo}</td>
                <td className="px-4 py-3 text-slate">
                  {new Date(t.data_aula).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3 text-slate">{t.status}</td>
                <td className="px-4 py-3 text-slate">
                  {t.matriculas_count}
                  {t.capacidade_max != null ? ` / ${t.capacidade_max}` : ""}
                </td>
              </tr>
            ))}
            {turmas.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray">
                  Nenhuma turma cadastrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-10 max-w-lg rounded-2xl border border-border bg-white p-6">
        <h2 className="text-lg font-black text-navy">Nova turma</h2>
        <form action={criarTurma} className="mt-4 space-y-4">
          <div>
            <label htmlFor="curso_id" className="block text-sm font-bold text-navy">
              Curso
            </label>
            <select
              id="curso_id"
              name="curso_id"
              required
              className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
            >
              {cursos?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.titulo}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="nome" className="block text-sm font-bold text-navy">
              Nome da turma
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              placeholder="Turma Outubro/2026"
              required
              className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
            />
          </div>
          <div>
            <label htmlFor="data_aula" className="block text-sm font-bold text-navy">
              Data e hora da aula
            </label>
            <input
              id="data_aula"
              name="data_aula"
              type="datetime-local"
              required
              className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="matricula_abre" className="block text-sm font-bold text-navy">
                Matrícula abre
              </label>
              <input
                id="matricula_abre"
                name="matricula_abre"
                type="datetime-local"
                required
                className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
              />
            </div>
            <div>
              <label htmlFor="matricula_fecha" className="block text-sm font-bold text-navy">
                Matrícula fecha
              </label>
              <input
                id="matricula_fecha"
                name="matricula_fecha"
                type="datetime-local"
                required
                className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="capacidade_min" className="block text-sm font-bold text-navy">
                Capacidade mínima
              </label>
              <input
                id="capacidade_min"
                name="capacidade_min"
                type="number"
                min={1}
                defaultValue={12}
                className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
              />
            </div>
            <div>
              <label htmlFor="capacidade_max" className="block text-sm font-bold text-navy">
                Capacidade máxima
              </label>
              <input
                id="capacidade_max"
                name="capacidade_max"
                type="number"
                min={1}
                placeholder="opcional"
                className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-full bg-coral px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-peach"
          >
            Criar turma
          </button>
        </form>
      </div>
    </div>
  );
}
