// Shared per-case background colors — used as a solid backdrop behind case
// cover images, since several covers are transparent-background product
// shots/logos. Falls back to a rotating pastel palette by position when a
// case has no override, and reused across the homepage parallax showcase and
// the /cases card grid so the same case always reads with the same color.
const PALETTE = ["#efe9fb", "#fdeaf3", "#e6f5f0"];

// Soft pastel tint of each brand's own hue — Vivo's purple, Sulamérica's
// navy — kept light enough for dark text on top (see PALETTE above).
const BY_SLUG: Record<string, string> = {
  "e-sim-vivo-empresas": "#efe4fb",
  "agendamento-online-sulamerica": "#e6eefc",
};

export function getCaseBgColor(slug: string, index: number): string {
  return BY_SLUG[slug] ?? PALETTE[index % PALETTE.length];
}
