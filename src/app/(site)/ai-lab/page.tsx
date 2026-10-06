import type { Metadata } from "next";
import { AiLabHub } from "@/components/ai-lab-hub";
import { Reveal } from "@/components/reveal";
import { AI_LAB_NAME, labAsset } from "@/lib/ai-lab";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `${AI_LAB_NAME} — ${SITE_NAME}`,
  description:
    "Experimentos, projetos pessoais e skills de IA de Tales Pereira: jogos, quizzes e SaaS criados com Claude Code, v0 e ElevenLabs.",
};

const TOOLS = [
  "Claude Code",
  "ElevenLabs",
  "v0",
  "Next.js",
  "Supabase",
  "Vercel",
  "Blender",
  "Tripo",
];

export default function AiLabPage() {
  return (
    <main className="flex-1">
      <section className="relative flex flex-col overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <video
            src={labAsset("hero-bg-2.mp4")}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-transparent to-bg" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[340px] w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16 sm:min-h-[440px]">
          <h1 className="animate-fade-up text-7xl font-black leading-none sm:text-9xl">
            <span className="lab-text">{AI_LAB_NAME}</span>
          </h1>
          <p
            className="animate-fade-up mt-6 max-w-2xl text-xl text-white sm:text-2xl"
            style={{ animationDelay: "0.1s" }}
          >
            Onde eu testo ideias antes de virarem produto: jogos, quizzes, SaaS
            e as skills que sobram de cada experimento.
          </p>
        </div>

        <div className="relative z-10 overflow-hidden border-t border-border bg-bg/40 py-3 backdrop-blur-sm">
          <div className="lab-marquee-track flex w-max gap-10 whitespace-nowrap text-sm font-bold uppercase tracking-widest text-gray">
            {[...TOOLS, ...TOOLS].map((t, i) => (
              <span key={i} className="flex items-center gap-10">
                {t}
                <span className="text-coral">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <AiLabHub />
        </Reveal>
      </section>
    </main>
  );
}
