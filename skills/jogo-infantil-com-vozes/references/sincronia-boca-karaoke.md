# Sincronia de boca e karaokê

## Falas: boca pelo volume

Ligue o áudio a um `AnalyserNode` e abra a boca quando o volume passa de um limite.

```js
function lipSync(an, personagens, durSeg, fonte) {
  const dados = new Uint8Array(an.fftSize);
  const fim = performance.now() + durSeg * 1000;
  (function tick() {
    an.getByteTimeDomainData(dados);
    let soma = 0;
    for (const v of dados) { const x = (v - 128) / 128; soma += x * x; }
    const nivel = fonte === clipeAtual ? Math.sqrt(soma / dados.length) : 0;
    personagens.forEach((p) => p.classList.toggle("talk", nivel > 0.035));
    if (performance.now() < fim && fonte === clipeAtual) requestAnimationFrame(tick);
    else personagens.forEach((p) => p.classList.remove("talk"));
  })();
}
```

## Músicas: boca só dentro das palavras cantadas

Volume não serve para música (o instrumental também "fala"). Use os tempos do scribe (`m1_tema.tempos.json` = `[{p, i, f}]`: palavra, início, fim em segundos): a boca abre uma vez por **sílaba** durante cada palavra.

```js
function singSync(palavras, personagens, t0, durSeg, fonte, audioCtx) {
  const silabas = palavras.map((w) => Math.max(1, contaSilabas(w.p)));
  let k = 0;
  (function tick() {
    const t = audioCtx.currentTime - t0;
    while (k < palavras.length && t > palavras[k].f) k++;
    let aberta = false;
    if (k < palavras.length && t >= palavras[k].i) {
      const fatia = (palavras[k].f - palavras[k].i) / silabas[k];
      aberta = ((t - palavras[k].i) % fatia) / fatia < 0.7;
    }
    personagens.forEach((p) => p.classList.toggle("talk", aberta && fonte === clipeAtual));
    if (t < durSeg && fonte === clipeAtual) requestAnimationFrame(tick);
    else personagens.forEach((p) => p.classList.remove("talk"));
  })();
}
```

`contaSilabas` pode ser uma regra simples de grupos vocálicos para português (ditongos contam como uma sílaba).

## Karaokê

Acenda cada palavra no `i` (início) dela, a partir dos mesmos tempos. A letra mostrada vem do texto da música; ancore a primeira palavra do JSON à primeira da letra e siga em ordem. Confira medindo: o desvio entre palavra acesa e palavra cantada deve ficar abaixo de 0,05 s.

## Cenas ligadas à letra

Marque o instante em que a letra cita cada personagem (por exemplo `SLEEP_WORD` sobre o JSON de tempos da música de dormir) e dispare a animação ~0,5 s depois: olhos pesados → bocejo → olhos fechados → respiração. Dia→noite: camadas de cenário (céu, pôr do sol, noite, estrelas, sol, lua) com a classe `.night` no contêiner.

## Dica de teste

Navegadores reduzem `requestAnimationFrame` em janelas sem foco: para medir sincronia, troque por `setTimeout(cb, 16)` numa aba de teste e mantenha a janela visível.
