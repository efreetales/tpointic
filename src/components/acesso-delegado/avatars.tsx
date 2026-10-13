import { useId } from "react";

// Ilustrações planas dos personagens do case. Cada rosto é montado a partir de
// poucas peças (cabelo, óculos, bigode...), então todos ficam com a mesma mão.
export type Who =
  | "lucia"
  | "antonio"
  | "marcos"
  | "rose"
  | "marina"
  | "clara"
  | "helena"
  | "banco";

type Hair = "bun" | "sides" | "short" | "curly" | "long" | "bob" | "curlyShort";

type Look = {
  nome: string;
  bg: string;
  skin: string;
  hair: Hair;
  hairColor: string;
  cloth: string;
  glasses?: boolean;
  mustache?: boolean;
  earrings?: boolean;
  wrinkles?: boolean;
  necklace?: boolean;
};

export const LOOKS: Record<Exclude<Who, "banco">, Look> = {
  lucia: {
    nome: "Dona Lúcia",
    bg: "#5b4bb5",
    skin: "#e9bf9b",
    hair: "bun",
    hairColor: "#e5e7eb",
    cloth: "#f0abfc",
    glasses: true,
    earrings: true,
    wrinkles: true,
    necklace: true,
  },
  antonio: {
    nome: "Seu Antônio",
    bg: "#2f5878",
    skin: "#d9a67c",
    hair: "sides",
    hairColor: "#e5e7eb",
    cloth: "#4b8f7a",
    glasses: true,
    mustache: true,
    wrinkles: true,
  },
  marcos: {
    nome: "Marcos",
    bg: "#fef3c7",
    skin: "#c98e63",
    hair: "short",
    hairColor: "#2b2320",
    cloth: "#3b6fd8",
    mustache: false,
  },
  rose: {
    nome: "Rose",
    bg: "#ccfbf1",
    skin: "#8d5a3b",
    hair: "curly",
    hairColor: "#1c1412",
    cloth: "#14b8a6",
    earrings: true,
  },
  marina: {
    nome: "Marina",
    bg: "#ede9fe",
    skin: "#f0c8a3",
    hair: "long",
    hairColor: "#5a3a26",
    cloth: "#6d4fd8",
  },
  clara: {
    nome: "Clara",
    bg: "#9f3a5c",
    skin: "#e7bb98",
    hair: "curlyShort",
    hairColor: "#f1f5f9",
    cloth: "#7dd3c0",
    earrings: true,
    wrinkles: true,
    necklace: true,
  },
  helena: {
    nome: "Helena",
    bg: "#ffedd5",
    skin: "#d9a17a",
    hair: "bob",
    hairColor: "#3a2418",
    cloth: "#f08a3c",
  },
};

function HairBack({ hair, c }: { hair: Hair; c: string }) {
  switch (hair) {
    case "bun":
      return <circle cx="50" cy="17" r="10" fill={c} />;
    case "curly":
      return (
        <g fill={c}>
          <circle cx="33" cy="38" r="10" />
          <circle cx="36" cy="26" r="11" />
          <circle cx="50" cy="20" r="12" />
          <circle cx="64" cy="26" r="11" />
          <circle cx="67" cy="38" r="10" />
        </g>
      );
    case "long":
      return (
        <path
          d="M30 46 Q27 17 50 17 Q73 17 70 46 L73 82 Q50 88 27 82 Z"
          fill={c}
        />
      );
    case "bob":
      return (
        <path
          d="M30 48 Q27 18 50 18 Q73 18 70 48 L69 63 Q50 66 31 63 Z"
          fill={c}
        />
      );
    case "curlyShort":
      return (
        <g fill={c}>
          <circle cx="34" cy="36" r="8" />
          <circle cx="38" cy="26" r="9" />
          <circle cx="50" cy="22" r="10" />
          <circle cx="62" cy="26" r="9" />
          <circle cx="66" cy="36" r="8" />
        </g>
      );
    default:
      return null;
  }
}

function HairFront({ hair, c }: { hair: Hair; c: string }) {
  switch (hair) {
    case "bun":
      return (
        <path
          d="M32 43 Q30 22 50 23 Q70 22 68 43 Q64 31 50 31 Q36 31 32 43 Z"
          fill={c}
        />
      );
    case "sides":
      return (
        <g fill={c}>
          <path d="M33 46 Q30 34 36 30 L38 46 Z" />
          <path d="M67 46 Q70 34 64 30 L62 46 Z" />
        </g>
      );
    case "short":
      return (
        <path
          d="M32 43 Q29 20 50 21 Q71 20 68 43 Q66 31 50 30 Q34 31 32 43 Z"
          fill={c}
        />
      );
    case "curly":
      return (
        <path
          d="M33 40 Q36 27 50 27 Q64 27 67 40 Q60 33 50 33 Q40 33 33 40 Z"
          fill={c}
        />
      );
    case "long":
    case "bob":
      return (
        <path
          d="M32 44 Q35 25 50 25 Q65 25 68 44 Q62 33 50 33 Q40 33 32 44 Z"
          fill={c}
        />
      );
    case "curlyShort":
      return (
        <path
          d="M33 40 Q37 28 50 28 Q63 28 67 40 Q60 34 50 34 Q40 34 33 40 Z"
          fill={c}
        />
      );
  }
}

