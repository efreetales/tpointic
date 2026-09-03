import Link from "next/link";
import { criarCase } from "../actions";
import { CaseFormFields } from "../case-form";

export default function AdminNovoCasePage() {
  return (
    <div>
      <Link href="/admin/cases" className="text-sm font-bold text-coral">
        ← Voltar para cases
      </Link>

      <h1 className="mt-4 text-3xl font-black text-navy">Novo case</h1>

      <form
        action={criarCase}
        className="mt-6 max-w-lg space-y-4 rounded-2xl border border-border bg-white p-6"
      >
        <CaseFormFields />
        <button
          type="submit"
          className="rounded-full bg-coral px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-peach"
        >
          Criar case
        </button>
      </form>
    </div>
  );
}
