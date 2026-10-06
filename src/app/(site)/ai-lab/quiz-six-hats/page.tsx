import Image from "next/image";
import type { Metadata } from "next";
import { LabCase } from "@/components/lab-case";
import { Reveal } from "@/components/reveal";
import { labAsset } from "@/lib/ai-lab";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Qual pensador você é? — AI Lab — ${SITE_NAME}`,
  description:
    "Quiz dos 6 Chapéus do Pensamento: seis cenários práticos e um perfil cognitivo personalizado, com gráfico de teia.",
};

const HATS = [
  { id: "white", nome: "Branco", foco: "Fatos e dados" },
  { id: "red", nome: "Vermelho", foco: "Emoção e intuição" },
  { id: "black", nome: "Preto", foco: "Riscos e cautela" },
  { id: "yellow", nome: "Amarelo", foco: "Benefícios" },
  { id: "green", nome: "Verde", foco: "Criatividade" },
  { id: "blue", nome: "Azul", foco: "Processo e síntese" },
];

export default function QuizSixHatsPage() {
  return (
    <LabCase
      accent="#e0a15c"
      tipo="Quiz · TP Treinamentos"
      titulo="Qual pensador você é?"
      tagline="Os 6 Chapéus do Pensamento de Edward de Bono viram um teste rápido, com resultado personalizado."
      url="https://quiz-six-hats.vercel.app"
      ctaLabel="Fazer o teste"
      hero={{
        src: labAsset("quiz/result.webp"),
        alt: "Resultado do quiz: O Criativo Inovador, Chapéu Verde",
      }}
      tools={["v0", "Next.js", "Vercel"]}
      passos={[
        {
          titulo: "Seu nome",
          texto: "Sem cadastro. O resultado fala direto com você.",
        },
        {
          titulo: "6 cenários",
          texto:
            "Situações reais de trabalho, seis reações possíveis. Cada uma é um chapéu.",
        },
        {
          titulo: "Seu perfil",
          texto:
            "O chapéu dominante e um gráfico de teia mostram como você pensa.",
        },
      ]}
      telas={[
        { src: labAsset("quiz/question.webp"), alt: "Cenário 1 de 6" },
        { src: labAsset("quiz/start.webp"), alt: "Tela inicial do quiz" },
      ]}
      destaques={[
        "Resultado com nome, perfil e frase de efeito",
        "Gráfico de teia do seu estilo de pensar",
        "Pré-visualização própria ao compartilhar o link",
        "Convite para a masterclass de Design Thinking",
      ]}
      extra={
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-12">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-widest text-coral">
                Os seis chapéus
              </p>
            </Reveal>
            <div className="mt-6 grid grid-cols-3 gap-3 md:grid-cols-6">
              {HATS.map((h, i) => (
                <Reveal key={h.id} delay={i * 0.07}>
                  <div className="group rounded-2xl border border-border bg-surface p-3 text-center transition-all duration-300 hover:-translate-y-2 hover:border-coral">
                    <Image
                      src={labAsset(`quiz/hat-${h.id}.webp`)}
                      alt={`Chapéu ${h.nome}`}
                      width={96}
                      height={96}
                      className="mx-auto h-16 w-16 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
                    />
                    <p className="mt-2 text-sm font-black text-navy">
                      {h.nome}
                    </p>
                    <p className="text-xs text-gray">{h.foco}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      }
    />
  );
}
