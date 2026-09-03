import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCaseBySlug } from "@/lib/cases";
import { Reveal } from "@/components/reveal";

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

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Reveal>
        <Link href="/cases" className="text-sm font-bold text-coral">
          ← Voltar para cases
        </Link>

        {c.cliente && (
          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-coral">
            {c.cliente}
          </p>
        )}
        <h1 className="mt-2 text-4xl font-black text-navy">{c.titulo}</h1>
        {c.resumo && <p className="mt-3 text-lg text-slate">{c.resumo}</p>}
      </Reveal>

      {c.capa_url && (
        <Reveal delay={0.1}>
          <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl bg-bg">
            <Image
              src={c.capa_url}
              alt={c.titulo}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 768px, 100vw"
              priority
            />
          </div>
        </Reveal>
      )}

      {c.conteudo && (
        <Reveal delay={0.15}>
          <div className="prose prose-navy mt-10 max-w-none whitespace-pre-line text-navy">
            {c.conteudo}
          </div>
        </Reveal>
      )}
    </main>
  );
}
