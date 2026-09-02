import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre — TPointic",
  description: "Conheça Tales Pereira, Gestor de Design, Service Designer e UX Researcher.",
};

const TESTIMONIALS = [
  {
    name: "Milene Ferraz",
    role: "Design Lead @ CI&T",
    quote:
      "Trabalhamos juntos em um projeto onde o resultado foi muito elogiado por todos. Manda bem demais!",
  },
  {
    name: "Luciana Terceiro",
    role: "Sr. Product Designer, ex-UOL",
    quote:
      "Tales sempre conduziu pesquisas com usuários e liderou sessões de cocriação para melhorar a experiência. Um aprendiz contínuo.",
  },
  {
    name: "Pablo Turazzi Vilanova",
    role: "UX Research Technical Leader @ Mercado Livre",
    quote:
      "Trabalhar com o Tales foi uma vivência espetacular... propositivo, inteligente, bem-humorado, sociável.",
  },
  {
    name: "Romeu Ivolela Neto",
    role: "AI & Philosophy Professional",
    quote:
      "Sensibilidade, empatia com usuários e profundo conhecimento tornam Tales um profissional excelente.",
  },
];

export default function SobrePage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <p className="text-sm font-bold uppercase tracking-widest text-coral">
        Sobre
      </p>
      <h1 className="mt-2 text-4xl font-black text-navy">
        Um pouco sobre quem é o Tales
      </h1>
      <p className="mt-6 text-lg text-slate">
        Olá, eu sou o Tales. o/ Mas pode me chamar de Taleco =)
      </p>
      <div className="mt-4 space-y-4 text-navy">
        <p>
          Gestor de Design, Service Designer e UX Researcher com mais de 15
          anos de experiência em UX, Produto e Liderança. Desde 2010
          trabalhando em grandes empresas e atendendo clientes de diversas
          áreas usando ferramentas e metodologias de design aplicadas a
          resultados.
        </p>
        <p>
          Passagem por Mercado Livre, UOL, CI&amp;T, Vivo, Carrefour,
          SulAmérica, Dasa, RD/Drogasil, Rakuten, Casas Bahia, Cofco e Mercado
          Pago. Especialista em soluções centradas no usuário, liderando
          times multidisciplinares com Design Thinking e Lean UX.
        </p>
        <p>
          Foi embaixador do comitê de diversidade na CI&amp;T (comunidade
          LGBTQIA+) e mentor de bootcamps na CI&amp;T e Mercado Livre.
        </p>
      </div>

      <h2 className="mt-16 text-2xl font-black text-navy">Depoimentos</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {TESTIMONIALS.map((t) => (
          <blockquote
            key={t.name}
            className="rounded-2xl border border-border bg-white p-6"
          >
            <p className="text-slate">&ldquo;{t.quote}&rdquo;</p>
            <footer className="mt-4 text-sm font-bold text-navy">
              {t.name}
              <span className="block font-normal text-gray">{t.role}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </main>
  );
}
