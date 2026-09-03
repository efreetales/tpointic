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

export const metadata: Metadata = {
  title: "Serviços — TPointic",
  description: "Frentes de atuação de Tales Pereira: Service Design, UX Research, Mentoring, Design Leadership, UX Design e Product Owner.",
};

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

export default function ServicosPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <Reveal>
        <p className="text-sm font-bold uppercase tracking-widest text-coral">
          Serviços
        </p>
        <h1 className="mt-2 text-4xl font-black text-navy">Frentes de atuação</h1>
        <p className="mt-3 max-w-2xl text-slate">
          Seis formas de aplicar design a resultados de negócio, dependendo do
          estágio e da necessidade do seu time.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {SERVICES.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.07}>
            <div className="group h-full rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-coral">
              <s.icon
                size={28}
                className="text-coral transition-transform group-hover:scale-110"
              />
              <h2 className="mt-4 text-xl font-black text-navy">{s.title}</h2>
              <p className="mt-3 text-sm text-slate">{s.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
