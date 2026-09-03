import Link from "next/link";
import { notFound } from "next/navigation";
import { getTurmaAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { NotificacaoForm } from "./form";

type Props = { params: Promise<{ id: string }> };

export default async function AdminTurmaNotificacoesPage({ params }: Props) {
  const { id } = await params;
  const turma = await getTurmaAdmin(id);
  if (!turma) notFound();

  const supabase = await createClient();
  const { data: historico } = await supabase
    .from("notificacoes")
    .select("*")
    .eq("turma_id", id)
    .order("enviado_em", { ascending: false });

  return (
    <div>
      <Link href={`/admin/turmas/${id}`} className="text-sm font-bold text-coral">
        ← Voltar para a turma
      </Link>

      <h1 className="mt-4 text-3xl font-black text-navy">
        Notificação — {turma.nome}
      </h1>
      <p className="mt-2 text-sm text-slate">
        A mensagem será enviada para todos os alunos matriculados nessa
        turma (exceto matrículas canceladas).
      </p>

      <div className="mt-6 max-w-lg rounded-2xl border border-border bg-white p-6">
        <NotificacaoForm turmaId={id} />
      </div>

      {historico && historico.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-black text-navy">
            Notificações enviadas
          </h2>
          <div className="mt-4 space-y-3">
            {historico.map((n) => (
              <div
                key={n.id}
                className="rounded-xl border border-border bg-white p-4"
              >
                <p className="text-sm font-bold text-navy">{n.assunto}</p>
                <p className="mt-1 text-xs text-gray">
                  {new Date(n.enviado_em).toLocaleString("pt-BR")} ·{" "}
                  {n.destinatarios_count} destinatário(s)
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
