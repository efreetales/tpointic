"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X } from "@mynaui/icons-react";
import { MatriculaForm } from "@/app/(site)/treinamentos/design-thinking-5-fundamentos/matricula/form";

type Turma = {
  id: string;
  nome: string;
  data_aula: string;
} | null;

export function MatriculaDrawer({
  turma,
  children,
  className,
}: {
  turma: Turma;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Só sabemos que `document` existe depois de montar no client — evita
  // tentar criar o portal durante SSR.
  useEffect(() => setMounted(true), []);

  // Trava o scroll do fundo enquanto o painel está aberto — comportamento
  // esperado de um drawer/modal.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const drawer = (
    // `site-theme` reaplicado aqui porque o portal renderiza direto em
    // `document.body`, fora do wrapper em (site)/layout.tsx que normalmente
    // fornece as variáveis de cor do tema escuro do site.
    <div className="site-theme">
      <div
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col overflow-y-auto bg-bg shadow-2xl transition-transform duration-300 ease-out sm:w-1/2 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <p className="text-sm font-bold uppercase tracking-widest text-coral">
            Matrícula
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fechar"
            className="text-navy transition-colors hover:text-coral"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 px-6 py-8">
          <h2 className="text-2xl font-black text-navy">Garanta sua vaga</h2>
          <p className="mt-2 text-slate">Os 5 Fundamentos do Design Thinking</p>

          <div className="mt-8">
            {!turma ? (
              <div className="rounded-2xl border border-border bg-surface p-6 text-navy">
                <p className="font-bold">Aguardando nova turma</p>
                <p className="mt-2 text-sm text-slate">
                  As matrículas ainda não abriram para a próxima turma.
                </p>
                <Link
                  href="/contato"
                  className="mt-4 inline-block rounded-full bg-coral px-5 py-2 text-sm font-bold text-black transition-transform hover:scale-105"
                >
                  Avise-me quando abrir
                </Link>
              </div>
            ) : (
              <>
                <p className="mb-6 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-slate">
                  <strong className="text-navy">{turma.nome}</strong>
                  <br />
                  {new Date(turma.data_aula).toLocaleString("pt-BR", {
                    dateStyle: "long",
                    timeStyle: "short",
                    timeZone: "America/Sao_Paulo",
                  })}
                </p>
                <MatriculaForm turmaId={turma.id} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
