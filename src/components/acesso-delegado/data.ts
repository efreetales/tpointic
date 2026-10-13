// Conteúdo do case "Acesso delegado com consentimento". Tudo aqui vem do
// documento do estudo de caso; não há métricas de resultado porque o case é
// uma proposta de design com hipóteses ainda a validar em pesquisa.

// Blocos de pesquisa (hipóteses e próximos passos) ficam guardados, mas ocultos
// até o case ter pesquisa de verdade para mostrar.
export const MOSTRAR_PESQUISA = false;

export type RoleId = "operar" | "acompanhar" | "aprovar";

export const ROLES: {
  id: RoleId;
  nome: string;
  curto: string;
  desc: string;
  cor: string;
}[] = [
  {
    id: "operar",
    nome: "Operar",
    curto: "com limites",
    desc: "Faz a rotina: mercado, farmácia, contas. Gasta dentro do limite e anexa o comprovante.",
    cor: "#66fcf1",
  },
  {
    id: "acompanhar",
    nome: "Acompanhar",
    curto: "com alertas",
    desc: "Vê o resumo e os alertas do que foge do padrão. Não movimenta nada e não altera os limites.",
    cor: "#fbbf24",
  },
  {
    id: "aprovar",
    nome: "Aprovar",
    curto: "quando importa",
    desc: "Confirma ou recusa o que é sensível ou fora da rotina, com o próprio login e biometria.",
    cor: "#a78bfa",
  },
];

export const PEOPLE = [
  { id: "rose", nome: "Rose", iniciais: "RC", papel: "Cuidadora" },
  { id: "marcos", nome: "Marcos", iniciais: "ML", papel: "Filho" },
  { id: "marina", nome: "Marina", iniciais: "MA", papel: "Filha" },
  { id: "clara", nome: "Clara", iniciais: "CL", papel: "Esposa" },
] as const;
export type PersonId = (typeof PEOPLE)[number]["id"];

export const ALTERNATIVAS = [
  {
    nome: "Compartilhar a senha",
    pos: 62,
    texto:
      "Inseguro, viola os termos do banco e não deixa rastro de quem fez o quê.",
  },
  {
    nome: "Conta conjunta",
    pos: 74,
    texto: "O ajudante vira cotitular, com acesso total e corresponsabilidade.",
  },
  {
    nome: "Procuração",
    pos: 86,
    texto: "Burocrática e geralmente ampla demais para a ajuda do dia a dia.",
  },
  {
    nome: "Curatela",
    pos: 96,
    texto:
      "Decidida por um juiz, para quem já não consegue gerir a própria vida civil.",
  },
];

export const REFERENCIAS = [
  {
    nome: "Monzo · Trusted Access",
    faz: "Acesso informal ou formal para um familiar ou amigo.",
    falta: "Configuração por formulário, não no app.",
    url: "https://monzo.com/help/your-needs/setting-up-trusted-access",
  },
  {
    nome: "Santander UK · Carers Card",
    faz: "Cartão do cuidador que só acessa o valor que o titular transfere.",
    falta: "Ninguém supervisiona o que o cuidador gasta.",
    url: "https://www.santander.co.uk/personal/support/supported-banking/carers-card",
  },
  {
    nome: "Bank of Ireland · Carer Package",
    faz: "Cartão de cuidador com limite diário e monitoramento de gastos incomuns.",
    falta: "Exige laudo médico e um único cuidador.",
    url: "https://personalbanking.bankofireland.com/financial-wellbeing/extra-help/carers-package/",
  },
  {
    nome: "BarclayBuddy · D&AD 2020",
    faz: "Conceito de estudante: do amigo que só recebe avisos ao cuidador em tempo integral.",
    falta: "Não sai do conceito; sem papel de validador.",
    url: "https://www.dandad.org/annual/2020/entry/newblood/3605",
  },
  {
    nome: "Contas PJ (bancos brasileiros)",
    faz: "Operadores com perfis de acesso e alçadas de aprovação.",
    falta: "Linguagem e regras pensadas para empresa.",
    url: "",
  },
];

