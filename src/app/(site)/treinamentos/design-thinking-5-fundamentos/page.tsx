import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getCursoBySlug, getTurmaAberta } from "@/lib/turmas";
import { Reveal } from "@/components/reveal";
import { MatriculaDrawer } from "@/components/matricula-drawer";
import {
  ArrowUpRight,
  CheckCircle,
  Compass,
  Heart,
  Users,
  Sparkles,
  Rocket,
  Star,
} from "@mynaui/icons-react";

const MASTERCLASS_ILUSTRACAO =
  "https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/masterclass/solving-problem-illustration.png";

const STORAGE_DEPOIMENTOS =
  "https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/depoimentos";

// Depoimentos de quem já fez a masterclass (distintos dos depoimentos
// gerais de trabalho na home) — vindos das recomendações do LinkedIn.
const DEPOIMENTOS_ALUNOS = [
  {
    name: "Vladimir Rodrigues de Lima",
    role: "Scrum Master | Agile Coach | PSM I",
    quote:
      "Fiz o curso de Fundamentos do Design Thinking ministrado pelo Tales Pereira e foi uma ótima experiência. Muito conhecimento, casos práticos e uma excelente didática. O tempo passou voando. Certamente seguirei fazendo mais cursos com ele!",
    photo: `${STORAGE_DEPOIMENTOS}/vladimir.jpeg`,
  },
  {
    name: "Leonardo Sathler",
    role: "Innovation and Experience Specialist",
    quote:
      "Excelente experiência no treinamento de Fundamentos do Design Thinking ministrado pelo Tales Pereira na TP Treinamentos! O Tales se destaca pela didática impecável e pela forma prática como conduz o aprendizado. O treinamento trouxe conceitos essenciais e metodologias que agregaram imensamente à minha carreira.",
    photo: `${STORAGE_DEPOIMENTOS}/leonardo.jpeg`,
    linkedin: "https://www.linkedin.com/in/sathler/",
  },
];

export const metadata: Metadata = {
  title: "Os 5 Fundamentos do Design Thinking — TPointic",
  description:
    "Masterclass ao vivo, online e colaborativa com Tales Pereira. Pague quanto quiser.",
};

const FUNDAMENTOS = [
  {
    icon: Compass,
    title: "Pensamento Flexível",
    description: "Questione suposições e recombine ideias com agilidade.",
  },
  {
    icon: Heart,
    title: "Empatia",
    description: "O design começa e termina no ser humano.",
  },
  {
    icon: Users,
    title: "Cooperação",
    description: "Inteligência coletiva: construir com times diversos.",
  },
  {
    icon: Sparkles,
    title: "Imaginação",
    description: "Ideias radicais hoje são produtos de amanhã.",
  },
  {
    icon: Rocket,
    title: "Experimentação",
    description: "Prototipar rápido, testar cedo, aprender com falhas.",
  },
];

export default async function CursoDesignThinkingPage() {
  const curso = await getCursoBySlug("design-thinking-5-fundamentos");
  const turma = curso ? await getTurmaAberta(curso.id) : null;

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden">
        <div className="hero-gradient absolute inset-0 opacity-20" />
        <div className="relative mx-auto grid max-w-5xl items-center gap-8 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-coral">
              Masterclass
            </p>
            <h1 className="mt-2 text-4xl font-black text-navy sm:text-5xl">
              Os 5 Fundamentos do Design Thinking
            </h1>
            <p className="mt-4 text-lg text-slate">
              Formato ao vivo, online e colaborativo, com apoio de agentes de IA.
              Pague quanto quiser.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-slate">
              <span className="flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1">
                <CheckCircle size={14} className="text-coral" /> Sem taxa de
                cancelamento
              </span>
              <span className="flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1">
                <CheckCircle size={14} className="text-coral" /> Certificado
                digital
              </span>
            </div>

            <MatriculaDrawer
              turma={turma}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
            >
              {turma ? "Garantir minha vaga" : "Ver próxima turma"}
              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </MatriculaDrawer>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative mx-auto aspect-square w-full max-w-sm">
              <Image
                src={MASTERCLASS_ILUSTRACAO}
                alt="Ilustração de uma pessoa resolvendo um problema complexo"
                fill
                className="object-contain"
                priority
                sizes="(min-width: 1024px) 384px, 60vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border bg-surface/30">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <Reveal>
            <h2 className="text-2xl font-black text-navy">Os 5 fundamentos</h2>
          </Reveal>
          <div className="mt-8 space-y-6">
            {FUNDAMENTOS.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-coral">
                    <f.icon size={20} />
                  </span>
                  <div>
                    <h3 className="font-bold text-navy">{f.title}</h3>
                    <p className="text-sm text-slate">{f.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <h2 className="text-2xl font-black text-navy">Instrutor</h2>
          <p className="mt-4 text-navy">
            <strong>Tales Pereira</strong> — Gestor de Design, Service Designer
            e UX Researcher com mais de 15 anos de experiência em UX, Produto e
            Liderança. Passagem por Mercado Livre, UOL, CI&amp;T, Vivo,
            Carrefour, SulAmérica, Dasa, RD/Drogasil, Rakuten, Casas Bahia,
            Cofco e Mercado Pago.
          </p>
          <Link
            href="/sobre"
            className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-coral"
          >
            Conheça mais sobre o Tales <ArrowUpRight size={16} />
          </Link>
        </Reveal>
      </section>

      <section className="border-t border-border bg-surface/30 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="text-2xl font-black text-navy">
              Quem já fez, recomenda
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {DEPOIMENTOS_ALUNOS.map((d, i) => (
              <Reveal key={d.name} delay={i * 0.1}>
                <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6">
                  <div className="flex gap-1 text-coral">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} size={14} className="fill-coral" />
                    ))}
                  </div>
                  <p className="mt-3 flex-1 text-sm text-slate">
                    &ldquo;{d.quote}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={d.photo}
                        alt={d.name}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-navy">
                        {d.name}
                      </p>
                      <p className="truncate text-xs text-gray">{d.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="matricula"
        className="border-t border-border bg-surface/30 px-6 py-16 text-center"
      >
        <Reveal>
          {turma && (
            <p className="text-sm font-bold text-slate">
              Próxima turma: {turma.nome}
            </p>
          )}
          <MatriculaDrawer
            turma={turma}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
          >
            {turma ? "Garantir minha vaga" : "Ver próxima turma"}
            <ArrowUpRight size={18} />
          </MatriculaDrawer>
        </Reveal>
      </section>
    </main>
  );
}
