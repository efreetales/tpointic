"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Like = {
  id: string;
  path: string;
  x_pct: number;
  y_pct: number;
  area: string | null;
  criado_em: string;
};

// Overlay dos corações carimbados pelos visitantes (`LikeStamper`, no site
// público) sobre a própria página real, carregada num iframe same-origin —
// dá pra ler `iframe.contentDocument` porque admin e site rodam no mesmo
// domínio. O iframe é redimensionado pra altura TOTAL da página (sem
// scroll interno) depois do load, e os corações são posicionados em cima
// dele por `x_pct`/`y_pct` — mesmas % salvas no momento do carimbo.
// Ranking de "o que foi curtido" numa página — agrupado pela seção
// descoberta automaticamente no momento do duplo clique (`findLikedArea`
// em `like-stamper.tsx`), não pela posição exata. É a pergunta que
// realmente importa pro dono do site ("o que as pessoas gostaram"), o
// overlay abaixo é só o detalhe visual de apoio.
function AreaRanking({ likes }: { likes: Like[] }) {
  const byArea = likes.reduce<Record<string, number>>((acc, l) => {
    const key = l.area?.trim() || "Não identificado";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const areas = Object.entries(byArea).sort((a, b) => b[1] - a[1]);
  const max = areas[0]?.[1] ?? 1;

  return (
    <div className="rounded-2xl border border-border bg-white p-6">
      <h2 className="text-sm font-bold uppercase tracking-widest text-gray">
        O que as pessoas curtiram
      </h2>
      <ul className="mt-4 space-y-3">
        {areas.map(([area, count]) => (
          <li key={area}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-bold text-navy">{area}</span>
              <span className="text-gray">
                {count} ❤️
              </span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-[#ff4d6d]"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CurtidasPage() {
  const [likes, setLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [frameSize, setFrameSize] = useState<{ w: number; h: number } | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("page_likes")
      .select("id, path, x_pct, y_pct, area, criado_em")
      .order("criado_em", { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error;
        setLikes(data ?? []);
        setLoading(false);
      });
  }, []);

  const byPath = likes.reduce<Record<string, Like[]>>((acc, l) => {
    (acc[l.path] ??= []).push(l);
    return acc;
  }, {});
  const paths = Object.keys(byPath).sort((a, b) => byPath[b].length - byPath[a].length);

  const handleIframeLoad = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    setFrameSize({ w: doc.documentElement.scrollWidth, h: doc.documentElement.scrollHeight });
  };

  if (loading) {
    return <p className="text-gray">Carregando…</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-black text-navy">Curtidas</h1>
      <p className="mt-2 text-slate">
        {likes.length} coraçãozinho{likes.length === 1 ? "" : "s"} carimbado
        {likes.length === 1 ? "" : "s"} pelos visitantes, em {paths.length} página
        {paths.length === 1 ? "" : "s"}.
      </p>

      {paths.length === 0 && (
        <p className="mt-8 text-gray">Ninguém carimbou nada ainda.</p>
      )}

      {paths.length > 0 && (
        <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
          <ul className="space-y-2">
            {paths.map((path) => (
              <li key={path}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPath(path);
                    setFrameSize(null);
                  }}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-bold transition-colors ${
                    selectedPath === path
                      ? "border-coral bg-coral/10 text-navy"
                      : "border-border bg-white text-slate hover:border-coral"
                  }`}
                >
                  {path}
                  <span className="ml-2 text-gray">({byPath[path].length})</span>
                </button>
              </li>
            ))}
          </ul>

          <div>
            {!selectedPath && (
              <p className="text-gray">Escolha uma página pra ver o que foi curtido nela.</p>
            )}
            {selectedPath && (
              <AreaRanking likes={byPath[selectedPath]} />
            )}
            {selectedPath && (
              <div
                className="relative mt-6 overflow-hidden rounded-2xl border border-border bg-white"
                style={{ width: "100%", maxWidth: 1280 }}
              >
                <div
                  className="relative"
                  style={{
                    width: frameSize?.w ?? 1280,
                    height: frameSize?.h ?? 900,
                    transform: frameSize ? `scale(${Math.min(1, 1280 / frameSize.w)})` : undefined,
                    transformOrigin: "top left",
                  }}
                >
                  <iframe
                    ref={iframeRef}
                    src={selectedPath}
                    onLoad={handleIframeLoad}
                    width={frameSize?.w ?? 1280}
                    height={frameSize?.h ?? 900}
                    className="block border-0"
                  />
                  {frameSize &&
                    byPath[selectedPath].map((l) => (
                      <span
                        key={l.id}
                        title={new Date(l.criado_em).toLocaleString("pt-BR")}
                        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-2xl"
                        style={{ left: `${l.x_pct}%`, top: `${l.y_pct}%` }}
                      >
                        ❤️
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
