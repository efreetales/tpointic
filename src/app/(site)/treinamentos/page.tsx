import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "@mynaui/icons-react";
import { Reveal } from "@/components/reveal";

const MASTERCLASS_ILUSTRACAO =
  "https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/masterclass/solving-problem-illustration.png";

export const metadata: Metadata = {
  title: "Treinamentos — TPointic",
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
        <Link
          href="/treinamentos/design-thinking-5-fundamentos"
          className="group mt-10 flex flex-col-reverse items-center gap-6 rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-coral sm:flex-row"
        >
          <div className="flex-1">
            <h2 className="text-xl font-black text-navy">
              Os 5 Fundamentos do Design Thinking
            </h2>
            <p className="mt-2 text-sm text-slate">
              Masterclass ao vivo, online e colaborativa, com apoio de agentes
              de IA. Pague quanto quiser (R$5 a R$500) — sem taxa de
              cancelamento e com certificado digital.
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
        </Link>
      </Reveal>
    </main>
  );
}
