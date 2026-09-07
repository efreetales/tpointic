import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  Users,
  Rocket,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
} from "@mynaui/icons-react";
import { getCases } from "@/lib/cases";
import { Reveal } from "@/components/reveal";
import { Counter } from "@/components/counter";
import { LogoMarquee } from "@/components/logo-marquee";
import { CaseParallaxShowcase } from "@/components/case-parallax-showcase";
import { TestimonialsCarousel, type Testimonial } from "@/components/testimonials-carousel";

const MASTERCLASS_ILUSTRACAO =
  "https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/masterclass/solving-problem-illustration.png";

const SERVICOS = [
  {
    icon: Compass,
    title: "Service Design",
    description: "Serviços úteis, utilizáveis e viáveis, ponta a ponta.",
  },
  {
    icon: Users,
    title: "UX Research",
    description: "Pesquisa qualitativa e quantitativa para decisões com dados.",
  },
  {
    icon: Rocket,
    title: "Design Leadership",
    description: "Visão estratégica de UX e times de alta performance.",
  },
  {
    icon: ShieldCheck,
    title: "Mentoring",
    description: "Orientação para designers em início ou transição de carreira.",
  },
];

const STORAGE_DEPOIMENTOS =
  "https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/depoimentos";

// Depoimentos vindos do talespereira.com e das recomendações recebidas no
// LinkedIn (linkedin.com/in/talespereira/details/recommendations). Alguns
// ainda não têm link de perfil confirmado — entram assim mesmo e o link é
// completado depois (nunca inventar uma URL de perfil).
const TESTIMONIALS: Testimonial[] = [
  {
    name: "Pablo Turazzi Vilanova",
    role: "UX Research Technical Leader @ Mercado Livre",
    quote:
      "Trabalhar com o Tales foi uma vivência espetacular. Ele dispõe de amplo conhecimento de metodologias de pesquisa e boas práticas de design e é alguém com quem qualquer pessoa pode contar no dia-a-dia – propositivo, inteligente, bem-humorado, sociável e generoso. Adoraria trabalhar com ele novamente.",
    photo: `${STORAGE_DEPOIMENTOS}/pablo.jpeg`,
    linkedin: "https://www.linkedin.com/in/pabloturazzi/",
  },
  {
    name: "Milene Ferraz",
    role: "UX Design Lead at Mercado Livre / Mercado Pago LATAM",
    quote:
      "Fui dupla do Tales na CI&T em dois clientes (Vivo e Cofco). Ele liderando iniciativas de UX e eu de UI. Foi um período muito rico de trocas, parceria, colaboração e diversão. Sempre se destacou em puxar o negócio para valorizar o design centrado nas pessoas usuárias, através de dinâmicas colaborativas entre diversas áreas.",
    photo: `${STORAGE_DEPOIMENTOS}/milene.jpeg`,
    linkedin: "https://www.linkedin.com/in/milene-ferraz-62788216/",
  },
  {
    name: "Luciana Terceiro",
    role: "Sr. Product Designer & Service Designer",
    quote:
      "I have the pleasure to work with Tales during 2 years at UOL and I can tell he is a great partner, with a critical and accurate vision about the projects he was involved. He always had the initiative to conduct user researches and had lead the dev team to participate in co-creation sessions to improve the user experience.",
    photo: `${STORAGE_DEPOIMENTOS}/luciana.jpeg`,
    linkedin: "https://www.linkedin.com/in/luterceiro/",
  },
  {
    name: "Gabriel Gonzaga",
    role: "Líder de UX @ Mercado Livre | Experiência do Usuário",
    quote:
      "Trabalhei com o Tales em duas oportunidades e situações diferentes e, em ambas, ficou claro a sua paixão pela disciplina de UX e determinação em gerar um ambiente saudável de trabalho e também sua capacidade de entregar experiências, como analista e como líder, que colocam as necessidades dos usuários no centro da discussão.",
    photo: `${STORAGE_DEPOIMENTOS}/gabriel.jpeg`,
    linkedin: "https://www.linkedin.com/in/gabrielmgonzaga/",
  },
  {
    name: "Romeu Ivolela Neto",
    role: "AI Product Manager | MSc in Philosophy & AI",
    quote:
      "Eu tive o prazer de trabalhar com o Tales no Shopping UOL. Sua sensibilidade e empatia com os usuários, somados ao seu profundo conhecimento na área de UX, o tornam um profissional excelente. Se todos os produtos tivessem um profissional como o Tales, com certeza teríamos produtos melhores no mercado.",
    photo: `${STORAGE_DEPOIMENTOS}/romeu.jpeg`,
    linkedin: "https://www.linkedin.com/in/rivolela/",
  },
  {
    name: "Camilo Luna",
    role: "Ux project lead at Mercado Libre",
    quote:
      "Tales es una persona increíble, tanto en lo personal como en lo profesional. Tuve la suerte de trabajar con él durante más de un año, con él como mi líder. Su conocimiento en procesos y estrategia de UX, junto con su habilidad para liderar equipos, realmente destacan.",
    photo: `${STORAGE_DEPOIMENTOS}/camilo-luna.jpeg`,
    linkedin: "https://www.linkedin.com/in/camilo-luna-97738720/",
  },
  {
    name: "Mariana De Sena Lima",
    role: "Group Product Manager @ Mercado Livre (NASDAQ: MELI)",
    quote:
      "Tales sempre foi muito colaborativo e focado no cuidado com o time e na performance, especialmente no aspecto de gestão. Além disso, sempre trouxe provocações importantes sobre a experiência do usuário.",
    photo: `${STORAGE_DEPOIMENTOS}/mariana.jpeg`,
    linkedin: "https://www.linkedin.com/in/mariana-de-sena-lima-1aa97434/",
  },
  {
    name: "Leonardo Sathler",
    role: "Innovation and Experience Specialist",
    quote:
      "Excelente experiência no treinamento de Fundamentos do Design Thinking ministrado pelo Tales Pereira na TP Treinamentos! O Tales se destaca pela didática impecável e pela forma prática como conduz o aprendizado. O treinamento trouxe conceitos essenciais e metodologias que agregaram imensamente à minha carreira.",
    photo: `${STORAGE_DEPOIMENTOS}/leonardo.jpeg`,
    linkedin: "https://www.linkedin.com/in/sathler/",
  },
  {
    name: "Eder Martins",
    role: "Produto Digital & Estratégia de Experiência",
    quote:
      "Já tive a oportunidade de trabalhar com o Tales mais de uma vez, ele me ajudou como parceiro, líder e colega de trabalho. Ensinou coisas desde antes da minha profissão existir e me ajudou a trilhar este caminho. Considero uma parte do meu sucesso ao olhar clínico e crítico dele.",
    photo: `${STORAGE_DEPOIMENTOS}/eder.jpeg`,
    linkedin: "https://www.linkedin.com/in/eder-martins-36a95126/",
  },
  {
    name: "Laura Molina Castilla",
    role: "UI/UX Sr. Designer en Mercado Libre",
    quote:
      "Tales es una gran profesional que se destaca por su agilidad en resolver desafíos y apoyar a sus equipos de trabajo, generando ambientes comprometidos y proactivos. Siempre dispuesto a aportar conocimiento y a gestionar proyectos complejos, logrando excelentes resultados.",
    photo: `${STORAGE_DEPOIMENTOS}/laura-molina.jpeg`,
    linkedin: "https://www.linkedin.com/in/laumolcas/",
  },
  {
    name: "Felipe Rodrigues",
    role: "Director of Engineering @ LEGO Group",
    quote:
      "I had the opportunity to work with Tales in some projects, and as a team we did a great job. He is a talented designer, and for me, was a pleasure to work with him.",
    photo: `${STORAGE_DEPOIMENTOS}/felipe.jpeg`,
  },
  {
    name: "Vladimir Rodrigues de Lima",
    role: "Scrum Master | Agile Coach | PSM I",
    quote:
      "Fiz o curso de Fundamentos do Design Thinking ministrado pelo Tales Pereira e foi uma ótima experiência. Muito conhecimento, casos práticos e uma excelente didática. O tempo passou voando. Certamente seguirei fazendo mais cursos com ele!",
    photo: `${STORAGE_DEPOIMENTOS}/vladimir.jpeg`,
  },
];

