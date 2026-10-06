# Resposta por voz da criança

- **Sem botão.** Criança não aperta "Falar". Comece a escutar sozinho na pergunta, ~0,3 s **depois** de o personagem terminar de falar (para não ouvir a própria voz).
- `SpeechRecognition`/`webkitSpeechRecognition`, `lang = "pt-BR"`, `maxAlternatives = 5`, uma frase por ciclo; reinicie ao fim de cada frase até acertar ou passar de um limite (ex.: 40 s), quando mostra "Toque na fruta!".
- Compare por **nome da resposta sem acento, singular ou plural** ("manga", "mangas") entre as alternativas. Se for outra resposta válida do jogo: "Hmm, não é uma banana. Tenta de novo!". Se não ouviu nada: "Não ouvi direitinho…".
- **Toque sempre funciona** como alternativa. Mostre um ícone discreto "Ouvindo" que um adulto pode tocar para pausar.
- Peça a permissão do microfone no primeiro botão ("Brincar"), em paralelo, sem travar a abertura. Se negada ou erro fatal (`not-allowed`, `network`), siga só por toque.
- Funciona em **HTTPS** ou `localhost`. O reconhecimento pode ser local ou enviado ao Google/Apple conforme o navegador: avise isso na tela inicial e no rodapé "Para pais".
- Reconhecimento infantil erra bastante: aceite várias alternativas e seja generoso. Teste com voz de criança de verdade, não só com adulto.
