"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Screen = { src: string; alt: string };

const FRAME_URL =
  "https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/mockups/macbook-frame.png";
const FRAME_WIDTH = 1370;
const FRAME_HEIGHT = 835;

// Cutout box measured directly off the frame PNG's own chroma-keyed screen
// area (pixels 124-1245 x, 17-741 y out of 1370x835) — expressed as % so it
// scales with the frame regardless of its rendered size.
const SCREEN_BOX = {
  left: (124 / FRAME_WIDTH) * 100,
  top: (17 / FRAME_HEIGHT) * 100,
  width: ((1245 - 124 + 1) / FRAME_WIDTH) * 100,
  height: ((741 - 17 + 1) / FRAME_HEIGHT) * 100,
};

export function MacbookScreens({
  screens,
  interval = 2600,
}: {
  screens: Screen[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (screens.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % screens.length);
    }, interval);
    return () => clearInterval(id);
  }, [screens.length, interval]);

  return (
    <div className="relative w-full" style={{ aspectRatio: `${FRAME_WIDTH} / ${FRAME_HEIGHT}` }}>
      <div
        className="absolute overflow-hidden rounded-[3%] bg-black"
        style={{
          left: `${SCREEN_BOX.left}%`,
          top: `${SCREEN_BOX.top}%`,
          width: `${SCREEN_BOX.width}%`,
          height: `${SCREEN_BOX.height}%`,
        }}
      >
        {screens.map((s, i) => (
          <Image
            key={s.src}
            src={s.src}
            alt={s.alt}
            fill
            className="object-cover object-top transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === index ? 1 : 0 }}
            sizes="(min-width: 1024px) 700px, 90vw"
            priority={i === 0}
          />
        ))}
      </div>

      <Image
        src={FRAME_URL}
        alt=""
        fill
        className="pointer-events-none relative z-10 object-contain"
        sizes="(min-width: 1024px) 700px, 90vw"
        priority
      />
    </div>
  );
}