export const NIVEIS = [
  {
    n: 1,
    nome: "Rede de segurança",
    situacao: "Autônomo, quer proteção contra golpes.",
    dia: "O titular",
    aprova: "Pessoa de confiança (modelo do PL)",
    acompanha: "Ninguém, ou avisos opcionais",
    quem: ["titular", "confianca"],
    nota: "É o que o PL 1453/2026 propõe.",
  },
  {
    n: 2,
    nome: "Ajuda pontual",
    situacao: "Autônomo, com dificuldade digital.",
    dia: "O titular, com ajuda para tarefas",
    aprova: "O titular, com validação acima de um limite",
    acompanha: "Familiar vê alertas de risco",
    quem: ["titular", "familiar"],
    nota: "",
  },
  {
    n: 3,
    nome: "Dia a dia delegado",
    situacao: "Capaz de decidir, mas não de operar (mobilidade, visão).",
    dia: "Cuidador, com limite e bolso separado",
    aprova: "O titular ou um familiar",
    acompanha: "Familiar vê o que o cuidador gasta",
    quem: ["titular", "cuidador", "familiar"],
    nota: "",
  },
  {
    n: 4,
    nome: "Sem condição de aprovar",
    situacao: "Já não consegue decidir sozinho.",
    dia: "Cuidador, dentro de limites",
    aprova: "Dois validadores (ex.: filho e cônjuge)",
    acompanha: "Os dois validadores e o banco",
    quem: ["titular", "cuidador", "validador", "validador", "banco"],
    nota: "É aqui que o PL 1453/2026 não alcança e o design precisa de base legal.",
  },
] as const;

export const PERSONAS = [
  {
    who: "lucia",
    iniciais: "DL",
    nome: "Dona Lúcia, 78",
    papel: "Titular · níveis 1 a 3",
    cor: "#f9fafb",
    quote: "Quero continuar decidindo, mas não quero cair em um golpe.",
    texto:
      "Viúva, mora sozinha, recebe aposentadoria. Usa o app com insegurança e já recebeu ligação de “falsa central”. Aceita ajuda se não se sentir vigiada.",
  },
  {
    who: "marcos",
    iniciais: "ML",
    nome: "Marcos, 52",
    papel: "Filho e supervisor",
    cor: "#fbbf24",
    quote:
      "Não quero aprovar cada pão comprado. Quero saber quando algo foge do normal.",
    texto:
      "Mora em outra cidade e se preocupa com golpes e com o que a cuidadora gasta.",
  },
  {
    who: "rose",
    iniciais: "RC",
    nome: "Rose, 45",
    papel: "Cuidadora e operadora",
    cor: "#66fcf1",
    quote: "Preciso de regras claras e um registro que também me proteja.",
    texto:
      "Faz mercado e farmácia para a família que a contrata. Hoje usa o cartão e a senha da patroa e se sente exposta a desconfianças.",
  },
  {
    who: "antonio",
    iniciais: "SA",
    nome: "Seu Antônio, 84",
    papel: "Titular · nível 4",
    cor: "#a78bfa",
    quote: "A cuidadora opera; esposa e filha aprovam o que sai da rotina.",
    texto:
      "Tem curatela concedida à esposa. A conta é operada pela cuidadora; a esposa e a filha aprovam o que é fora da rotina.",
  },
];

export const HIPOTESES = [
  {
    id: "H1",
    titulo:
      "Idosos rejeitam “pedir autorização” para usar o próprio dinheiro, mas aceitam “ter alguém de olho” contra golpes.",
    como: "Entrevistas com 6 a 8 idosos, testando as duas formulações.",
  },
  {
    id: "H2",
    titulo: "Familiares querem alertas de exceção, não aprovar tudo.",
    como: "Entrevistas com 5 a 6 filhos ou cônjuges que já ajudam um parente.",
  },
  {
    id: "H3",
    titulo:
      "Cuidadores preferem regras claras e registro a usar a senha do patrão.",
    como: "Entrevistas com 4 a 5 cuidadores contratados.",
  },
  {
    id: "H4",
    titulo: "Ter dois validadores reduz o risco de um deles abusar.",
    como: "Teste de conceito com famílias no nível 4.",
  },
  {
    id: "H5",
    titulo:
      "Um validador que não responde vira barreira em urgências (remédio, hospital).",
    como: "Teste de cenário com prazos e validador reserva.",
  },
];

