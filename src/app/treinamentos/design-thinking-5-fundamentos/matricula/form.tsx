"use client";

import { useActionState } from "react";
import { matricular, type MatriculaState } from "./actions";

const initialState: MatriculaState = { status: "idle", message: "" };

export function MatriculaForm({ turmaId }: { turmaId: string }) {
  const matricularNaTurma = matricular.bind(null, turmaId);
  const [state, formAction, pending] = useActionState(
    matricularNaTurma,
    initialState,
  );

  if (state.status === "ok") {
    return (
      <div className="rounded-2xl border border-border bg-white p-6 text-navy">
        <p className="font-bold">✅ {state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="nome" className="block text-sm font-bold text-navy">
          Nome completo
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-bold text-navy">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
        />
      </div>
      <div>
        <label
          htmlFor="telefone"
          className="block text-sm font-bold text-navy"
        >
          Telefone (opcional)
        </label>
        <input
          id="telefone"
          name="telefone"
          type="tel"
          className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
        />
      </div>

      {state.status === "erro" && (
        <p className="text-sm font-bold text-red-600" aria-live="polite">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-coral px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-peach disabled:opacity-60"
      >
        {pending ? "Enviando..." : "Confirmar matrícula"}
      </button>
    </form>
  );
}
