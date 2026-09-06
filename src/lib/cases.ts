import { createClient } from "@/lib/supabase/server";

export type Destaque = { label: string; valor: string; icon?: string };
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

export type Case = {
  id: string;
  slug: string;
  titulo: string;
  cliente: string | null;
  resumo: string | null;
  conteudo: string | null;
  capa_url: string | null;
  publicado_em: string;
  imagens: string[];
  video_url: string | null;
  figma_url: string | null;
  slides_url: string | null;
  pdf_url: string | null;
  destaques: Destaque[];
  hero_title: string | null;
  hero_accent: string | null;
  problema_texto: string | null;
  steps: Step[];
  steps_eyebrow: string | null;
  steps_title: string | null;
  style_guide: StyleGuide;
  gallery: GalleryItem[];
  screens: Screen[];
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
