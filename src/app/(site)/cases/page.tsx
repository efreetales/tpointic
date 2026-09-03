import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getCases } from "@/lib/cases";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Cases — TPointic",
  description: "Portfólio de cases de Service Design, UX Research e UX Design de Tales Pereira.",
};

export default async function CasesPage() {
  const cases = await getCases();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <Reveal>
        <p className="text-sm font-bold uppercase tracking-widest text-coral">
          Portfólio
        </p>
        <h1 className="mt-2 text-4xl font-black text-navy">Cases</h1>
        <p className="mt-3 max-w-2xl text-slate">
          Projetos de Service Design, UX Research e UX Design conduzidos ao longo
          de 15+ anos de carreira.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {cases.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.06}>
            <Link
              href={`/cases/${c.slug}`}
              className="group block overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:-translate-y-1 hover:border-coral"
            >
              {c.capa_url && (
                <div className="relative aspect-video overflow-hidden bg-bg">
                  <Image
                    src={c.capa_url}
                    alt={c.titulo}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(min-width: 640px) 50vw, 100vw"
                  />
                </div>
              )}
              <div className="p-6">
                {c.cliente && (
                  <p className="text-xs font-bold uppercase tracking-widest text-coral">
                    {c.cliente}
                  </p>
                )}
                <h2 className="mt-1 text-xl font-black text-navy">{c.titulo}</h2>
                {c.resumo && (
                  <p className="mt-2 text-sm text-slate">{c.resumo}</p>
                )}
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
