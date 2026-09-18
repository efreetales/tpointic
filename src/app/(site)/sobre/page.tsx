import type { Metadata } from "next";
import {
  Compass,
  Users,
  Heart,
  Rocket,
  Puzzle,
  Target,
} from "@mynaui/icons-react";
import { Reveal } from "@/components/reveal";
import { HighlightText } from "@/components/highlight-text";
import { PhotoGallery } from "@/components/photo-gallery";
import { TestimonialsCarousel, type Testimonial } from "@/components/testimonials-carousel";
import Image from "next/image";
import { SITE_NAME } from "@/lib/site";

// Teste: segunda opção de foto com o boneco (puppet) — cropada sem pernas,
// sem a margem transparente sobrando nas laterais/topo (senão
// `object-contain` encolhia a imagem inteira pra caber na largura,
// sobrando vão vazio em cima) e SEM margem transparente embaixo também
// (senão `object-bottom` alinhava essa margem invisível ao fundo do
// painel em vez do short, sobrando vão vazio embaixo).
const TALES_PHOTO =
  "https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/tales-com-puppet-2-flush.png";

// Conteúdo da antiga página /servicos, incorporado aqui — a página
// separada foi removida (era só essa lista, sem motivo pra ter uma rota e
// um item de menu próprios).
const SERVICES = [
  {
    icon: Compass,
    title: "Service Design",
    description:
      "Como service designer, minha função é planejar, criar e otimizar serviços, sempre considerando a experiência do usuário e a eficiência operacional. Trabalho na interseção entre design, negócios e tecnologia, garantindo que os serviços sejam úteis, utilizáveis, desejáveis e viáveis.",
  },
  {
    icon: Users,
    title: "UX Research",
    description:
      "Como UX Researcher, meu papel é entender os usuários para melhorar produtos e serviços. Realizo pesquisas qualitativas e quantitativas, analiso dados para identificar melhorias, e colaboro com equipes para garantir que o design seja centrado no usuário. Também sintetizo resultados em relatórios e conduzo testes para validar as soluções, assegurando uma experiência intuitiva e satisfatória.",
  },
  {
    icon: Heart,
    title: "Mentoring",
    description:
      "Como mentor em UX Design, meu papel é orientar e apoiar o desenvolvimento profissional de designers em início de carreira ou em transição. Ofereço feedback construtivo sobre seu trabalho, compartilho experiências e melhores práticas, e ajudo a identificar e superar desafios no processo de design. Vamos tomar um café?",
  },
  {
    icon: Rocket,
    title: "Design Leadership",
    description:
      "Como líder em UX Design, meu papel é orientar a equipe para criar experiências digitais excepcionais. Defino a visão estratégica de UX, colaboro com outras áreas para garantir uma integração eficaz e supervisiono o processo de design. Também atuo como mentor, desenvolvendo as habilidades da equipe.",
  },
  {
    icon: Puzzle,
    title: "UX Design",
    description:
      "Como UX Designer, meu trabalho é criar interfaces e experiências que sejam intuitivas e agradáveis para os usuários. Realizo pesquisas para entender as necessidades e comportamentos dos usuários, desenvolvo wireframes e protótipos, e coloco essas soluções em teste para validar e refinar o design.",
  },
  {
    icon: Target,
    title: "Product Owner",
    description:
      "Como Product Owner, minha função é definir e priorizar as necessidades do produto, garantindo que a equipe de desenvolvimento entregue soluções que atendam aos objetivos de negócios e às expectativas dos usuários. Gerencio o backlog do produto e colaboro com stakeholders para entender requisitos e prioridades.",
  },
];

export const metadata: Metadata = {
  title: `Sobre — ${SITE_NAME}`,
  description: "Conheça Tales Pereira, Gestor de Design, Service Designer e UX Researcher.",
};

// Mesmo bucket/pasta de avatares usado no carrossel de depoimentos da home
// (site/depoimentos) — reaproveita as fotos já hospedadas em vez de subir
// de novo.
const STORAGE_DEPOIMENTOS =
  "https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/depoimentos";

