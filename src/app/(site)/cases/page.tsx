import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getCases } from "@/lib/cases";
import { Reveal } from "@/components/reveal";
import { getCaseBgColor } from "@/lib/case-colors";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Cases — ${SITE_NAME}`,
  description: "Portfólio de cases de Service Design, UX Research e UX Design de Tales Pereira.",
};

export default async function CasesPage() {
  const cases = await getCases();

  return (
    <main className="flex-1">
      {/* Hero — vídeo full-bleed de novo como fundo (fundo branco liso do
          próprio arquivo, ver curves= aplicado nele, funde sem emenda com
          o bg-white da seção). `object-position` deslocado pra esquerda —
          empurra o enquadramento nessa direção mesmo cortando um pedaço à
          direita, deixando o personagem mais afastado do bloco de texto.
          `marginTop`/`paddingTop` com `--nav-h` (publicada pelo Nav) puxam
          a seção pra trás do header transparente, igual ao hero da
          home. */}
      <section
        className="relative flex min-h-screen w-full items-center overflow-hidden bg-white"
        style={{
          marginTop: "calc(-1 * var(--nav-h, 0px))",
          paddingTop: "var(--nav-h, 0px)",
        }}
      >
        {/* Largura total, altura NATURAL (16:9, sem cover forçando zoom pra
            cobrir o min-h-screen inteiro) — centralizado verticalmente,
            deixando o branco da própria seção sobrar em cima/embaixo em vez
            de esticar/dar zoom no vídeo pra preencher tudo. */}
        <video
          src="https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/hero-cases-typing.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-contain"
          style={{ objectPosition: "15% 100%" }}
        />

        {/* Degradê branco por cima do vídeo, só do lado direito (onde fica
            o texto) — o "branco" do vídeo em si vem do curves= aplicado no
            arquivo (não é branco puro), então em monitores bons aparecem
            resquícios/sujeira de compressão atrás do texto. O degradê some
            perto do personagem (não cobre ele) e fecha em branco sólido
            bem antes do texto começar. */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-[42%]"
          style={{ background: "linear-gradient(to right, transparent, white 45%)" }}
        />

        <div className="relative flex w-full justify-end px-6 lg:px-16 xl:px-24">
          <div className="flex flex-col items-end text-right">
            <p className="text-sm font-bold uppercase tracking-widest text-[#058fa1]">
              Portfólio
            </p>
            <h1 className="mt-2 text-4xl font-black text-[#1a1a1a] sm:text-5xl lg:text-6xl">
              Cases
            </h1>
            <p className="mt-3 max-w-md text-lg text-[#4a4a4a]">
              Projetos de Service Design, UX Research e UX Design conduzidos ao
              longo de 15+ anos de carreira.
            </p>
          </div>
        </div>
      </section>

      {/* Fundo cinza bem claro (acompanha o branco do hero acima) com cards
          brancos — cores literais (não os tokens do tema escuro do site:
          text-navy/text-slate/text-coral aqui resolveriam pra tons claros,
          ilegíveis sobre um card branco). */}
      <div className="w-full bg-[#f6f6f7] px-6 py-16">
        <div className="mx-auto grid w-full max-w-5xl gap-8 sm:grid-cols-2">
        {cases.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.06}>
            <Link
              href={`/cases/${c.slug}`}
              className="group block overflow-hidden rounded-2xl border border-[#e5e5e7] bg-white transition-all hover:-translate-y-1 hover:border-[#058fa1]"
            >
              {c.capa_url && (
                <div
                  className="relative aspect-video overflow-hidden"
                  style={{ backgroundColor: getCaseBgColor(c.slug, i) }}
                >
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
                  <p className="text-xs font-bold uppercase tracking-widest text-[#058fa1]">
                    {c.cliente}
                  </p>
                )}
                <h2 className="mt-1 text-xl font-black text-[#1a1a1a]">{c.titulo}</h2>
                {c.resumo && (
                  <p className="mt-2 text-sm text-[#4a4a4a]">{c.resumo}</p>
                )}
              </div>
            </Link>
          </Reveal>
        ))}
        </div>
      </div>
    </main>
  );
}
