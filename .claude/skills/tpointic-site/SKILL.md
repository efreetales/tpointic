---
name: tpointic-site
description: Use when working on the TPointic site (site público em src/app/(site), design, cases, conteúdo, deploy). Garante consistência visual e o workflow correto de preview/deploy.
---

# TPointic — regras do projeto

Leia `DESIGN_SYSTEM.md` (raiz do projeto) antes de qualquer mudança visual — tem a paleta, tipografia, ícones (MynaUI), padrões de animação (`Reveal`) e como hospedar assets no Supabase Storage.

## Regras inegociáveis

1. **Nunca fazer deploy no Vercel sem o usuário ver e aprovar localmente primeiro.** Fluxo: editar → `npx tsc --noEmit` → `preview_start` (server `tpointic`) → mostrar via screenshot/Browser pane → só então perguntar se pode fazer `deploy_to_vercel`.
2. **Site público (`(site)`) é tema escuro; admin (`admin/`) é tema claro.** Nunca misturar — não usar `bg-white`/`text-white` fora de banners com `.hero-gradient` no site público; nunca aplicar `.site-theme` a rotas de admin.
3. **Ícones: só MynaUI** (`@mynaui/icons-react`). Não introduzir outra lib de ícones.
4. **Animação de entrada de seção: `<Reveal>`** (`src/components/reveal.tsx`). Para o hero (já visível no load), usar `.animate-fade-up` do CSS em vez de `Reveal`.
5. **Nunca embutir binário (imagem/vídeo) no payload de `deploy_to_vercel`.** Sempre subir para Supabase Storage primeiro (bucket `site` para assets globais, `cases/<slug>/` para artefatos de case) e referenciar a URL pública.
6. **Upload para Storage exige policy temporária.** Os buckets (`site`, `cases`) só aceitam escrita de `is_admin()`. Para seed/migração de conteúdo: criar policy de INSERT público via `apply_migration`, subir com `curl` + anon key, **derrubar a policy** no fim. Nunca deixar escrita pública aberta.
7. **Conteúdo de cases vem do backup WordPress.** Arquivo `.wpress` normalmente em `D:\downloads\` (já se moveu antes — confirmar o local com `ls`/`find` antes de assumir). Índice de arquivos: `wpress_index2.json` (scratchpad da sessão de migração). Se o `.wpress` não for encontrado, baixar direto de `https://talespereira.com/wp-content/uploads/<mesmo caminho>` como fallback. Relatório já minerado por case (imagens, vídeos, Figma, PDFs por slug): `case_artifacts/report.json` no mesmo scratchpad — checar antes de re-minerar.

## Quando o usuário pedir mudança de design/conteúdo

- Ajustar tokens de cor: só em `.site-theme` dentro de `src/app/globals.css` (nunca em `:root`, que é o admin).
- Novo componente de card/seção: seguir os paddings/radii já usados (`rounded-2xl border border-border bg-surface p-6`, hover `hover:-translate-y-1 hover:border-coral`).
- Novo case ou artefato: usar as colunas já existentes na tabela `cases` (`imagens text[]`, `video_url`, `figma_url`, `slides_url`, `pdf_url`, `destaques jsonb`) em vez de inventar um esquema novo.
