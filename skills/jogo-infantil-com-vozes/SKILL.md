---
name: jogo-infantil-com-vozes
description: Cria um jogo web infantil (3 a 6 anos) com personagens que falam e cantam — falas e músicas geradas no ElevenLabs, boca e karaokê sincronizados com a letra, resposta por voz da criança e publicação no Vercel. Use quando a pessoa pedir um jogo/atividade infantil com vozes de personagens, músicas, "bichinhos que falam", ou quiser sincronizar boca de personagem com áudio.
---

# Jogo infantil com voz e música

Receita extraída do **Bicharada Cantante** (https://tpointic-kids.vercel.app): um jogo de contar frutas com quatro bichos brasileiros que falam e cantam, feito em um dia por alguém que não programa. Quem usa esta skill provavelmente também não programa: explique em português simples, faça o trabalho técnico e só peça o que exige ação da pessoa (escolher voz, ouvir, aprovar, colar a chave da API).

## Fluxo

1. **Conceito curto.** Faixa etária, uma mecânica só (ex.: contar frutas), 3–5 personagens com espécie e personalidade, 3–6 rodadas fixas. Resista a ampliar: o jogo cresce depois, rodada a rodada.
2. **Roteiro de falas.** Uma tabela `id → personagem → texto` (abertura, apresentação, pedido da rodada, contagem 1..N, erro, acerto, fim). Frases curtas, uma ideia por fala. Para ensinar leitura, o personagem **soletra as sílabas** ("ma-nga… manga!"). Veja `references/roteiro-e-pedagogia.md`.
3. **Vozes.** A pessoa cria/escolhe uma voz por personagem no ElevenLabs e passa os `voice_id`. Defina os ajustes de cada uma (estabilidade, estilo, velocidade) em `jogo.config.json`. Veja `references/elevenlabs.md`.
4. **Gerar áudios** com `scripts/gerar_audios.mjs` (falas, músicas, efeitos e tempos por palavra). A chave vem da variável `ELEVENLABS_API_KEY`: **nunca imprima, copie ou grave a chave em arquivo do projeto**. O script verifica cada fala transcrevendo-a de volta e refaz até sair certa.
5. **Jogo em um único `index.html`** (HTML+CSS+JS, sem build), com os personagens em SVG articulado (corpo, cabeça, braços como partes com `transform-origin`) e áudios carregados de `audios/`. Sincronia de boca e karaokê: `references/sincronia-boca-karaoke.md`.
6. **Resposta por voz.** Microfone sempre ligado na hora da pergunta (criança não aperta botão), com `SpeechRecognition` em `pt-BR`, e o toque como alternativa. Detalhes e armadilhas em `references/microfone.md`.
7. **Cenas especiais** que fazem a criança sorrir: vitória com música, hora de dormir (dia vira noite, bocejo, olhos fechando). Cada uma é um estado visual (classes CSS) ligado à letra da música.
8. **Publicar:** repositório no GitHub + projeto no Vercel (HTML estático; HTTPS é obrigatório para o microfone). Nada de anúncios nem cadastro.

## Regras que evitam retrabalho

- **Teste com ouvido, não só com checagem.** Depois de gerar, peça para a pessoa ouvir 3–4 falas-chave. Entonação de pergunta onde devia ser afirmação, voz trocada e número engolido ("uma") são os erros comuns.
- **Sempre guarde a versão anterior** do `index.html` em `versoes_antigas/` antes de mudar o visual.
- **Efeitos sonoros: pergunte antes de adotar.** Ronco e bocejo gerados por IA podem soar "monstruosos" ou atrapalhar a música; baixe volumes e ofereça alternativas.
- **3D para personagens que mexem a boca dá muito trabalho** (modelo, esqueleto, boca, olhos, textura). Para o primeiro jogo, fique no 2D/SVG articulado.
- **Todo `setTimeout` do fluxo do jogo** deve passar por uma função que guarda o "número da vez"; ao interromper (botão de música, recomeçar), incremente o número e os passos antigos são ignorados.
- Botões sempre visíveis para: tocar a música tema, tocar a de dormir, pular a vitória e recomeçar.
- Aviso para os pais sobre o microfone na tela inicial; o jogo deve funcionar só com toque se negarem.

## Arquivos desta skill

- `scripts/gerar_audios.mjs` — gera falas, músicas, efeitos e `*.tempos.json` (Node 18+, sem dependências).
- `assets/jogo.config.exemplo.json` — modelo de configuração (copie para `jogo.config.json`).
- `references/elevenlabs.md` — endpoints, parâmetros e o que funcionou.
- `references/sincronia-boca-karaoke.md` — código de boca por volume, boca por sílaba e karaokê.
- `references/microfone.md` — reconhecimento de voz para crianças.
- `references/roteiro-e-pedagogia.md` — como escrever as falas e soletrar.