// Mesmos depoimentos (texto, cargo, foto e link) usados no carrossel da
// home — nunca reescrever/resumir aqui, senão os dois lugares divergem.
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
    name: "Romeu Ivolela Neto",
    role: "AI Product Manager | MSc in Philosophy & AI",
    quote:
      "Eu tive o prazer de trabalhar com o Tales no Shopping UOL. Sua sensibilidade e empatia com os usuários, somados ao seu profundo conhecimento na área de UX, o tornam um profissional excelente. Se todos os produtos tivessem um profissional como o Tales, com certeza teríamos produtos melhores no mercado.",
    photo: `${STORAGE_DEPOIMENTOS}/romeu.jpeg`,
    linkedin: "https://www.linkedin.com/in/rivolela/",
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
    <main className="flex-1 bg-[#dfe3e8]">
      {/* Sidebar sticky + coluna de conteúdo: no desktop, a coluna da
          direita (foto + fundo `#dce0e8`) fica `sticky top-0 h-screen` e
          PERMANECE fixa enquanto a coluna da esquerda — que agora carrega
          bio, Frentes de atuação, Bastidores e Depoimentos, um embaixo do
          outro — rola por cima normalmente. O "cover" acontece sozinho:
          como a coluna da direita só tem a altura de uma tela e o pai
          (essa linha) é tão alto quanto a coluna da esquerda (bem mais
          alta), o sticky mantém a foto colada até a linha acabar. Nenhum
          ancestral pode ter `overflow-hidden`, ou o sticky quebra. No
          mobile empilha tudo normalmente (a coluna da direita nem
          renderiza — `hidden lg:block` — cada seção usa a foto pequena
          própria onde precisar).
          `#dce0e8` é a mesma cor de fundo que sobra atrás do vídeo no
          hero (o cinza-azulado do `mix-blend-mode: multiply`) — esse
          bloco usa ela como fundo próprio em vez do tema escuro padrão,
          então as cores de texto/cards aqui são as mesmas literais claras
          do hero (`#1a1a1a`, `#4a4a4a`, `#058fa1`) para manter contraste
          de leitura.
          O degradê radial (luz mais clara em cima à esquerda, esmaecendo
          pras bordas) imita o vinheteamento do fundo de estúdio que
          aparece atrás do boneco no vídeo do hero da home — mesmo
          princípio, só que como CSS em vez de vídeo. `backgroundAttachment:
          "fixed"` garante que a foto sticky e a coluna que rola mostrem
          sempre a mesma fatia do degradê (mesma técnica já usada aqui
          antes pro `hero-gradient`), sem costura entre as duas colunas. */}
      <div className="relative flex w-full flex-col lg:flex-row lg:items-start">
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
          {/* 01 — Bio */}
          <div className="px-6 pb-16 pt-20 lg:px-16 lg:pb-0 lg:pt-0">
            <Reveal>
              {/* Mobile/tablet: foto empilhada acima do texto, proporção
                  própria. Some no desktop (`lg:hidden`), onde a coluna
                  fixa da direita assume. */}
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

              {/* Todo esse grupo (saudação + bio) cabe numa dobra só no
                  desktop, centralizado na área VISÍVEL abaixo do nav — daí
                  descontar `var(--nav-h)` de `100vh` em vez de usar
                  `min-h-screen` puro. Sem isso, o box de centralização
                  ficaria mais alto que a dobra visível (nav + h-screen >
                  100vh) e o texto centralizaria mais pra baixo, sobrando
                  mais espaço em cima do que embaixo. */}
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

          {/* Citação de abertura — movida do hero de vídeo (escondido
              nesse teste) pra logo depois da saudação de bio. `lg:pb-48`
              compensa o espaço "sobrando" embaixo do bloco de bio acima
              (que é centralizado dentro de uma tela inteira, então deixa
              folga equivalente acima e abaixo dele) — sem esse reforço,
              o respiro antes da citação fica bem maior que o respiro
              depois dela, ficando descentralizado em vez de equidistante
              entre os dois blocos vizinhos. */}
          <div className="px-6 pb-16 lg:px-16 lg:pb-40">
            <Reveal delay={0.05}>
              <div className="relative">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-2 -top-8 select-none font-serif text-7xl font-black text-[#058fa1]/15 sm:-top-10 sm:text-8xl"
                >
                  &ldquo;
                </span>
                <h1 className="relative text-4xl font-black leading-[1.05] text-[#058fa1] sm:text-5xl lg:text-6xl">
                  Não me interessa criar produtos bonitos. Me interessa
                  resolver problemas que importam.
                </h1>
              </div>
            </Reveal>
          </div>

          {/* 02 — Frentes de atuação */}
          <div id="servicos" className="scroll-mt-24 px-6 py-16 lg:px-16">
            <Reveal delay={0.1}>
              <div className="relative">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-7 left-0 select-none text-6xl font-black text-[#058fa1]/15 sm:-top-9 sm:text-7xl"
                >
                  02
                </span>
                <h2 className="relative text-2xl font-black text-[#1a1a1a]">
                  Frentes de atuação
                </h2>
              </div>
              <p className="mt-3 max-w-xl text-[#4a4a4a]">
                Seis chapéus que já usei ao longo da carreira — todos na
                mesma missão: unir pessoas, negócio e tecnologia através do
                design.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {SERVICES.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.08}>
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-white/40 bg-white/15 p-6 shadow-xl backdrop-blur-lg backdrop-saturate-150 transition-all hover:-translate-y-1 hover:border-[#058fa1]/50">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 to-white/5" />
                    <s.icon
                      size={28}
                      className="relative text-[#058fa1] transition-transform group-hover:scale-110"
                    />
                    <h3 className="relative mt-4 text-lg font-black text-[#1a1a1a]">{s.title}</h3>
                    <p className="relative mt-2 text-sm text-[#4a4a4a]">{s.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* 03 — Bastidores */}
          <div className="px-6 py-16 lg:px-16">
            <Reveal delay={0.15}>
              <div className="relative">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-7 left-0 select-none text-6xl font-black text-[#058fa1]/15 sm:-top-9 sm:text-7xl"
                >
                  03
                </span>
                <h2 className="relative text-2xl font-black text-[#1a1a1a]">Pode stalkear</h2>
              </div>
              <p className="mt-3 max-w-xl text-[#4a4a4a]">
                Um pouco dessa minha vida loka.
              </p>
              <div className="mt-10">
                <PhotoGallery photos={GALLERY_PHOTOS} variant="light" />
              </div>
            </Reveal>
          </div>

          {/* 04 — Depoimentos */}
          <div className="px-6 pb-20 pt-16 lg:px-16">
            <Reveal delay={0.2}>
              <div className="relative">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-7 left-0 select-none text-6xl font-black text-[#058fa1]/15 sm:-top-9 sm:text-7xl"
                >
                  04
                </span>
                <h2 className="relative text-2xl font-black text-[#1a1a1a]">Depoimentos</h2>
              </div>
              <p className="mt-3 max-w-xl text-[#4a4a4a]">
                O que dizem sobre o meu trabalho
              </p>
              <div className="mt-10">
                <TestimonialsCarousel items={TESTIMONIALS} variant="light" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </main>
  );
}