export default async function Home() {
  const cases = (await getCases()).slice(0, 3);

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-gradient absolute inset-0" />
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-overlay"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src="https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/hero-bg.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-transparent" />

        {/* Foto — fica fora do fluxo centralizado do texto e sempre rente à
            faixa de logos abaixo, independente de quanto texto houver. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto hidden max-w-5xl px-6 lg:flex lg:justify-end">
          <div
            className="animate-fade-up relative aspect-[2/3] w-full max-w-[380px]"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="absolute inset-0 rounded-full bg-coral/25 blur-3xl" />
            <Image
              src="https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/tales-hero-v2.webp"
              alt="Tales Pereira"
              fill
              className="relative object-contain object-bottom"
              priority
              quality={95}
              sizes="380px"
            />
          </div>
        </div>

        {/* Texto — centralizado verticalmente numa área de altura mínima
            própria, sem depender da altura da foto ao lado. */}
        <div className="relative mx-auto flex min-h-[70vh] max-w-5xl items-center px-6 sm:min-h-[75vh] lg:min-h-[80vh]">
          <div className="flex flex-col items-start lg:max-w-[55%]">
            <div className="animate-fade-up flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-coral backdrop-blur-sm">
              <Sparkles size={14} /> Tales Pereira &middot; UX Leader
            </div>
            <h1
              className="animate-fade-up glow-text mt-6 max-w-xl text-4xl font-black leading-[1.05] text-navy sm:text-5xl lg:text-6xl"
              style={{ animationDelay: "0.1s" }}
            >
              Design estratégico turbinado por IA.
            </h1>
            <p
              className="animate-fade-up mt-6 max-w-xl text-lg text-white"
              style={{ animationDelay: "0.2s" }}
            >
              Há mais de 15 anos unindo liderança, design e tecnologia para
              transformar problemas complexos em resultados.
            </p>
            <div
              className="animate-fade-up mt-10 flex flex-wrap gap-4"
              style={{ animationDelay: "0.3s" }}
            >
              <Link
                href="/cases"
                className="group flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
              >
                Ver portfólio
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
              <Link
                href="/treinamentos/design-thinking-5-fundamentos"
                className="rounded-full border border-white/40 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Conheça a masterclass de Design Thinking
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Empresas / social proof strip */}
      <Reveal>
        <section className="border-y border-border bg-white py-8">
          <LogoMarquee />
        </section>
      </Reveal>

      {/* Serviços */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <p className="text-center text-sm font-bold uppercase tracking-widest text-coral">
            Frentes de atuação
          </p>
          <h2 className="mt-2 text-center text-3xl font-black text-navy">
            Como eu posso ajudar
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICOS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="group h-full rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-coral">
                <s.icon
                  size={28}
                  className="text-coral transition-transform group-hover:scale-110"
                />
                <h3 className="mt-4 font-bold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm text-slate">{s.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-8 flex justify-center">
            <Link
              href="/servicos"
              className="inline-flex items-center gap-1 text-sm font-bold text-coral hover:underline"
            >
              Ver todos os serviços <ArrowUpRight size={16} />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Cases */}
      {cases.length > 0 && (
        <section className="relative border-t border-border">
          <CaseParallaxShowcase cases={cases} />

          <Link
            href="/cases"
            className="group animated-gradient relative flex items-center justify-center overflow-hidden px-6 py-24 text-center"
          >
            <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/10" />
            <Reveal>
              <span className="relative inline-flex items-center gap-3 text-3xl font-black text-white sm:text-5xl">
                Ver portfólio completo
                <ArrowUpRight
                  size={40}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </span>
            </Reveal>
          </Link>
        </section>
      )}

      {/* Liderança */}
      <section className="border-t border-border bg-surface px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-coral">
                  Case de Liderança · Check Survey 2023
                </p>
                <h2 className="mt-2 text-3xl font-black text-navy">
                  Liderança que gera engajamento de verdade
                </h2>
                <p className="mt-3 max-w-xl text-slate">
                  Como conduzi 8 designers no Mercado Livre a 92% de
                  engajamento e 88% de excelência — e as ações concretas por
                  trás desses números.
                </p>
                <Link
                  href="/lideranca"
                  className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-coral hover:underline"
                >
                  Ver o case completo <ArrowUpRight size={16} />
                </Link>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-5xl font-black text-coral">
                    <Counter value="92%" />
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray">
                    Engagement
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-5xl font-black text-coral">
                    <Counter value="88%" />
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray">
                    Excelência
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Masterclass CTA */}
      <section className="hero-gradient relative overflow-hidden px-6 py-20">
        <div className="absolute inset-0 bg-black/40" />
        <Reveal>
          <div className="relative mx-auto grid max-w-5xl items-center gap-8 text-center lg:grid-cols-[1fr_auto] lg:text-left">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/80">
                Masterclass
              </p>
              <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                Os 5 Fundamentos do Design Thinking
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/85 lg:mx-0">
                Ao vivo, online e colaborativa, com apoio de agentes de IA.
                Pague quanto quiser.
              </p>
              <Link
                href="/treinamentos/design-thinking-5-fundamentos"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
              >
                Garantir minha vaga <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="relative mx-auto hidden h-64 w-64 shrink-0 sm:block">
              <Image
                src={MASTERCLASS_ILUSTRACAO}
                alt=""
                fill
                className="object-contain"
                sizes="256px"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Depoimentos */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="text-center text-sm font-bold uppercase tracking-widest text-coral">
              Depoimentos
            </p>
            <h2 className="mt-2 text-center text-3xl font-black text-navy">
              O que dizem sobre o meu trabalho
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10">
              <TestimonialsCarousel items={TESTIMONIALS} />
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex justify-center">
              <Link
                href="/sobre"
                className="inline-flex items-center gap-1 text-sm font-bold text-coral hover:underline"
              >
                Conheça mais sobre o Tales <ArrowUpRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
