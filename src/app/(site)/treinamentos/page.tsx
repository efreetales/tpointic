import Image from "next/image";
import type { Metadata } from "next";
import { ArrowUpRight } from "@mynaui/icons-react";
import { Reveal } from "@/components/reveal";
import { MASTERCLASS_URL, SITE_NAME } from "@/lib/site";

const MASTERCLASS_ILUSTRACAO =
  "https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/masterclass/solving-problem-illustration.png";

export const metadata: Metadata = {
  title: `Treinamentos — ${SITE_NAME}`,
  description:
    "Masterclass Os 5 Fundamentos do Design Thinking, com Tales Pereira.",
};

export default function TreinamentosPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Reveal>
        <p className="text-sm font-bold uppercase tracking-widest text-coral">
          Treinamentos
        </p>
        <h1 className="mt-2 text-4xl font-black text-navy">Cursos</h1>
      </Reveal>

      <Reveal delay={0.1}>
        <a
          href={MASTERCLASS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="masterclass-theme group relative mt-10 flex flex-col-reverse items-center gap-6 rounded-2xl border-[1.5px] p-7 shadow-[0_2px_12px_rgba(45,49,66,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(239,131,84,0.12)] sm:flex-row"
          // Paleta do site da aula: fundo #fcfcfc, coral #ee8355, texto #2e3141.
          style={{
            background:
              "linear-gradient(135deg, rgba(238,131,85,0.06), rgba(246,178,107,0.04)), #fcfcfc",
            borderColor: "rgba(238,131,85,0.25)",
          }}
        >
          <div className="flex-1">
            <p className="text-[0.8rem] font-bold uppercase tracking-[0.12em] text-coral">
              Masterclass
            </p>
            <h2 className="mt-2 text-xl font-extrabold text-navy">
              Os <span className="text-coral">5 Fundamentos</span> do Design Thinking
            </h2>
            <p className="mt-2 text-sm text-slate">
              Masterclass ao vivo, online e colaborativa, com apoio de agentes
              de IA. Pague quanto quiser — sem taxa de cancelamento e com
              certificado digital.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-coral">
              Ver curso
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>
          <div className="relative h-28 w-28 shrink-0">
            <Image
              src={MASTERCLASS_ILUSTRACAO}
              alt=""
              fill
              className="object-contain"
              sizes="112px"
            />
          </div>
        </a>
      </Reveal>
    </main>
  );
}