export function Avatar({
  who,
  size = 48,
  className = "",
  bg,
}: {
  who: Who;
  size?: number;
  className?: string;
  bg?: string;
}) {
  const id = useId();

  if (who === "banco") {
    return (
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={className}
        role="img"
        aria-label="Banco"
      >
        <circle cx="50" cy="50" r="50" fill={bg ?? "#e2e8f0"} />
        <path
          d="M50 20 L74 29 V50 Q74 68 50 80 Q26 68 26 50 V29 Z"
          fill="#475569"
        />
        <path
          d="M39 50 L47 58 L62 41"
          fill="none"
          stroke="#fff"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  const l = LOOKS[who];
  const shadow = "rgba(0,0,0,0.12)";
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={l.nome}
    >
      <defs>
        <clipPath id={id}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect width="100" height="100" fill={bg ?? l.bg} />
        <HairBack hair={l.hair} c={l.hairColor} />
        {/* corpo */}
        <path d="M10 104 Q12 74 38 70 L62 70 Q88 74 90 104 Z" fill={l.cloth} />
        {l.necklace && (
          <path
            d="M40 71 Q50 82 60 71"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
            strokeDasharray="0.1 3.6"
            strokeLinecap="round"
          />
        )}
        {/* pescoço */}
        <rect x="43" y="58" width="14" height="16" rx="5" fill={l.skin} />
        <path d="M43 66 Q50 72 57 66 V70 H43 Z" fill={shadow} />
        {/* cabeça e orelhas */}
        <ellipse cx="32.5" cy="46" rx="3.2" ry="5" fill={l.skin} />
        <ellipse cx="67.5" cy="46" rx="3.2" ry="5" fill={l.skin} />
        <ellipse cx="50" cy="44" rx="17" ry="20" fill={l.skin} />
        {l.earrings && (
          <g fill="#fbbf24">
            <circle cx="32.5" cy="52" r="1.8" />
            <circle cx="67.5" cy="52" r="1.8" />
          </g>
        )}
        <HairFront hair={l.hair} c={l.hairColor} />
        {/* rosto */}
        <g stroke="#2a1b14" strokeLinecap="round" fill="none">
          <path d="M39.5 40 Q43 38.4 46.5 40" strokeWidth="1.6" opacity="0.7" />
          <path d="M53.5 40 Q57 38.4 60.5 40" strokeWidth="1.6" opacity="0.7" />
        </g>
        <circle cx="43" cy="45" r="2" fill="#2a1b14" />
        <circle cx="57" cy="45" r="2" fill="#2a1b14" />
        <circle cx="43.7" cy="44.3" r="0.6" fill="#fff" />
        <circle cx="57.7" cy="44.3" r="0.6" fill="#fff" />
        <path
          d="M50 47 Q48.4 51.5 50.6 52"
          stroke={shadow}
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="38.5" cy="52" r="3.2" fill="#e8776f" opacity="0.22" />
        <circle cx="61.5" cy="52" r="3.2" fill="#e8776f" opacity="0.22" />
        {l.wrinkles && (
          <g
            stroke="#2a1b14"
            strokeWidth="0.9"
            opacity="0.28"
            strokeLinecap="round"
          >
            <path d="M36.5 44 L38.2 44.6 M36.5 46.5 L38.2 46" />
            <path d="M63.5 44 L61.8 44.6 M63.5 46.5 L61.8 46" />
          </g>
        )}
        {l.mustache && (
          <path
            d="M42 54 Q46 51.6 50 53.4 Q54 51.6 58 54 Q54 56.6 50 55.2 Q46 56.6 42 54 Z"
            fill={l.hairColor}
          />
        )}
        <path
          d="M44.5 56.5 Q50 61.5 55.5 56.5"
          stroke="#7a3a30"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        {l.glasses && (
          <g stroke="#3b2f2a" strokeWidth="1.6" fill="rgba(255,255,255,0.12)">
            <circle cx="43" cy="45" r="6" />
            <circle cx="57" cy="45" r="6" />
            <path d="M49 45 H51" fill="none" />
          </g>
        )}
      </g>
    </svg>
  );
}
