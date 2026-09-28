"use client";

import { useEffect, useState } from "react";

// Frase que alterna no hero. Todas as frases ficam empilhadas na mesma célula
// de um grid (só a ativa é visível), então a altura do bloco é sempre a da
// maior frase e o texto abaixo não "pula" a cada troca.
export function RotatingPhrase({
  phrases,
  interval = 3200,
  className = "",
}: {
  phrases: string[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (phrases.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % phrases.length), interval);
    return () => clearInterval(id);
  }, [phrases.length, interval]);

  return (
    <>
      <span className="sr-only">{phrases[0]}</span>
      <span aria-hidden className={`grid ${className}`}>
        {phrases.map((phrase, i) => (
          <span
            key={phrase}
            className={`col-start-1 row-start-1 whitespace-nowrap transition-all duration-500 ease-out motion-reduce:transition-none ${
              i === index ? "translate-y-0 opacity-100 blur-0" : "translate-y-3 opacity-0 blur-[2px]"
            }`}
          >
            {phrase}
          </span>
        ))}
      </span>
    </>
  );
}
