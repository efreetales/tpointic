"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function criarCase(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("cases").insert({
    slug: String(formData.get("slug")),
    titulo: String(formData.get("titulo")),
    cliente: String(formData.get("cliente") ?? "") || null,
    resumo: String(formData.get("resumo") ?? "") || null,
    conteudo: String(formData.get("conteudo") ?? "") || null,
    capa_url: String(formData.get("capa_url") ?? "") || null,
    capa_focal: String(formData.get("capa_focal") ?? "") || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/cases");
  revalidatePath("/cases");
  redirect("/admin/cases");
}

export async function atualizarCase(caseId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("cases")
    .update({
      slug: String(formData.get("slug")),
      titulo: String(formData.get("titulo")),
      cliente: String(formData.get("cliente") ?? "") || null,
      resumo: String(formData.get("resumo") ?? "") || null,
      conteudo: String(formData.get("conteudo") ?? "") || null,
      capa_url: String(formData.get("capa_url") ?? "") || null,
    capa_focal: String(formData.get("capa_focal") ?? "") || null,
    })
    .eq("id", caseId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/cases");
  revalidatePath("/cases");
  redirect("/admin/cases");
}

export async function removerCase(caseId: string, slug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("cases").delete().eq("id", caseId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/cases");
  revalidatePath("/cases");
  revalidatePath(`/cases/${slug}`);
  redirect("/admin/cases");
}
