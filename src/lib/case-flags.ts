// Sem dependências de servidor: importado pelo `case-body` (Client Component)
// e pela listagem. Não mover pra `cases.ts`, que puxa o client do Supabase
// (`next/headers`) e quebra o bundle do navegador.

// Categoria que marca um case como estudo de caso/proposta autoral (sem
// cliente nem resultados reais). A página do case usa isso pra mostrar o
// selo "Estudo de caso · Proposta conceitual" no hero e trocar o título da
// seção de números, que num case real fala de resultados alcançados.
export const ESTUDO_DE_CASO = "Estudo de caso";

export function isEstudoDeCaso(c: { categorias: string[] }): boolean {
  return c.categorias.includes(ESTUDO_DE_CASO);
}
