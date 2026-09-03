"use client";

import { useActionState } from "react";
import { enviarMagicLink, type LoginState } from "./actions";

const initialState: LoginState = { status: "idle", message: "" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    enviarMagicLink,
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
        {pending ? "Enviando..." : "Enviar link de acesso"}
      </button>
    </form>
  );
}
