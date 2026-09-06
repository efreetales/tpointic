import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCaseBySlug } from "@/lib/cases";
import { CaseBody } from "./case-body";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCaseBySlug(slug);
  if (!c) return {};
  return {
    title: `${c.titulo} — TPointic`,
    description: c.resumo ?? undefined,
  };
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const c = await getCaseBySlug(slug);
  if (!c) notFound();

  return <CaseBody c={c} />;
}
