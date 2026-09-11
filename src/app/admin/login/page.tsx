import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";
import { LoginForm } from "./form";

export const metadata: Metadata = {
  title: `Login — Admin ${SITE_NAME}`,
};

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-1 flex-col justify-center px-6">
      <p className="text-sm font-bold uppercase tracking-widest text-coral">
        {SITE_NAME} Admin
      </p>
      <h1 className="mt-2 text-3xl font-black text-navy">Entrar</h1>
      <p className="mt-2 text-sm text-slate">
        Entre com sua senha ou receba um link de acesso por e-mail.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </main>
  );
}
