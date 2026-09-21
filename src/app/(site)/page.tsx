import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@mynaui/icons-react";
import { getCases } from "@/lib/cases";
import { MASTERCLASS_URL } from "@/lib/site";
import { Reveal } from "@/components/reveal";
import { HighlightText } from "@/components/highlight-text";
import { CheckSurveyStats } from "@/components/check-survey-stats";
import { LogoMarquee } from "@/components/logo-marquee";
import { CaseParallaxShowcase } from "@/components/case-parallax-showcase";
import { TestimonialsCarousel, type Testimonial } from "@/components/testimonials-carousel";

const MASTERCLASS_ILUSTRACAO =
  "https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/masterclass/solving-problem-illustration.png";

// Foto com o boneco Taleco — mesma usada no hero de /sobre, reaproveitada
// aqui no bloco que substitui os cards de "Frentes de atuação".
const TALES_PHOTO =
  "https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/tales-com-puppet-2-flush.png";

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
      {/* Hero — vídeo full-bleed como fundo (referência cartooneast.in) em
          vez do hero-gradient + foto original. Mesmos textos/CTAs de
          sempre, só o layout muda (alinhado à direita, sobre fundo branco
          liso). */}
      {/* `marginTop`/`paddingTop` com a var `--nav-h` (publicada pelo Nav,
          que fica sticky/transparente por cima) puxam a seção pra trás do
          header e recompensam por dentro, pra o texto continuar centralizado
          na mesma janela visível de sempre — sem isso o vídeo só começaria
          DEPOIS do header (uma faixa própria, não "uma coisa só"). */}
      <section
        className="relative min-h-screen overflow-hidden bg-[#e0e1e6]"
        style={{
          marginTop: "calc(-1 * var(--nav-h, 0px))",
          height: "calc(100vh + var(--nav-h, 0px))",
        }}
      >
        <video
          src="https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/hero-puppet.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div
          className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-end px-6 py-24"
          style={{ paddingTop: "var(--nav-h, 0px)" }}
        >
          <div className="flex flex-col items-end text-right lg:max-w-xl">
            <h1 className="text-4xl font-black leading-[1.05] text-[#1a1a1a] sm:text-5xl lg:text-6xl">
              Design estratégico turbinado por IA.
            </h1>
            <p className="mt-6 text-lg text-[#4a4a4a]">
              Há mais de 15 anos unindo liderança, design e tecnologia para
              transformar problemas complexos em resultados.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-end gap-4">
              <Link
                href="/cases"
                className="group flex items-center gap-2 rounded-full bg-[#058fa1] px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
              >
                Ver portfólio
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
              <a
                href={MASTERCLASS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-[#1a1a1a] px-6 py-3 text-sm font-bold text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a] hover:text-white"
              >
                Conheça a masterclass de Design Thinking
              </a>
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

      {/* "Quem sou eu" — mesmo bloco-hero usado em /sobre (foto sticky +
          saudação + citação), reaproveitado aqui no lugar dos cards de
          "Frentes de atuação" (que já vivem em /sobre). Entra logo depois
          dos cases em destaque, com um CTA pra /sobre no fim. O `<h2>` da
          citação (era `<h1>` em /sobre) evita duplicar o h1 do hero de
          vídeo acima. Mesmas cores literais claras e mesmo degradê radial
          fixo — ver comentário equivalente em `sobre/page.tsx` pros
          detalhes de cada técnica (sticky sem overflow-hidden ancestral,
          `backgroundAttachment: fixed` pra não ter costura entre as duas
          colunas, `min-h-[calc(100vh-var(--nav-h))]` pra centralizar na
          dobra visível). */}
      <div className="relative flex w-full flex-col border-t border-border lg:flex-row lg:items-start">
        <div
          className="relative top-0 hidden h-screen w-[45%] lg:sticky lg:block lg:flex-none lg:overflow-hidden"
          style={{
            background:
              "radial-gradient(140% 120% at 25% 15%, #eef0f3 0%, #dfe3e8 45%, #d1d6de 100%)",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute bottom-0 left-1/2 aspect-square w-[70%] -translate-x-1/2 rounded-full bg-white/50 blur-3xl" />
          <div className="animate-fade-up absolute inset-x-0 bottom-0 top-24">
            <Image
              src={TALES_PHOTO}
              alt="Tales Pereira"
              fill
              className="relative -scale-x-100 object-contain object-bottom"
              sizes="45vw"
              priority
            />
          </div>
        </div>

        <div
          className="w-full lg:w-[55%] lg:flex-none"
          style={{
            background:
              "radial-gradient(140% 120% at 25% 15%, #eef0f3 0%, #dfe3e8 45%, #d1d6de 100%)",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="px-6 pb-16 pt-20 lg:px-16 lg:pb-0 lg:pt-0">
            <Reveal>
              {/* Mobile/tablet: foto empilhada acima do texto. Some no
                  desktop (`lg:hidden`), onde a coluna fixa assume. */}
              <div className="relative mb-10 w-full max-w-[280px] lg:hidden">
                <div className="absolute bottom-0 left-1/2 aspect-square w-[140%] -translate-x-1/2 rounded-full bg-white/50 blur-3xl" />
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={TALES_PHOTO}
                    alt="Tales Pereira"
                    fill
                    className="relative -scale-x-100 object-contain object-bottom"
                    sizes="280px"
                    priority
                  />
                </div>
              </div>

              <div className="lg:flex lg:min-h-[calc(100vh-var(--nav-h,0px))] lg:flex-col lg:justify-center">
                <p className="relative text-6xl font-black leading-[0.95] text-[#1a1a1a] sm:text-7xl lg:text-8xl">
                  Olá,
                  <br />
                  eu sou o Tales.
                </p>
                <p className="relative mt-2 text-3xl font-black leading-tight text-[#1a1a1a] sm:text-4xl">
                  Mas pode me chamar de <HighlightText>Taleco</HighlightText>
                </p>
                <div className="mt-6 space-y-4 text-[#4a4a4a]">
                  <p>
                    Nordestino de Maceió, Especialista em Design Centrado no
                    Usuário pela Universidade Positivo e entusiasta do uso
                    da Inteligência Artificial como ferramenta para
                    potencializar e acelerar meu trabalho como designer. Há
                    16 anos construo soluções na interseção entre pessoas,
                    negócio e tecnologia, sempre movido por curiosidade e
                    pelo desejo de gerar impacto real.
                  </p>
                  <p>
                    Fora do trabalho, vivo entre filmes de terror, MPB,
                    videogames e a Atena, minha pitbull medrosa que me
                    lembra todos os dias que aparência nunca conta a
                    história inteira.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="px-6 pb-16 lg:px-16 lg:pb-40">
            <Reveal delay={0.05}>
              <div className="relative">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-2 -top-8 select-none font-serif text-7xl font-black text-[#058fa1]/15 sm:-top-10 sm:text-8xl"
                >
                  &ldquo;
                </span>
                <h2 className="relative text-4xl font-black leading-[1.05] text-[#058fa1] sm:text-5xl lg:text-6xl">
                  Não me interessa criar produtos bonitos. Me interessa
                  resolver problemas que importam.
                </h2>
              </div>
              <Link
                href="/sobre"
                className="group relative mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#058fa1] px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
              >
                Saber mais sobre mim
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Liderança */}
      <section className="border-t border-border bg-surface px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                {/* Selo branco: o wordmark "mercado livre" é azul-marinho e
                    some direto no fundo escuro do bloco. */}
                <div className="mb-5 inline-flex rounded-xl bg-white px-4 py-2.5">
                  <Image
                    src="https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/clientes/mercado-livre-logo-8-1.png"
                    alt="Mercado Livre"
                    width={4096}
                    height={1042}
                    sizes="160px"
                    className="h-9 w-auto"
                  />
                </div>
                <p className="text-sm font-bold uppercase tracking-widest text-coral">
                  Case de Liderança · Check Survey 2023
                </p>
                <h2 className="mt-2 text-3xl font-black text-navy">
                  Liderança que gera engajamento de verdade
                </h2>
                <p className="mt-3 max-w-xl text-slate">
                  Como conduzi 8 designers no Mercado Livre a 92% de
                  engajamento e 88% de execução — e as ações concretas por
                  trás desses números.
                </p>
                <Link
                  href="/lideranca"
                  className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-coral hover:underline"
                >
                  Ver o case completo <ArrowUpRight size={16} />
                </Link>
              </div>
              <CheckSurveyStats />
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
              <a
                href={MASTERCLASS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
              >
                Garantir minha vaga <ArrowUpRight size={18} />
              </a>
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
