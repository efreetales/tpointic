"use client";

import { useActionState } from "react";
import { enviarNotificacao, type NotificacaoState } from "./actions";

const initialState: NotificacaoState = { status: "idle", message: "" };

export function NotificacaoForm({ turmaId }: { turmaId: string }) {
  const enviarParaTurma = enviarNotificacao.bind(null, turmaId);
  const [state, formAction, pending] = useActionState(
    enviarParaTurma,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="assunto" className="block text-sm font-bold text-navy">
          Assunto
        </label>
        <input
          id="assunto"
          name="assunto"
          type="text"
          required
          className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
        />
      </div>
      <div>
        <label htmlFor="corpo" className="block text-sm font-bold text-navy">
          Mensagem
        </label>
        <textarea
          id="corpo"
          name="corpo"
          rows={8}
          required
          className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
        />
      </div>

      {state.status !== "idle" && (
        <p
          className={`text-sm font-bold ${state.status === "ok" ? "text-navy" : "text-red-600"}`}
          aria-live="polite"
        >
          {state.status === "ok" ? "✅ " : ""}
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-coral px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-peach disabled:opacity-60"
      >
        {pending ? "Enviando..." : "Enviar para a turma"}
      </button>
    </form>
  );
}
