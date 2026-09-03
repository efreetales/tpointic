import Link from "next/link";
import { getTurmasAdmin } from "@/lib/admin";

export default async function AdminDashboardPage() {
  const turmas = await getTurmasAdmin();
  const ativas = turmas.filter((t) => t.status === "aberta");
  const totalMatriculas = turmas.reduce((acc, t) => acc + t.matriculas_count, 0);

  return (
    <div>
      <h1 className="text-3xl font-black text-navy">Dashboard</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-6">
          <p className="text-sm font-bold text-gray">Turmas ativas</p>
          <p className="mt-1 text-3xl font-black text-navy">{ativas.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-6">
          <p className="text-sm font-bold text-gray">Turmas no total</p>
          <p className="mt-1 text-3xl font-black text-navy">{turmas.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-6">
          <p className="text-sm font-bold text-gray">Matrículas no total</p>
          <p className="mt-1 text-3xl font-black text-navy">
            {totalMatriculas}
          </p>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-xl font-black text-navy">Turmas</h2>
        <Link
          href="/admin/turmas"
          className="text-sm font-bold text-coral hover:underline"
        >
          Ver todas →
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-gray">
            <tr>
              <th className="px-4 py-3 font-bold">Turma</th>
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
                <td className="px-4 py-3 text-slate">{t.status}</td>
                <td className="px-4 py-3 text-slate">
                  {t.matriculas_count}
                  {t.capacidade_max != null ? ` / ${t.capacidade_max}` : ""}
                </td>
              </tr>
            ))}
            {turmas.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray">
                  Nenhuma turma cadastrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
