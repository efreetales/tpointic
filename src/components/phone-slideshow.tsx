"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type Screen = { src: string; alt: string };

export function PhoneSlideshow({
  screens,
  interval = 2200,
}: {
  screens: Screen[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % screens.length);
    }, interval);
    return () => clearInterval(id);
  }, [screens.length, interval]);

  return (
    <div className="relative mx-auto aspect-[9/19.5] w-full max-w-[300px] rounded-[2.75rem] border-[10px] border-black bg-black shadow-2xl">
      <div className="absolute left-1/2 top-0 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-black" />
      <div className="relative h-full w-full overflow-hidden rounded-[2rem]">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={screens[index].src}
              alt={screens[index].alt}
              fill
              className="object-cover object-top"
              sizes="300px"
              priority={index === 0}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
