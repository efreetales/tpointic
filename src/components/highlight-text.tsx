"use client";

import { motion } from "framer-motion";

// Marca-texto: uma faixa colada atrás da palavra que "desliza" da esquerda
// pra direita (scaleX 0 → 1, origin-left) quando entra na tela, simulando
// um marcador passando por cima — mesmo gatilho de viewport do `Reveal`
// (`whileInView`, `once: true`), só que aplicado a uma palavra em vez do
// bloco inteiro.
export function HighlightText({
  children,
  color = "#6ff8ef",
  delay = 0.4,
}: {
  children: React.ReactNode;
  color?: string;
  delay?: number;
}) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
        className="absolute inset-y-0 left-0 w-full origin-left rounded-sm"
        style={{ backgroundColor: color }}
      />
      <span className="relative">{children}</span>
    </span>
  );
}
