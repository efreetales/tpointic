@AGENTS.md

# Site Tales Pereira / TPointic

Portfólio do Tales Pereira, que também vai abrigar a parte da **TPointic** (grafia exata). Responder em português.

## Como trabalhar
- **Código (texto, layout, páginas, cases):** pode ser feito na nuvem (claude.ai/code ou celular) ou no PC. O repositório é a fonte: `github.com/efreetales/tpointic`.
- **Publicação:** a Vercel (projeto `tpointic`) está ligada ao GitHub. Push no `master` publica direto em **talespereira.com**. Por isso, trabalhe numa **branch** (`ajuste/<assunto>`), mande o link do preview da Vercel para o Tales conferir e só junte no `master` quando ele aprovar.
- **Estúdio local (só no PC do Tales):** vídeos dos cases (clipes baixados, ffmpeg), 3D/Blender e mídia pesada. O arquivo pronto entra no repositório; o resto do trabalho segue na nuvem. Na nuvem não há esses arquivos nem GPU: se a tarefa precisar deles, avise e deixe para uma sessão local.
- **Chaves:** `.env.local` não vai para o Git (modelo em `.env.example`). Na nuvem, as variáveis ficam nas configurações do ambiente; na Vercel, nas do projeto.
- Branch `design/paleta-clara-pastel`: exploração de paleta clara (WIP, não juntar ao `master` sem o Tales pedir).

## Quem é o Tales (importante para a linguagem)
- Tales é **UX designer** e não entende de programação nem de desenvolvimento. Falar sempre em linguagem do dia a dia, sem jargão (nada de "rodar git pull", "merge", "commit" sem explicar). Se precisar usar um termo técnico, explique em uma frase simples.
- Ele não roda comandos: quem executa tudo é o Claude. Explicar o resultado em termos de "o que mudou no site" e "o que ele precisa fazer" (geralmente só olhar o link e aprovar).

## Frases do Tales e o que significam
- **"Suba"** (ou "atualize o repositório"): salvar o trabalho e enviar para o GitHub **numa branch** (nunca no `master`), e devolver o link do preview da Vercel.
- **"Atualize com o que foi feito na nuvem"**: antes de mexer, puxar do GitHub o que já foi feito em outras sessões (nuvem ou PC), para não perder nem conflitar com nada.
- **"Pode publicar"**: só com esse pedido, juntar a branch aprovada no `master` (vai para talespereira.com). Sem esse pedido, nunca publicar.
- Ao iniciar uma sessão no PC, sempre conferir por conta própria se há novidades da nuvem na branch e avisar o Tales, sem exigir que ele peça.
- Uma branch por assunto; não mexer na mesma branch no PC e na nuvem ao mesmo tempo.
