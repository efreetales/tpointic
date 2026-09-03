import type { Metadata } from "next";
import { LoginForm } from "./form";

export const metadata: Metadata = {
  title: "Login — Admin TPointic",
};

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-1 flex-col justify-center px-6">
      <p className="text-sm font-bold uppercase tracking-widest text-coral">
        TPointic Admin
      </p>
      <h1 className="mt-2 text-3xl font-black text-navy">Entrar</h1>
      <p className="mt-2 text-sm text-slate">
        Digite seu e-mail para receber um link de acesso.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </main>
  );
}
