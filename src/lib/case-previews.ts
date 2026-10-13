import type { Case } from "@/lib/cases";
import acessoDelegado from "@/content/cases-preview/acesso-delegado-com-consentimento.json";

// Cases em revisão, ainda não cadastrados na tabela `cases`. Só aparecem
// rodando local (`npm run dev`) ou em deploys de PRÉVIA da Vercel
// (`VERCEL_ENV === "preview"`), nunca em produção — o site não tem modo
// rascunho, e cadastrar no banco publica na hora. Depois que o case é
// aprovado e entra no banco, remover o JSON daqui.
const DRAFTS: Partial<Case>[] = [acessoDelegado as Partial<Case>];

const DEFAULTS: Omit<Case, "slug" | "titulo"> = {
  id: "",
  cliente: null,
  resumo: null,
  conteudo: null,
  conteudo_video_url: null,
  conteudo_video_titulo: null,
  capa_url: null,
  capa_focal: null,
  publicado_em: "2026-10-13T00:00:00Z",
  imagens: [],
  video_url: null,
  video_titulo: null,
  documentario_url: null,
  documentario_titulo: null,
  figma_url: null,
  prototipo_bg_color: null,
  prototipo_altura: null,
  prototipo_contido: false,
  steps_bg_color: null,
  steps_intro: null,
  projeto_url: null,
  slides_url: null,
  pdf_url: null,
  destaques: [],
  categorias: [],
  frases_puppet: [],
  hero_title: null,
  hero_accent: null,
  problema_texto: null,
  problema_bg_url: null,
  problema_bg_color: null,
  problema_bg_full: false,
  problema_video_url: null,
  steps: [],
  steps_eyebrow: null,
  steps_title: null,
  style_guide: {},
  gallery: [],
  gallery_intro: null,
  gallery_eyebrow: null,
  gallery_title: null,
  gallery_numbered: false,
  pie_charts: [],
  screens: [],
  hero_device: null,
};

export function previewCasesEnabled(): boolean {
  return process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview";
}

export function getPreviewCases(): Case[] {
  if (!previewCasesEnabled()) return [];
  return DRAFTS.map((d) => ({ ...DEFAULTS, id: `preview-${d.slug}`, ...d }) as Case);
}
