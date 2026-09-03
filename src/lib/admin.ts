import { createClient } from "@/lib/supabase/server";

export type TurmaComContagem = {
  id: string;
  nome: string;
  data_aula: string;
  matricula_abre: string;
  matricula_fecha: string;
  capacidade_min: number;
  capacidade_max: number | null;
  status: string;
  curso_titulo: string;
  matriculas_count: number;
};

export async function getTurmasAdmin(): Promise<TurmaComContagem[]> {
  const supabase = await createClient();
  const { data: turmas, error } = await supabase
    .from("turmas")
    .select("*, cursos(titulo)")
    .order("data_aula", { ascending: false });

  if (error) throw error;

  const withCounts = await Promise.all(
    (turmas ?? []).map(async (t) => {
      const { count } = await supabase
        .from("matriculas")
        .select("id", { count: "exact", head: true })
        .eq("turma_id", t.id)
        .neq("status", "cancelada");

      return {
        id: t.id,
        nome: t.nome,
        data_aula: t.data_aula,
        matricula_abre: t.matricula_abre,
        matricula_fecha: t.matricula_fecha,
        capacidade_min: t.capacidade_min,
        capacidade_max: t.capacidade_max,
        status: t.status,
        curso_titulo: (t.cursos as { titulo: string } | null)?.titulo ?? "—",
        matriculas_count: count ?? 0,
      };
    }),
  );

  return withCounts;
}

export async function getTurmaAdmin(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("turmas")
    .select("*, cursos(titulo)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getMatriculasDaTurma(turmaId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matriculas")
    .select("id, status, valor_pago, criado_em, alunos(nome, email, telefone)")
    .eq("turma_id", turmaId)
    .order("criado_em", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getCursos() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cursos")
    .select("id, titulo")
    .order("titulo");

  if (error) throw error;
  return data;
}

export async function getCasesAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .order("publicado_em", { ascending: false });

  if (error) throw error;
  return data;
}
