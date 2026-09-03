"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type LoginState = {
  status: "idle" | "ok" | "erro";
  message: string;
};

export async function enviarMagicLink(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { status: "erro", message: "Informe um e-mail." };
  }

  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    console.error("Erro ao enviar magic link:", error);
    return {
      status: "erro",
      message: "Não foi possível enviar o link. Tente novamente.",
    };
  }

  return {
    status: "ok",
    message: "Link de acesso enviado! Confira seu e-mail.",
  };
}