export const RISCOS = [
  {
    caso: "Validador é quem abusa",
    resposta:
      "Dois validadores no nível 4; saída discreta para o titular; o banco monitora padrões estranhos.",
  },
  {
    caso: "Cuidador e familiar entram em conflito",
    resposta:
      "Regras e registro visíveis para todos; o supervisor vê, mas não altera os limites do titular.",
  },
  {
    caso: "Urgência sem validador disponível",
    resposta:
      "Validador reserva, prazo de resposta e categorias pré-aprovadas (farmácia, hospital).",
  },
  {
    caso: "Titular recupera a capacidade",
    resposta: "Caminho para voltar a um nível de menos delegação.",
  },
  {
    caso: "Morte do titular",
    resposta: "Acessos encerrados automaticamente quando o banco é notificado.",
  },
  {
    caso: "Alguém tenta forçar o nível 4 sem respaldo",
    resposta: "Nível 4 só com documento legal validado pelo banco.",
  },
  {
    caso: "Golpista se passa pelo validador",
    resposta:
      "Validador confirma com o próprio login e biometria, nunca por SMS ou ligação.",
  },
];

export const METRICAS = [
  {
    nome: "Proteção",
    texto:
      "Operações bloqueadas que eram golpe; valor perdido por cliente com a feature ativa versus sem.",
  },
  {
    nome: "Autonomia",
    texto:
      "Percentual de titulares que dizem manter o controle; taxa de revogação por insatisfação.",
  },
  {
    nome: "Fricção",
    texto:
      "Tempo médio de resposta do validador; operações legítimas canceladas por falta de resposta.",
  },
  {
    nome: "Adoção",
    texto:
      "Clientes 60+ que ativam a feature; famílias que passam do nível 1 para o 2 ou 3.",
  },
];

export const PASSOS = [
  {
    t: "Validar as bases legais",
    d: "Procuração, curatela e Tomada de Decisão Apoiada com um advogado.",
  },
  {
    t: "Recrutar quem vive o cenário",
    d: "Idosos, familiares e cuidadores na mesa de pesquisa.",
  },
  {
    t: "Rodar as entrevistas",
    d: "Revisar hipóteses e personas antes de fechar as regras.",
  },
  {
    t: "Testar os três fluxos",
    d: "Convite, validação e supervisão, com 5 pessoas por papel.",
  },
];

export const FONTES = [
  {
    t: "PL 1453/2026 — NSC Total",
    u: "https://www.nsctotal.com.br/economia/nova-regra-bancos-idosos-golpe-pix",
  },
  {
    t: "PL 1453/2026 — O Antagonista",
    u: "https://oantagonista.com.br/?p=2066499",
  },
  {
    t: "PL 1453/2026 — Correio 24 Horas",
    u: "https://www.correio24horas.com.br/politica/nova-trava-de-banco-para-idosos-exige-aval-de-parente-em-pix-0726",
  },
  {
    t: "Golpes de Pix por faixa etária — Paraíba Business",
    u: "https://paraibabusiness.com.br/veja-os-golpes-de-pix-mais-comuns-por-faixa-etaria-e-classe-social-e-saiba-como-evitar-os-12-maiores/",
  },
  {
    t: "Monzo — Trusted Access",
    u: "https://monzo.com/help/your-needs/setting-up-trusted-access",
  },
  {
    t: "Santander UK — Carers Card",
    u: "https://www.santander.co.uk/personal/support/supported-banking/carers-card",
  },
  {
    t: "Bank of Ireland — Carer Package",
    u: "https://personalbanking.bankofireland.com/financial-wellbeing/extra-help/carers-package/",
  },
  {
    t: "BarclayBuddy — D&AD 2020",
    u: "https://www.dandad.org/annual/2020/entry/newblood/3605",
  },
];
