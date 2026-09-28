import { createClient } from "@/lib/supabase/server";

type Event = { case_slug: string; event: "impression" | "click"; position: number | null };

// Desempenho dos cases em destaque na home: a ordem é sorteada a cada visita,
// então dá pra comparar cases de forma justa. "Taxa de clique" = cliques ÷
// exibições; a posição média mostra se um case só ganhou por ter aparecido
// primeiro (com ordem aleatória, deve ficar perto do meio pra todos).
export default async function DesempenhoPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("case_events")
    .select("case_slug, event, position")
    .limit(50000);
  if (error) throw error;

  const events = (data ?? []) as Event[];
  const bySlug = new Map<string, { impressions: number; clicks: number; posSum: number; posN: number }>();
  for (const e of events) {
    const row = bySlug.get(e.case_slug) ?? { impressions: 0, clicks: 0, posSum: 0, posN: 0 };
    if (e.event === "impression") {
      row.impressions++;
      if (e.position) {
        row.posSum += e.position;
        row.posN++;
      }
    } else {
      row.clicks++;
    }
    bySlug.set(e.case_slug, row);
  }

  const rows = [...bySlug.entries()]
    .map(([slug, r]) => ({
      slug,
      ...r,
      ctr: r.impressions ? (r.clicks / r.impressions) * 100 : 0,
      avgPos: r.posN ? r.posSum / r.posN : null,
    }))
    .sort((a, b) => b.ctr - a.ctr || b.clicks - a.clicks);

  return (
    <div>
      <h1 className="text-3xl font-black text-navy">Desempenho dos cases</h1>
      <p className="mt-2 text-slate">
        Cases em destaque na home, em ordem aleatória a cada visita. Exibição = o painel ficou ≥60%
        visível; clique = &quot;Ver case completo&quot;.
      </p>

      {rows.length === 0 ? (
        <p className="mt-8 text-gray">Ainda sem dados — as primeiras visitas à home aparecem aqui.</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs font-bold uppercase tracking-widest text-gray">
              <tr>
                <th className="px-5 py-3">Case</th>
                <th className="px-5 py-3 text-right">Exibições</th>
                <th className="px-5 py-3 text-right">Cliques</th>
                <th className="px-5 py-3 text-right">Taxa de clique</th>
                <th className="px-5 py-3 text-right">Posição média</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.slug} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-bold text-navy">{r.slug}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{r.impressions}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{r.clicks}</td>
                  <td className="px-5 py-3 text-right font-bold tabular-nums text-navy">
                    {r.impressions ? `${r.ctr.toFixed(1)}%` : "—"}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    {r.avgPos ? r.avgPos.toFixed(1) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
