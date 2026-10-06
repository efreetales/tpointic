import type { Metadata } from "next";
import { LabCase } from "@/components/lab-case";
import { labAsset } from "@/lib/ai-lab";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `IniaFlow AI — AI Lab — ${SITE_NAME}`,
  description:
    "SaaS de análise inteligente de dados de ERP para pequenos varejistas: dashboard, assistente de IA e insights acionáveis.",
};

export default function IniaFlowPage() {
  return (
    <LabCase
      accent="#8b5cf6"
      tipo="SaaS · IA aplicada"
      titulo="IniaFlow AI"
      tagline="A planilha do pequeno varejo vira dashboard, alerta e conselho. Sem precisar ser analista."
      url="https://iniaflow.vercel.app"
      ctaLabel="Abrir o IniaFlow"
      hero={{
        src: labAsset("iniaflow/hero.webp"),
        alt: "Página inicial do IniaFlow AI",
      }}
      tools={["v0", "Next.js", "Vercel"]}
      passos={[
        {
          titulo: "Importe",
          texto:
            "Planilhas de vendas, produtos e insumos: Excel, CSV e outros.",
        },
        {
          titulo: "A IA analisa",
          texto: "Padrões, oportunidades e riscos aparecem sozinhos.",
        },
        {
          titulo: "Decida",
          texto:
            "Dashboards claros e recomendações práticas, prontas pra aplicar.",
        },
      ]}
      telas={[
        {
          src: labAsset("iniaflow/dashboard.webp"),
          alt: "Gráfico de vendas e margem dos últimos 7 dias",
        },
        {
          src: labAsset("iniaflow/hero.webp"),
          alt: "Página inicial do IniaFlow AI",
        },
      ]}
      destaques={[
        "Dashboard com KPIs, vendas, margem e alertas de estoque",
        "Assistente de IA: pergunte sobre o negócio em linguagem natural",
        "Insights: ajuste de preço, reposição e combos",
        "Pensado para mercados, lojas de moda, bares e restaurantes",
      ]}
    />
  );
}
