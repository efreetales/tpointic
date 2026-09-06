"use server";

import { createClient } from "@/lib/supabase/server";
import { sendConfirmacaoMatricula } from "@/lib/email";

export type MatriculaState = {
  status: "idle" | "ok" | "erro";
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function matricular(
  turmaId: string,
  _prevState: MatriculaState,
  formData: FormData,
): Promise<MatriculaState> {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();

  if (nome.length < 2) {
    return { status: "erro", message: "Informe seu nome completo." };
  }
  if (!EMAIL_RE.test(email)) {
    return { status: "erro", message: "Informe um e-mail válido." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("matricular_aluno", {
    p_turma_id: turmaId,
    p_nome: nome,
    p_email: email,
    p_telefone: telefone || null,
  });

  if (error) {
    console.error("Erro ao matricular aluno:", error);
    return {
      status: "erro",
      message: "Não foi possível concluir sua matrícula. Tente novamente.",
    };
  }

  const result = data as { status: string };

  if (result.status === "turma_fechada") {
    return {
      status: "erro",
      message: "As matrículas para esta turma foram encerradas.",
    };
  }
  if (result.status === "sem_vagas") {
    return {
      status: "erro",
      message: "Essa turma já atingiu a capacidade máxima de vagas.",
    };
  }
  if (result.status === "turma_nao_encontrada") {
    return { status: "erro", message: "Turma não encontrada." };
  }

  const { data: turma } = await supabase
    .from("turmas")
    .select("nome, data_aula")
    .eq("id", turmaId)
    .maybeSingle();

  let emailEnviado = false;
  if (turma) {
    try {
      await sendConfirmacaoMatricula({
        to: email,
        nome,
        turmaNome: turma.nome,
        dataAula: turma.data_aula,
      });
      emailEnviado = true;
    } catch (err) {
      console.error("Erro ao enviar e-mail de confirmação:", err);
    }
  }

  if (!emailEnviado) {
    return {
      status: "ok",
      message:
        "Matrícula confirmada! Não conseguimos enviar o e-mail de confirmação agora, mas sua vaga está garantida — qualquer dúvida, fale no contato.",
    };
  }

  return {
    status: "ok",
    message:
      result.status === "ja_matriculado"
        ? "Você já está matriculado nessa turma — te enviamos os detalhes de novo por e-mail."
        : "Matrícula confirmada! Te enviamos os detalhes por e-mail.",
  };
}
