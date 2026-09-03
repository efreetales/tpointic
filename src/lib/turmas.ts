import { createClient } from "@/lib/supabase/server";

export type Curso = {
  id: string;
  slug: string;
  titulo: string;
  descricao: string | null;
};

export type Turma = {
  id: string;
  curso_id: string;
  nome: string;
  data_aula: string;
  matricula_abre: string;
  matricula_fecha: string;
  capacidade_min: number;
  capacidade_max: number | null;
  status: string;
};

export async function getCursoBySlug(slug: string): Promise<Curso | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cursos")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getTurmaAberta(cursoId: string): Promise<Turma | null> {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  const { data: turmas, error } = await supabase
    .from("turmas")
    .select("*")
    .eq("curso_id", cursoId)
    .eq("status", "aberta")
    .lte("matricula_abre", nowIso)
    .gte("matricula_fecha", nowIso)
    .order("matricula_fecha", { ascending: true });

  if (error) throw error;
  if (!turmas || turmas.length === 0) return null;

  for (const turma of turmas) {
    if (turma.capacidade_max == null) return turma;

    const { count, error: countError } = await supabase
      .from("matriculas")
      .select("id", { count: "exact", head: true })
      .eq("turma_id", turma.id)
      .neq("status", "cancelada");

    if (countError) throw countError;
    if ((count ?? 0) < turma.capacidade_max) return turma;
  }

  return null;
}

export async function getTurmaById(id: string): Promise<Turma | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("turmas")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}
