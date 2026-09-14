import type { Metadata } from "next";
import { Star } from "@mynaui/icons-react";
import { Reveal } from "@/components/reveal";
import { PhotoGallery } from "@/components/photo-gallery";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Sobre — ${SITE_NAME}`,
  description: "Conheça Tales Pereira, Gestor de Design, Service Designer e UX Researcher.",
};

const TESTIMONIALS = [
  {
    name: "Milene Ferraz",
    role: "Design Lead @ CI&T",
    quote:
      "Trabalhamos juntos em um projeto onde o resultado foi muito elogiado por todos. Manda bem demais!",
  },
  {
    name: "Luciana Terceiro",
    role: "Sr. Product Designer, ex-UOL",
    quote:
      "Tales sempre conduziu pesquisas com usuários e liderou sessões de cocriação para melhorar a experiência. Um aprendiz contínuo.",
  },
  {
    name: "Pablo Turazzi Vilanova",
    role: "UX Research Technical Leader @ Mercado Livre",
    quote:
      "Trabalhar com o Tales foi uma vivência espetacular... propositivo, inteligente, bem-humorado, sociável.",
  },
  {
    name: "Romeu Ivolela Neto",
    role: "AI & Philosophy Professional",
    quote:
      "Sensibilidade, empatia com usuários e profundo conhecimento tornam Tales um profissional excelente.",
  },
];

// Fotos recuperadas do backup WordPress (carrossel de galeria da página
// Sobre original) — re-hospedadas no Supabase Storage (bucket `site`,
// prefixo `sobre/`), mesma ordem do carrossel original.
const GALLERY_BASE = "https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/sobre";
const GALLERY_PHOTOS = [
  "IMG_8230.jpg-1024x768.jpg",
  "20170128_102803-921x1024.jpg",
  "FB_IMG_1474461089736.jpg",
  "IMG_20200930_110053-766x1024.jpg",
  "20230422_145230-1024x768.jpg",
  "20230511_175421.jpg",
  "20230622_235748.jpg",
  "20230727_170716.jpg",
  "IMG-20160928-WA0017-1024x768.jpg",
  "20230729_142403-1024x768.jpg",
  "20231203_145724-1024x768.jpg",
].map((name) => `${GALLERY_BASE}/${name}`);

export default function SobrePage() {
  return (
    <main className="flex-1 bg-white">
      {/* Hero — mesmo padrão full-bleed dos heróis de vídeo (home, cases):
          vídeo ocupa a seção inteira, header nasce transparente por cima via
          `--nav-h` (publicada pelo Nav). Vídeo sem boomerang (o clipe já é
          curto e não tem um "pico" de movimento que precise disfarçar indo
          e voltando) e com o fundo de estúdio levantado pra branco puro via
          curves=, igual aos outros. */}
      <section
        className="relative flex min-h-screen w-full items-center overflow-hidden bg-white"
        style={{
          marginTop: "calc(-1 * var(--nav-h, 0px))",
          paddingTop: "var(--nav-h, 0px)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 bg-white/55"
          style={{ height: "var(--nav-h, 0px)" }}
        />

        <div
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] lg:block"
          style={{ background: "linear-gradient(to right, transparent, white 45%)" }}
        />

        {/* Mobile: texto e vídeo (sem corte, object-contain) juntos num
            único bloco em fluxo normal — a seção inteira centraliza esse
            bloco verticalmente, sem vão entre os dois. No desktop esse
            bloco some (`lg:hidden`) e dá lugar ao vídeo full-bleed +
            texto alinhado à direita logo abaixo. */}
        <div className="relative z-10 flex w-full flex-col items-center px-6 text-center lg:hidden">
          <p className="text-sm font-bold uppercase tracking-widest text-[#058fa1]">
            Sobre
          </p>
          <h1 className="mt-2 text-4xl font-black text-[#1a1a1a] sm:text-5xl">
            Oi, eu sou o Tales
          </h1>
          <p className="mt-3 text-lg text-[#4a4a4a]">
            Gestor de Design, Service Designer e UX Researcher com mais de
            15 anos unindo liderança, design e tecnologia.
          </p>
          <video
            src="https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/hero-sobre.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="mt-8 h-auto w-[80%] max-w-xs object-contain"
          />
        </div>

        {/* Desktop: vídeo full-bleed atrás do texto alinhado à direita,
            como os outros heróis de vídeo do site. */}
        <video
          src="https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/hero-sobre.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 hidden h-full w-full object-cover object-[20%_center] lg:block"
        />

        <div className="relative hidden w-full justify-end px-6 lg:flex lg:px-16 xl:px-24">
          <div className="flex flex-col items-end text-right lg:max-w-xl">
            <p className="text-sm font-bold uppercase tracking-widest text-[#058fa1]">
              Sobre
            </p>
            <h1 className="mt-2 text-4xl font-black text-[#1a1a1a] sm:text-5xl lg:text-6xl">
              Oi, eu sou o Tales
            </h1>
            <p className="mt-3 text-lg text-[#4a4a4a]">
              Gestor de Design, Service Designer e UX Researcher com mais de
              15 anos unindo liderança, design e tecnologia.
            </p>
          </div>
        </div>
      </section>

      {/* Fundo branco liso segue o do vídeo acima, sem faixa/emenda — mesma
          lógica de continuidade usada em /cases. Cores literais (não os
          tokens do tema escuro do site, que resolveriam pra tons claros
          ilegíveis aqui). */}
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <Reveal>
          <p className="text-lg text-[#4a4a4a]">
            Olá, eu sou o Tales. o/ Mas pode me chamar de Taleco =)
          </p>
          <div className="mt-4 space-y-4 text-[#1a1a1a]">
            <p>
              Gestor de Design, Service Designer e UX Researcher com mais de 15
              anos de experiência em UX, Produto e Liderança. Desde 2010
              trabalhando em grandes empresas e atendendo clientes de diversas
              áreas usando ferramentas e metodologias de design aplicadas a
              resultados.
            </p>
            <p>
              Passagem por Mercado Livre, UOL, CI&amp;T, Vivo, Carrefour,
              SulAmérica, Dasa, RD/Drogasil, Rakuten, Casas Bahia, Cofco e
              Mercado Pago. Especialista em soluções centradas no usuário,
              liderando times multidisciplinares com Design Thinking e Lean
              UX.
            </p>
            <p>
              Foi embaixador do comitê de diversidade na CI&amp;T (comunidade
              LGBTQIA+) e mentor de bootcamps na CI&amp;T e Mercado Livre.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="mt-16 text-2xl font-black text-[#1a1a1a]">De perto</h2>
          <div className="mt-6">
            <PhotoGallery photos={GALLERY_PHOTOS} />
          </div>
        </Reveal>

        <h2 className="mt-16 text-2xl font-black text-[#1a1a1a]">Depoimentos</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <blockquote className="h-full rounded-2xl border border-[#e5e5e7] bg-[#f6f6f7] p-6">
                <div className="flex gap-1 text-[#058fa1]">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} size={14} className="fill-[#058fa1]" />
                  ))}
                </div>
                <p className="mt-3 text-[#4a4a4a]">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 text-sm font-bold text-[#1a1a1a]">
                  {t.name}
                  <span className="block font-normal text-[#4a4a4a]">{t.role}</span>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
