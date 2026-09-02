import { createClient } from "@/lib/supabase/server";

export type Case = {
  id: string;
  slug: string;
  titulo: string;
  cliente: string | null;
  resumo: string | null;
  conteudo: string | null;
  capa_url: string | null;
  publicado_em: string;
};

export async function getCases(): Promise<Case[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .order("publicado_em", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getCaseBySlug(slug: string): Promise<Case | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}
