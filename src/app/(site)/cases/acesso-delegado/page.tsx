import type { Metadata } from "next";
import { Hero } from "@/components/acesso-delegado/hero";
import { Comercial } from "@/components/acesso-delegado/comercial";
import { Problema } from "@/components/acesso-delegado/problema";
import { Modelo } from "@/components/acesso-delegado/modelo";
import { Niveis } from "@/components/acesso-delegado/niveis";
import { Prototipo } from "@/components/acesso-delegado/prototipo";
import {
  Fechamento,
  Hipoteses,
  Personas,
  Riscos,
} from "@/components/acesso-delegado/fechamento";
import { MOSTRAR_PESQUISA } from "@/components/acesso-delegado/data";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Acesso delegado com consentimento — Cases — ${SITE_NAME}`,
  description:
    "Estudo de caso para fintechs e bancos: como proteger o dinheiro de quem precisa de ajuda sem tirar dele a autonomia que ainda tem. Modelo de papéis, protótipos navegáveis nas peles Itaú e Nubank e plano de pesquisa.",
};

// Página sob medida (rota estática: tem prioridade sobre `/cases/[slug]`).
// O case é uma proposta de produto com hipóteses a validar, por isso não há
// seção de "Resultados" com números.
export default function AcessoDelegadoPage() {
  return (
    <main className="flex-1">
      <Hero />
      <Comercial />
      <Problema />
      <Modelo />
      <Niveis />
      <Prototipo />
      <Personas />
      {MOSTRAR_PESQUISA && <Hipoteses />}
      <Riscos />
      <Fechamento />
    </main>
  );
}
