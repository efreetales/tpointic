#!/usr/bin/env node
// Gera falas, músicas, efeitos e tempos por palavra no ElevenLabs.
// Uso: ELEVENLABS_API_KEY=... node gerar_audios.mjs [jogo.config.json] [--refazer id1,id2] [--sem-verificar]
// Node 18+, sem dependências. A chave só é lida da variável de ambiente.
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { join, dirname } from "node:path";

const API = "https://api.elevenlabs.io/v1";
const KEY = (process.env.ELEVENLABS_API_KEY || "").trim();
const args = process.argv.slice(2);
const cfgPath = args.find((a) => !a.startsWith("--")) || "jogo.config.json";
const refazer = new Set(
  (args.find((a) => a.startsWith("--refazer="))?.split("=")[1] || "")
    .split(",")
    .filter(Boolean),
);
const verificar = !args.includes("--sem-verificar");

if (!KEY) {
  console.error("Defina a variável ELEVENLABS_API_KEY (a chave não deve ficar em arquivo do projeto).");
  process.exit(1);
}

const cfg = JSON.parse(await readFile(cfgPath, "utf8"));
const saida = join(dirname(cfgPath), cfg.saida || "audios");
const idioma = cfg.idioma || "por";
const modelo = cfg.modelo || "eleven_v4";
const tentativas = cfg.tentativas || 3;
await mkdir(saida, { recursive: true });

const existe = (p) => access(p).then(() => true, () => false);
const log = { ok: 0, pulados: 0, falhas: 0, revisar: [] };

async function pedir(url, init, timeoutMs = 120000) {
  const r = await fetch(url, {
    ...init,
    headers: { "xi-api-key": KEY, ...(init.headers || {}) },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r;
}

// Marcações de emoção do v4 ([excited]) não são faladas: tira para comparar.
const semMarcas = (t) => t.replace(/\[[^\]]*\]/g, " ");
const normaliza = (t) =>
  semMarcas(t)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function distancia(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
const parecido = (a, b) => {
  const x = normaliza(a), y = normaliza(b);
  return 1 - distancia(x, y) / Math.max(x.length, y.length, 1);
};

async function transcrever(buffer, nome) {
  const form = new FormData();
  form.append("model_id", "scribe_v1");
  form.append("language_code", idioma);
  form.append("timestamps_granularity", "word");
  form.append("file", new Blob([buffer], { type: "audio/mpeg" }), `${nome}.mp3`);
  const r = await pedir(`${API}/speech-to-text`, { method: "POST", body: form }, 300000);
  return r.json();
}

async function falar(f) {
  const p = cfg.personagens[f.quem];
  if (!p) throw new Error(`personagem desconhecido: ${f.quem}`);
  const corpo = {
    text: f.texto,
    model_id: modelo,
    voice_settings: {
      stability: p.stability,
      similarity_boost: p.similarity_boost,
      style: p.style,
      use_speaker_boost: true,
      speed: p.speed,
    },
  };
  const r = await pedir(`${API}/text-to-speech/${p.voice_id}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  });
  return Buffer.from(await r.arrayBuffer());
}

async function salvarTempos(nome, json) {
  const palavras = (json.words || [])
    .filter((w) => w.type === "word")
    .map((w) => ({ p: w.text, i: +w.start.toFixed(2), f: +w.end.toFixed(2) }));
  await writeFile(join(saida, `${nome}.tempos.json`), JSON.stringify(palavras));
  return palavras.length;
}

console.log("== Falas ==");
for (const f of cfg.falas || []) {
  const destino = join(saida, `${f.id}.mp3`);
  if ((await existe(destino)) && !refazer.has(f.id)) {
    log.pulados++;
    continue;
  }
  try {
    let melhor = null;
    for (let t = 1; t <= tentativas; t++) {
      const audio = await falar(f);
      if (!verificar) { melhor = { audio, nota: 1 }; break; }
      const ouvido = await transcrever(audio, f.id);
      const nota = parecido(f.texto, ouvido.text || "");
      if (!melhor || nota > melhor.nota) melhor = { audio, nota, ouvido, texto: ouvido.text };
      if (nota >= 0.9) break;
      console.log(`   ${f.id}: tentativa ${t} soou "${ouvido.text}" (${nota.toFixed(2)})`);
    }
    await writeFile(destino, melhor.audio);
    if (melhor.nota < 0.9) log.revisar.push(`${f.id}: ouvi "${melhor.texto}" mas o texto é "${semMarcas(f.texto).trim()}"`);
    if (f.tempos) await salvarTempos(f.id, melhor.ouvido || (await transcrever(melhor.audio, f.id)));
    console.log(`   ok  ${f.id}${melhor.nota < 0.9 ? "  (REVISAR de ouvido)" : ""}`);
    log.ok++;
  } catch (e) {
    console.error(`   erro ${f.id}: ${e.message}`);
    log.falhas++;
  }
}

console.log("== Músicas (podem levar alguns minutos) ==");
for (const m of cfg.musicas || []) {
  const destino = join(saida, `${m.id}.mp3`);
  try {
    if (!(await existe(destino)) || refazer.has(m.id)) {
      const r = await pedir(
        `${API}/music`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: m.prompt, music_length_ms: m.duracao_ms, model_id: "music_v1" }),
        },
        600000,
      );
      await writeFile(destino, Buffer.from(await r.arrayBuffer()));
      console.log(`   ok  ${m.id}`);
      log.ok++;
    } else log.pulados++;
    // Tempo de cada palavra cantada: base do karaokê e da boca que só abre cantando.
    const arq = join(saida, `${m.id}.tempos.json`);
    if (refazer.has(m.id) || !(await existe(arq))) {
      const n = await salvarTempos(m.id, await transcrever(await readFile(destino), m.id));
      console.log(`   tempos ${m.id}: ${n} palavras`);
    }
  } catch (e) {
    console.error(`   erro ${m.id}: ${e.message}`);
    log.falhas++;
  }
}

console.log("== Efeitos ==");
for (const e of cfg.efeitos || []) {
  const destino = join(saida, `${e.id}.mp3`);
  if ((await existe(destino)) && !refazer.has(e.id)) {
    log.pulados++;
    continue;
  }
  try {
    const r = await pedir(`${API}/sound-generation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: e.texto, duration_seconds: e.duracao_s, prompt_influence: 0.6 }),
    });
    await writeFile(destino, Buffer.from(await r.arrayBuffer()));
    console.log(`   ok  ${e.id}`);
    log.ok++;
  } catch (err) {
    console.error(`   erro ${e.id}: ${err.message}`);
    log.falhas++;
  }
}

console.log(`\nFeitos: ${log.ok} · já existiam: ${log.pulados} · falhas: ${log.falhas}`);
if (log.revisar.length) {
  console.log("\nOuça estas falas (a transcrição não bateu com o texto):");
  log.revisar.forEach((l) => console.log(" - " + l));
  await writeFile(join(saida, "revisar.txt"), log.revisar.join("\n"));
}
process.exit(log.falhas ? 1 : 0);
