// Conteúdo do AI Lab (projetos pessoais e skills de IA). Fica em código (não
// no Supabase) porque são poucos itens, com texto e layout muito autorais.
// Nome da seção em um lugar só — ainda provisório.
export const AI_LAB_NAME = "AI Lab";

export const AI_LAB_ASSETS = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site/ai-lab`;
export const labAsset = (path: string) => `${AI_LAB_ASSETS}/${path}`;

export type LabCategoryId = "jogos" | "treinamento" | "saas" | "skills";

export const LAB_CATEGORIES: { id: LabCategoryId; label: string }[] = [
  { id: "jogos", label: "Jogos & Educação" },
  { id: "treinamento", label: "Quizzes & Treinamento" },
  { id: "saas", label: "SaaS & Dados" },
  { id: "skills", label: "Skills" },
];

export type LabProject = {
  slug: string;
  titulo: string;
  tagline: string;
  tipo: string;
  categoria: Exclude<LabCategoryId, "skills">;
  accent: string;
  url: string;
  href: string;
  cover: string;
  tools: string[];
};

export const LAB_PROJECTS: LabProject[] = [
  {
    slug: "bicharada-cantante",
    titulo: "Bicharada Cantante",
    tagline: "Um jogo que conta, canta e põe pra dormir.",
    tipo: "Projeto pessoal",
    categoria: "jogos",
    accent: "#FFD54A",
    url: "https://tpointic-kids.vercel.app",
    href: "/ai-lab/bicharada-cantante",
    cover: labAsset("bicharada/game-round.webp"),
    tools: ["Claude Code", "ElevenLabs", "Vercel"],
  },
  {
    slug: "quiz-six-hats",
    titulo: "Qual pensador você é?",
    tagline: "Os 6 Chapéus do Pensamento viram um teste de 6 cenários.",
    tipo: "Quiz · TP Treinamentos",
    categoria: "treinamento",
    accent: "#e0a15c",
    url: "https://quiz-six-hats.vercel.app",
    href: "/ai-lab/quiz-six-hats",
    cover: labAsset("quiz/result.webp"),
    tools: ["v0", "Next.js", "Vercel"],
  },
  {
    slug: "iniaflow",
    titulo: "IniaFlow AI",
    tagline: "A planilha do varejo vira dashboard, alerta e conselho.",
    tipo: "SaaS · IA aplicada",
    categoria: "saas",
    accent: "#8b5cf6",
    url: "https://iniaflow.vercel.app",
    href: "/ai-lab/iniaflow",
    cover: labAsset("iniaflow/dashboard.webp"),
    tools: ["v0", "Next.js", "Vercel"],
  },
];

export type LabSkill = {
  nome: string;
  descricao: string;
  origem: string;
  accent: string;
  // Quando existe, a skill já está disponível para baixar (.zip).
  download?: string;
};

// Skills sem `download` aparecem como "em breve".
export const LAB_SKILLS: LabSkill[] = [
  {
    nome: "Jogo infantil com voz e música",
    descricao:
      "Do roteiro ao ar: falas com entonação, músicas e boca sincronizada com a letra.",
    origem: "Bicharada Cantante",
    accent: "#FFD54A",
    download: "/skills/jogo-infantil-com-vozes.zip",
  },
  {
    nome: "Videoclipe a partir de vídeos de IA",
    descricao:
      "Pica, junta e casa as cenas com a letra da música, como um editor.",
    origem: "Bicharada Cantante",
    accent: "#f472b6",
  },
  {
    nome: "Quiz de perfil com gráfico de teia",
    descricao:
      "Transforma qualquer metodologia (6 Chapéus, DISC…) num teste com resultado personalizado.",
    origem: "Qual pensador você é?",
    accent: "#e0a15c",
  },
  {
    nome: "Analista de ERP para varejo",
    descricao:
      "Planilha de vendas e estoque entra; preço, reposição e combos saem.",
    origem: "IniaFlow AI",
    accent: "#8b5cf6",
  },
  {
    nome: "Case de portfólio com UAU",
    descricao:
      "O método do meu portfólio: case visual, enxuto e com movimento.",
    origem: "TPointic",
    accent: "#66fcf1",
  },
];
