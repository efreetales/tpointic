import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { atualizarCase, removerCase } from "../actions";
import { CaseFormFields } from "../case-form";
import { DeleteCaseButton } from "../delete-button";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditarCasePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: c } = await supabase
    .from("cases")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!c) notFound();

  const atualizarComId = atualizarCase.bind(null, c.id);
  const removerComId = removerCase.bind(null, c.id, c.slug);

  return (
    <div>
      <Link href="/admin/cases" className="text-sm font-bold text-coral">
        ← Voltar para cases
      </Link>

      <h1 className="mt-4 text-3xl font-black text-navy">Editar case</h1>

      <form
        action={atualizarComId}
        className="mt-6 max-w-lg space-y-4 rounded-2xl border border-border bg-white p-6"
      >
        <CaseFormFields c={c} />
        <button
          type="submit"
          className="rounded-full bg-coral px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-peach"
        >
          Salvar alterações
        </button>
      </form>

      <form action={removerComId} className="mt-6 max-w-lg">
        <DeleteCaseButton />
      </form>
    </div>
  );
}
