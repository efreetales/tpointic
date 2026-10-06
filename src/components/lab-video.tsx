"use client";

import { useRef, useState } from "react";
import { VolumeHigh, VolumeX } from "@mynaui/icons-react";

// Vídeo em loop, mudo por padrão (autoplay só funciona mudo); o botão liga o
// som pra quem quiser ouvir a música do clipe.
export function LabVideo({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  return (
    <div className={`relative ${className ?? ""}`}>
      <video
        ref={ref}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
      />
      <button
        type="button"
        onClick={() => {
          const v = ref.current;
          if (!v) return;
          v.muted = !v.muted;
          setMuted(v.muted);
        }}
        aria-label={muted ? "Ligar o som" : "Desligar o som"}
        className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-sm font-bold text-white backdrop-blur transition-transform hover:scale-105"
      >
        {muted ? <VolumeX size={18} /> : <VolumeHigh size={18} />}
        {muted ? "Ouvir o clipe" : "Som ligado"}
      </button>
    </div>
  );
}
