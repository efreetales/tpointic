import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Serviços — TPointic",
  description: "Frentes de atuação de Tales Pereira: Service Design, UX Research, Mentoring, Design Leadership, UX Design e Product Owner.",
};

const SERVICES = [
  {
    title: "Service Design",
    description:
      "Como service designer, minha função é planejar, criar e otimizar serviços, sempre considerando a experiência do usuário e a eficiência operacional. Trabalho na interseção entre design, negócios e tecnologia, garantindo que os serviços sejam úteis, utilizáveis, desejáveis e viáveis.",
  },
  {
    title: "UX Research",
    description:
      "Como UX Researcher, meu papel é entender os usuários para melhorar produtos e serviços. Realizo pesquisas qualitativas e quantitativas, analiso dados para identificar melhorias, e colaboro com equipes para garantir que o design seja centrado no usuário. Também sintetizo resultados em relatórios e conduzo testes para validar as soluções, assegurando uma experiência intuitiva e satisfatória.",
  },
  {
    title: "Mentoring",
    description:
      "Como mentor em UX Design, meu papel é orientar e apoiar o desenvolvimento profissional de designers em início de carreira ou em transição. Ofereço feedback construtivo sobre seu trabalho, compartilho experiências e melhores práticas, e ajudo a identificar e superar desafios no processo de design. Vamos tomar um café?",
  },
  {
    title: "Design Leadership",
    description:
      "Como líder em UX Design, meu papel é orientar a equipe para criar experiências digitais excepcionais. Defino a visão estratégica de UX, colaboro com outras áreas para garantir uma integração eficaz e supervisiono o processo de design. Também atuo como mentor, desenvolvendo as habilidades da equipe.",
  },
  {
    title: "UX Design",
    description:
      "Como UX Designer, meu trabalho é criar interfaces e experiências que sejam intuitivas e agradáveis para os usuários. Realizo pesquisas para entender as necessidades e comportamentos dos usuários, desenvolvo wireframes e protótipos, e coloco essas soluções em teste para validar e refinar o design.",
  },
  {
    title: "Product Owner",
    description:
      "Como Product Owner, minha função é definir e priorizar as necessidades do produto, garantindo que a equipe de desenvolvimento entregue soluções que atendam aos objetivos de negócios e às expectativas dos usuários. Gerencio o backlog do produto e colaboro com stakeholders para entender requisitos e prioridades.",
  },
];

export default function ServicosPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <p className="text-sm font-bold uppercase tracking-widest text-coral">
        Serviços
      </p>
      <h1 className="mt-2 text-4xl font-black text-navy">Frentes de atuação</h1>
      <p className="mt-3 max-w-2xl text-slate">
        Seis formas de aplicar design a resultados de negócio, dependendo do
        estágio e da necessidade do seu time.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <div key={s.title} className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-xl font-black text-navy">{s.title}</h2>
            <p className="mt-3 text-sm text-slate">{s.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
