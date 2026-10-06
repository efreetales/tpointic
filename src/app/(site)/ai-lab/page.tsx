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
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <video
            src={labAsset("hero-bg.mp4")}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/20 to-bg" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 pb-16 pt-20 sm:pt-28">
          <h1 className="animate-fade-up text-6xl font-black leading-none sm:text-8xl">
            <span className="lab-text">{AI_LAB_NAME}</span>
          </h1>
          <p
            className="animate-fade-up mt-6 max-w-xl text-lg text-slate"
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
