# TPointic — Design System

Referência viva do visual e dos padrões de código do site público (grupo de rotas `src/app/(site)`). O painel admin (`src/app/admin`) usa o tema claro original e não é afetado por nada aqui.

## Paleta

Definida em `src/app/globals.css`. O tema escuro do site público é aplicado via a classe `.site-theme` (em `src/app/(site)/layout.tsx`), que sobrescreve os tokens do `:root` só para os descendentes — o admin nunca herda isso.

| Token (classe Tailwind)       | Valor (site público) | Uso                                   |
| ------------------------------ | --------------------- | -------------------------------------- |
| `bg-bg` / `text-bg`            | `#0a0a0a`             | Fundo da página                        |
| `bg-surface` / `text-surface`  | `#141414`             | Cards, inputs — substitui `bg-white`   |
| `text-navy`                    | `#ededed`             | Texto primário (títulos, corpo)        |
| `text-slate`                   | `#a3a3a3`              | Texto secundário                       |
| `text-gray`                    | `#8a8a8a`              | Texto terciário, legendas, footer      |
| `bg-coral` / `text-coral`      | `#66fcf1` (ciano)      | Cor de destaque primária (CTA, links)  |
| `bg-peach` / `text-peach`      | `#26a193` (teal)       | Destaque secundário / hover            |
| `border-border`                | `#262626`              | Bordas de cards, divisores             |

Regra de contraste: botões com `bg-coral` (ciano claro) usam **`text-black`**, nunca `text-white` — o ciano é claro demais para texto branco.

Gradiente de destaque (hero, banners): classe utilitária `.hero-gradient` — roxo → azul → teal → ciano, inspirado em talespereira.com. Use com opacidade reduzida (`opacity-20` a `opacity-40`) sobre fundo escuro, nunca sólido.

**Nunca usar `bg-white` / `text-white` diretamente no site público** (exceto em botões dentro de banners com `.hero-gradient`, onde branco sólido é o contraste correto) — sempre os tokens semânticos acima, para que o tema continue trocável.

## Tipografia

Fonte: Nunito (`--font-nunito`, carregada em `src/app/layout.tsx`). Pesos usados: 400, 700, 800, 900 (`font-bold` / `font-black`).

- Títulos de seção: `text-3xl font-black text-navy` (H2), `text-4xl sm:text-6xl font-black` (H1 de hero)
- Rótulo/eyebrow acima de título: `text-sm font-bold uppercase tracking-widest text-coral`
- Corpo: `text-slate` (secundário) ou `text-navy` (parágrafos de conteúdo longo)

## Ícones

Biblioteca: [MynaUI](https://mynaui.com/icons) via `@mynaui/icons-react`. Import nomeado, ex.: `import { Compass, ArrowUpRight } from "@mynaui/icons-react"`. Tamanho padrão `size={16}` a `size={28}` conforme contexto; cor via `className="text-coral"` (usa `currentColor`).

Não usar outra lib de ícones no site público — mantém peso visual consistente.

## Animação

- `src/components/reveal.tsx` — wrapper `<Reveal delay={0.1}>` (framer-motion, fade + slide-up ao entrar no viewport, dispara uma vez). Usar em blocos de seção e itens de grid (com `delay` escalonado, ex. `delay={i * 0.08}`).
- `.animate-fade-up` (CSS puro, `globals.css`) — para o hero, que já está no viewport no load (Reveal com `whileInView` não dispararia a tempo).
- Hover padrão em cards: `transition-all hover:-translate-y-1 hover:border-coral`. Em botões: `transition-transform hover:scale-105`.

## Componentes-base

- `src/components/logo.tsx` — logo TPointic em SVG inline, `fill="currentColor"` (controla a cor via `text-*`).
- `src/components/nav.tsx` — header sticky com blur, link ativo sublinhado em coral, menu mobile hambúrguer (ícones `Menu`/`X` da MynaUI).
- `src/components/footer.tsx` — links de contato com ícone + texto.
- `src/components/reveal.tsx` — ver Animação acima.

## Assets hospedados (Supabase Storage)

Projeto Supabase `tpointic` (`drjbumieuwuzsjlpqwxg`), bucket **`site`** (assets globais: logo, foto do hero, vídeo de fundo) e bucket **`cases`** (capa + galeria de cada case, em subpastas por slug). Ambos públicos para leitura; escrita exige `is_admin()` — nunca subir arquivo direto sem policy temporária (ver padrão abaixo).

**Padrão para subir um novo asset:**
1. Comprimir localmente (sharp para imagem → webp; ffmpeg-static para vídeo → mp4 h264, sem áudio se for background).
2. Criar policy temporária de INSERT público no bucket alvo (`apply_migration`), fazer upload via `curl --data-binary` com a anon key, depois **derrubar a policy temporária** — nunca deixar escrita pública aberta.
3. Nunca embutir binários no payload do `deploy_to_vercel` — sempre via Storage.

## Conteúdo dos cases

Tabela `cases` (Postgres) tem, além dos campos originais (`titulo`, `cliente`, `resumo`, `conteudo`, `capa_url`): `imagens text[]` (galeria), `video_url` (embed Vimeo ou mp4 direto), `figma_url` (embed Figma), `slides_url` (embed Google Slides), `pdf_url` (link externo para PDF, não hospedado), `destaques jsonb` (array `{label, valor}` para a tira de números/resultados no topo do case).

Material de origem (backup WordPress `talespereira.com`): arquivo `.wpress` em `D:\downloads\` (local pode mudar — confirmar antes de assumir; já se moveu de `C:\Users\efree\Downloads` uma vez). Índice completo em `wpress_index2.json` no scratchpad da sessão de migração; se o `.wpress` não for encontrado, usar `https://talespereira.com/wp-content/uploads/...` como fallback ao vivo (mesmo caminho relativo). Relatório já minerado por case: `case_artifacts/report.json` no mesmo scratchpad.

## Workflow obrigatório

**Nunca fazer `deploy_to_vercel` sem antes mostrar o resultado localmente e o usuário aprovar.** Sempre: editar → `npx tsc --noEmit` → `preview_start` (nome `tpointic` do `.claude/launch.json`) → validar via screenshot/leitura no Browser pane → só então perguntar se pode subir para produção.
