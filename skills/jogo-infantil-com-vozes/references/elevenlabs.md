# ElevenLabs: o que funcionou

Plano pago (Starter ou acima) libera uso comercial. A chave fica só no computador da pessoa, em variável de ambiente.

## Endpoints usados (`https://api.elevenlabs.io/v1`, header `xi-api-key`)

| O quê | Chamada |
| --- | --- |
| Falas | `POST /text-to-speech/{voice_id}?output_format=mp3_44100_128` — corpo `{ text, model_id, voice_settings:{stability, similarity_boost, style, use_speaker_boost, speed} }` |
| Músicas | `POST /music` — corpo `{ prompt, music_length_ms, model_id:"music_v1" }` (pode levar minutos) |
| Efeitos | `POST /sound-generation` — corpo `{ text, duration_seconds, prompt_influence }` (prompt em inglês rende melhor) |
| Tempo por palavra | `POST /speech-to-text` (multipart) — `model_id=scribe_v1`, `language_code=por`, `timestamps_granularity=word` |

## Ajuste de voz por personagem (ponto de partida)

| Personalidade | stability | style | speed |
| --- | --- | --- | --- |
| Expressiva, animada | 0.3 | 1.0 | 0.9 |
| Calma, contadora | 0.6 | 0.25 | 0.85 |
| Firme e clara (conta/soletra) | 0.9–1.0 | 0.0–0.1 | 0.85 |

Crianças entendem melhor falas **mais lentas** (0.85–0.9). Estabilidade baixa dá emoção, mas pode trocar o timbre entre falas: se a voz "mudar", suba a estabilidade.

## Modelo

- `eleven_v4` aceita marcações de emoção entre colchetes (`[excited]`). Boa entonação, mas palavras soltas (contagens: "uma", "duas") podem sair com cara de pergunta.
- `eleven_multilingual_v2` não lê marcações (retire-as) e aceita `previous_text` como contexto sem falá-lo — ajuda em palavras de uma sílaba só.
- Compare os dois com 3–4 falas-chave e deixe a pessoa escolher de ouvido.

## Verificação automática

O script transcreve cada fala de volta (scribe) e compara com o texto (normalizado, sem acento nem pontuação). Abaixo de 0,9 de semelhança ele tenta de novo (até `tentativas`) e, se nada bater, grava em `revisar.txt` para ouvir. Isso pegou "É o morango" no lugar de "É um morango".

## Custo e segurança

- Gere só o que mudou: o script pula arquivos existentes; para refazer use `--refazer=id1,id2`.
- Nunca mostre a chave na tela, em logs ou em arquivos commitados. Se ela vazar, revogue no painel.
