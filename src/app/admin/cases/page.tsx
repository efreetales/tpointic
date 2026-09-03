import Link from "next/link";
import { getCasesAdmin } from "@/lib/admin";

export default async function AdminCasesPage() {
  const cases = await getCasesAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-navy">Cases</h1>
        <Link
          href="/admin/cases/nova"
          className="rounded-full bg-coral px-5 py-2 text-sm font-bold text-white hover:bg-peach"
        >
          Novo case
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-gray">
            <tr>
              <th className="px-4 py-3 font-bold">Título</th>
              <th className="px-4 py-3 font-bold">Cliente</th>
              <th className="px-4 py-3 font-bold">Publicado em</th>
            </tr>
          </thead>
          <tbody>
            {cases?.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/cases/${c.id}`}
                    className="font-bold text-navy hover:text-coral"
                  >
                    {c.titulo}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate">{c.cliente ?? "—"}</td>
                <td className="px-4 py-3 text-slate">
                  {new Date(c.publicado_em).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
            {(!cases || cases.length === 0) && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray">
                  Nenhum case cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
