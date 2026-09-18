"use client";

import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/next";

const OPT_OUT_KEY = "va-disabled";

// Pra parar de contar suas próprias visitas nos relatórios do Vercel
// Analytics: acesse o site uma vez com `?no-track=1` (ex.:
// talespereira.com/?no-track=1) nesse navegador — grava um flag no
// localStorage que faz o `beforeSend` descartar todo evento futuro antes
// de sair pro Vercel. Só vale pra esse navegador/dispositivo; repita em
// cada um que você usa pra acessar o site.
export function VercelAnalytics() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("no-track") === "1") {
      localStorage.setItem(OPT_OUT_KEY, "1");
    }
  }, []);

  return (
    <Analytics
      beforeSend={(event) => {
        if (localStorage.getItem(OPT_OUT_KEY)) return null;
        return event;
      }}
    />
  );
}
