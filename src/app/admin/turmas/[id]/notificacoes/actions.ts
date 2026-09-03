"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendNotificacaoTurma } from "@/lib/email";

export type NotificacaoState = {
  status: "idle" | "ok" | "erro";
  message: string;
};

export async function enviarNotificacao(
  turmaId: string,
  _prevState: NotificacaoState,
  formData: FormData,
): Promise<NotificacaoState> {
  const assunto = String(formData.get("assunto") ?? "").trim();
  const corpo = String(formData.get("corpo") ?? "").trim();

  if (!assunto || !corpo) {
    return { status: "erro", message: "Preencha o assunto e a mensagem." };
  }

  const supabase = await createClient();

  const { data: matriculas, error } = await supabase
    .from("matriculas")
    .select("alunos(email)")
    .eq("turma_id", turmaId)
    .neq("status", "cancelada");

  if (error) {
    console.error(error);
    return { status: "erro", message: "Erro ao buscar alunos da turma." };
  }

  const destinatarios = (matriculas ?? [])
    .map((m) => (m.alunos as unknown as { email: string } | null)?.email)
    .filter((email): email is string => Boolean(email));

  if (destinatarios.length === 0) {
    return {
      status: "erro",
      message: "Essa turma ainda não tem alunos matriculados.",
    };
  }

  try {
    await sendNotificacaoTurma({ destinatarios, assunto, corpo });
  } catch (err) {
    console.error("Erro ao enviar notificação:", err);
    return { status: "erro", message: "Erro ao enviar os e-mails." };
  }

  await supabase.from("notificacoes").insert({
    turma_id: turmaId,
    assunto,
    corpo,
    destinatarios_count: destinatarios.length,
  });

  revalidatePath(`/admin/turmas/${turmaId}/notificacoes`);

  return {
    status: "ok",
    message: `Notificação enviada para ${destinatarios.length} aluno(s).`,
  };
}
