"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "@mynaui/icons-react";

const BASE =
  "https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/cases/acesso-delegado";

const LOCUCAO = [
  "Dona Lúcia quer continuar no comando do próprio dinheiro.",
  "A Rose cuida da rotina, dentro de um limite.",
  "Quando algo foge do normal, o banco segura, e quem ela escolheu aprova.",
  "O Marcos acompanha, sem precisar aprovar cada compra.",
  "Acesso delegado com consentimento. Delegar não é desaparecer da própria conta.",
];

// Comercial de 30s do conceito em uso: cenas geradas por IA (Wan 2.7),
// telas do protótipo e locução em pt-BR. Tudo ilustrativo.
export function Comercial() {
  const ref = useRef<HTMLVideoElement>(null);
  const [tocando, setTocando] = useState(false);

  function tocar() {
    const v = ref.current;
    if (!v) return;
    v.controls = true;
    setTocando(true);
    void v.play();
  }

  return (
    <section id="comercial" className="relative bg-[#070a14] pb-24 pt-4">
      <div className="mx-auto max-w-5xl px-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#66fcf1]">
          O conceito em uso
        </p>
        <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
          Um dia comum, em 30 segundos.
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative mt-10 overflow-hidden rounded-3xl border border-white/15 bg-black shadow-[0_40px_120px_-30px_rgba(103,76,255,0.55)]"
        >
          <video
            ref={ref}
            src={`${BASE}/comercial-v6.mp4`}
            poster={`${BASE}/comercial-poster-v6.jpg`}
            preload="metadata"
            playsInline
            onEnded={() => setTocando(false)}
            onPause={() => {
              if (ref.current && ref.current.ended) setTocando(false);
            }}
            className="block aspect-video w-full"
          />
          {!tocando && (
            <button
              type="button"
              onClick={tocar}
              aria-label="Assistir ao comercial de 30 segundos"
              className="group absolute inset-0 flex items-center justify-center bg-black/25 transition-colors hover:bg-black/10"
            >
              <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:scale-110">
                <span className="ad-pulse absolute inset-0 rounded-full bg-white/50" />
                <Play size={36} className="relative translate-x-0.5" />
              </span>
            </button>
          )}
        </motion.div>

        <p className="mt-4 text-xs text-white/50">
          Cenas geradas por IA, telas do protótipo conceitual e locução
          sintética em português. Personagens e situações são fictícios.
        </p>

        <details className="mt-4 rounded-2xl border border-white/10 p-5">
          <summary className="cursor-pointer text-sm font-bold uppercase tracking-widest text-white/60">
            Ler a locução
          </summary>
          <ul className="mt-4 space-y-2 text-white/75">
            {LOCUCAO.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}
