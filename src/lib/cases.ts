import { createClient } from "@/lib/supabase/server";

// `grupo`, when set, sorts this item into a named tab in the Resultados
// section instead of one flat grid — use it only when a case has enough
// results that showing everything at once gets overwhelming (ex. Sulamérica:
// "Agendamento" / "NPS" / "Especialidades"). Items without `grupo` (the
// common case) all fall into one implicit group, so no tab menu renders and
// behavior is unchanged from before this field existed.
export type Destaque = { label: string; valor: string; icon?: string; grupo?: string };
export type Step = { icon: string; title: string; description: string };
export type StyleGuideColor = { hex: string; name: string; role: string };
export type StyleGuidePattern = { title: string; desc: string };
export type StyleGuide = {
  colors?: StyleGuideColor[];
  patterns?: StyleGuidePattern[];
};
export type GalleryItem = {
  url: string;
  alt: string;
  caption?: string;
  fit?: "cover" | "contain";
  bg?: string;
};
export type Screen = { url: string; alt: string };
export type PieSlice = { label: string; value: number; color?: string };
// `total`, when set, overrides the number shown in the donut's center — use
// it whenever `slices[].value` holds proportions/percentages from the
// source rather than real per-slice counts (the displayed total must be the
// source's real total, e.g. "70 confirmações", not the sum of percentages,
// which is always 100 and would misrepresent the actual count).
export type PieChartData = { title: string; slices: PieSlice[]; total?: number; grupo?: string };

export type Case = {
  id: string;
  slug: string;
  titulo: string;
  cliente: string | null;
  resumo: string | null;
  conteudo: string | null;
  capa_url: string | null;
  capa_focal: string | null;
  publicado_em: string;
  imagens: string[];
  video_url: string | null;
  figma_url: string | null;
  prototipo_bg_color: string | null;
  slides_url: string | null;
  pdf_url: string | null;
  destaques: Destaque[];
  hero_title: string | null;
  hero_accent: string | null;
  problema_texto: string | null;
  problema_bg_url: string | null;
  problema_bg_color: string | null;
  steps: Step[];
  steps_eyebrow: string | null;
  steps_title: string | null;
  style_guide: StyleGuide;
  gallery: GalleryItem[];
  gallery_intro: string | null;
  gallery_eyebrow: string | null;
  gallery_title: string | null;
  gallery_numbered: boolean;
  pie_charts: PieChartData[];
  screens: Screen[];
  hero_device: string | null;
};

export async function getCases(): Promise<Case[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .order("publicado_em", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getCaseBySlug(slug: string): Promise<Case | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}
