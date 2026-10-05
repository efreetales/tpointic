"use client";

// Segunda exploração de hero (substitui o teste anterior de logo-como-máscara,
// já descartado). Referência: cartooneast.in — fundo branco liso, vídeo do
// personagem full-bleed como o PRÓPRIO fundo do hero (não um elemento ao
// lado do texto), sem gradiente/overlay/moldura de nenhum tipo — o texto
// simplesmente se desloca pra um canto que sobra livre sobre o vídeo.
// Puramente exploratório — nada disso está no ar.

export default function HeroTestPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <video
        src="/hero-puppet-laptop-boomerang.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Mesmos textos do hero original (page.tsx da home) — só o layout
          muda (alinhado à direita, sobre o vídeo em vez do gradiente). */}
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-end px-6 py-16">
        <div className="flex flex-col items-end text-right lg:max-w-xl">
          <div className="flex items-center gap-2 rounded-full border border-[#1a1a1a]/15 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#1a1a1a] backdrop-blur-sm">
            Tales Pereira · UX Leader
          </div>
          <h1 className="mt-6 text-4xl font-black leading-[1.05] text-[#1a1a1a] sm:text-5xl lg:text-6xl">
            Design estratégico turbinado por IA.
          </h1>
          <p className="mt-6 text-lg text-[#4a4a4a]">
            Há mais de 15 anos unindo liderança, design e tecnologia para
            transformar problemas complexos em resultados.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-end gap-4">
            <a
              href="/cases"
              className="rounded-full bg-[#1a1a1a] px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
            >
              Ver portfólio
            </a>
            <a
              href="/treinamentos/design-thinking-5-fundamentos"
              className="rounded-full border-2 border-[#1a1a1a] px-6 py-3 text-sm font-bold text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a] hover:text-white"
            >
              Conheça a masterclass de Design Thinking
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
