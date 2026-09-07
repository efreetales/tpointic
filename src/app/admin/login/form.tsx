"use client";

import { useActionState, useState } from "react";
import { enviarMagicLink, entrarComSenha, type LoginState } from "./actions";

const initialState: LoginState = { status: "idle", message: "" };

export function LoginForm() {
  const [modo, setModo] = useState<"senha" | "link">("senha");
  const [senhaState, senhaAction, senhaPending] = useActionState(
    entrarComSenha,
    initialState,
  );
  const [linkState, linkAction, linkPending] = useActionState(
    enviarMagicLink,
    initialState,
  );

  if (modo === "link") {
    if (linkState.status === "ok") {
      return (
        <div className="rounded-2xl border border-border bg-white p-6 text-navy">
          <p className="font-bold">✅ {linkState.message}</p>
        </div>
      );
    }

    return (
      <form action={linkAction} className="space-y-4">
        <div>
          <label htmlFor="email-link" className="block text-sm font-bold text-navy">
            E-mail
          </label>
          <input
            id="email-link"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
          />
        </div>

        {linkState.status === "erro" && (
          <p className="text-sm font-bold text-red-600" aria-live="polite">
            {linkState.message}
          </p>
        )}

        <button
          type="submit"
          disabled={linkPending}
          className="w-full rounded-full bg-coral px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-peach disabled:opacity-60"
        >
          {linkPending ? "Enviando..." : "Enviar link de acesso"}
        </button>

        <button
          type="button"
          onClick={() => setModo("senha")}
          className="w-full text-center text-sm font-bold text-coral hover:underline"
        >
          Entrar com senha
        </button>
      </form>
    );
  }

  return (
    <form action={senhaAction} className="space-y-4">
      <div>
        <label htmlFor="email-senha" className="block text-sm font-bold text-navy">
          E-mail
        </label>
        <input
          id="email-senha"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-bold text-navy">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2 text-navy outline-none focus:border-coral"
        />
      </div>

      {senhaState.status === "erro" && (
        <p className="text-sm font-bold text-red-600" aria-live="polite">
          {senhaState.message}
        </p>
      )}

      <button
        type="submit"
        disabled={senhaPending}
        className="w-full rounded-full bg-coral px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-peach disabled:opacity-60"
      >
        {senhaPending ? "Entrando..." : "Entrar"}
      </button>

      <button
        type="button"
        onClick={() => setModo("link")}
        className="w-full text-center text-sm font-bold text-coral hover:underline"
      >
        Entrar com link por e-mail
      </button>
    </form>
  );
}
