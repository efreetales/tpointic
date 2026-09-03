"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function toTimestamptz(local: string) {
  // datetime-local values have no timezone; treat as America/Sao_Paulo (UTC-3)
  return `${local}:00-03:00`;
}

export async function criarTurma(formData: FormData) {
  const supabase = await createClient();

  const capacidadeMax = String(formData.get("capacidade_max") ?? "").trim();

  const { error } = await supabase.from("turmas").insert({
    curso_id: String(formData.get("curso_id")),
    nome: String(formData.get("nome")),
    data_aula: toTimestamptz(String(formData.get("data_aula"))),
    matricula_abre: toTimestamptz(String(formData.get("matricula_abre"))),
    matricula_fecha: toTimestamptz(String(formData.get("matricula_fecha"))),
    capacidade_min: Number(formData.get("capacidade_min") || 12),
    capacidade_max: capacidadeMax ? Number(capacidadeMax) : null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/turmas");
  revalidatePath("/admin");
  redirect("/admin/turmas");
}

export async function atualizarTurma(turmaId: string, formData: FormData) {
  const supabase = await createClient();

  const capacidadeMax = String(formData.get("capacidade_max") ?? "").trim();

  const { error } = await supabase
    .from("turmas")
    .update({
      nome: String(formData.get("nome")),
      data_aula: toTimestamptz(String(formData.get("data_aula"))),
      matricula_abre: toTimestamptz(String(formData.get("matricula_abre"))),
      matricula_fecha: toTimestamptz(String(formData.get("matricula_fecha"))),
      capacidade_min: Number(formData.get("capacidade_min") || 12),
      capacidade_max: capacidadeMax ? Number(capacidadeMax) : null,
      status: String(formData.get("status")),
    })
    .eq("id", turmaId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/turmas");
  revalidatePath(`/admin/turmas/${turmaId}`);
  revalidatePath("/admin");
  redirect(`/admin/turmas/${turmaId}`);
}
