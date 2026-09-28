"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";

export type VideoChapter = {
  title: string;
  description: string;
  // Segundo do vídeo em que a etapa começa.
  at: number;
  Icon: ComponentType<{ size?: number }>;
};

function formatTime(seconds: number) {
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

// "A solução" no formato índice + vídeo: cada etapa é um capítulo do vídeo.
// Clicar numa etapa pula o vídeo pro ponto correspondente e dá play; ao
// reproduzir, a etapa ativa acompanha o tempo do vídeo (com uma barra de
// progresso dentro do capítulo). Índice à esquerda, vídeo à direita — no
// mobile o vídeo vem primeiro e o índice embaixo.
export function VideoIndex({
  src,
  chapters,
}: {
  src: string;
  chapters: VideoChapter[];
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const sync = () => {
      const t = video.currentTime;
      let index = 0;
      chapters.forEach((chapter, i) => {
        if (t >= chapter.at - 0.05) index = i;
      });
      const start = chapters[index].at;
      const end = chapters[index + 1]?.at ?? (video.duration || start + 1);
      setActive(index);
      setProgress(
        t < start
          ? 0
          : Math.min(1, Math.max(0, (t - start) / Math.max(end - start, 0.1))),
      );
    };

    video.addEventListener("timeupdate", sync);
    video.addEventListener("seeked", sync);
    video.addEventListener("loadedmetadata", sync);
    return () => {
      video.removeEventListener("timeupdate", sync);
      video.removeEventListener("seeked", sync);
      video.removeEventListener("loadedmetadata", sync);
    };
  }, [chapters]);

  const jumpTo = (index: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = chapters[index].at;
    setActive(index);
    setProgress(0);
    void video.play().catch(() => {});
  };

  return (
    // Índice com largura fixa e estreita (21rem) e o vídeo ocupando todo o
    // resto, num contêiner mais largo que o resto da página (88rem): o vídeo
    // é o protagonista do bloco e mostra UI com texto pequeno, então precisa
    // de tamanho pra ser legível.
    <div className="mx-auto grid max-w-[88rem] items-start gap-8 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:gap-10">
      <ol className="order-2 flex flex-col gap-2 lg:order-1">
        {chapters.map((chapter, i) => {
          const isActive = i === active;
          const { Icon } = chapter;
          return (
            <li key={chapter.title}>
              <button
                type="button"
                onClick={() => jumpTo(i)}
                aria-current={isActive ? "step" : undefined}
                className={`group relative w-full overflow-hidden rounded-2xl border p-4 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#66fcf1] ${
                  isActive
                    ? "border-[#66fcf1] bg-black/25 shadow-[0_0_32px_-12px_#66fcf1]"
                    : "border-white/10 bg-black/10 hover:border-[#66fcf1]/60 hover:bg-black/20"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-1 transition-colors ${
                      isActive
                        ? "bg-[#66fcf1] text-black ring-[#66fcf1]"
                        : "bg-black/25 text-[#66fcf1] ring-[#66fcf1]/60"
                    }`}
                  >
                    <Icon size={22} />
                  </span>
                  <span
                    className={`flex-1 text-base font-black leading-snug transition-colors sm:text-lg ${
                      isActive
                        ? "text-[#66fcf1]"
                        : "text-white group-hover:text-[#66fcf1]"
                    }`}
                  >
                    {chapter.title}
                  </span>
                  <span
                    className={`shrink-0 text-xs font-bold tabular-nums ${
                      isActive ? "text-[#66fcf1]" : "text-white/70"
                    }`}
                  >
                    {formatTime(chapter.at)}
                  </span>
                </div>

                <div
                  className={`grid transition-all duration-300 ${
                    isActive
                      ? "mt-3 grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <p className="overflow-hidden pl-[3.75rem] text-[0.95rem] leading-relaxed text-white/90">
                    {chapter.description}
                  </p>
                </div>

                {isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-[#66fcf1] transition-transform duration-300 ease-linear"
                    style={{ transform: `scaleX(${progress})` }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="order-1 lg:sticky lg:top-24 lg:order-2">
        <div className="overflow-hidden rounded-2xl border border-[#66fcf1]/30 shadow-[0_24px_80px_-24px_rgba(102,252,241,0.35)]">
          <video
            ref={videoRef}
            src={src}
            controls
            playsInline
            preload="metadata"
            className="block w-full bg-black"
          />
        </div>
      </div>
    </div>
  );
}
