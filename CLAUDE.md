@AGENTS.md

# Site Tales Pereira / TPointic

Portfólio do Tales Pereira, que também vai abrigar a parte da **TPointic** (grafia exata). Responder em português.

## Como trabalhar
- **Código (texto, layout, páginas, cases):** pode ser feito na nuvem (claude.ai/code ou celular) ou no PC. O repositório é a fonte: `github.com/efreetales/tpointic`.
- **Publicação:** a Vercel (projeto `tpointic`) está ligada ao GitHub. Push no `master` publica direto em **talespereira.com**. Por isso, trabalhe numa **branch** (`ajuste/<assunto>`), mande o link do preview da Vercel para o Tales conferir e só junte no `master` quando ele aprovar.
- **Estúdio local (só no PC do Tales):** vídeos dos cases (clipes baixados, ffmpeg), 3D/Blender e mídia pesada. O arquivo pronto entra no repositório; o resto do trabalho segue na nuvem. Na nuvem não há esses arquivos nem GPU: se a tarefa precisar deles, avise e deixe para uma sessão local.
- **Chaves:** `.env.local` não vai para o Git (modelo em `.env.example`). Na nuvem, as variáveis ficam nas configurações do ambiente; na Vercel, nas do projeto.
- Branch `design/paleta-clara-pastel`: exploração de paleta clara (WIP, não juntar ao `master` sem o Tales pedir).
