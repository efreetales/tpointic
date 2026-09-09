// Shared per-case background colors — used as a solid backdrop behind case
// cover images, since several covers are transparent-background product
// shots/logos. Falls back to a rotating dark palette by position when a case
// has no override, and reused across the homepage parallax showcase and the
// /cases card grid so the same case always reads with the same color.
const PALETTE = ["#0a0a0a", "#12102a", "#0a1f1d"];

// Picked from each brand's own darker/navy tones — bright brand colors
// (Vivo's magenta, Sulamérica's CTA orange) fail contrast with white text.
const BY_SLUG: Record<string, string> = {
  "e-sim-vivo-empresas": "#3a1160",
  "agendamento-online-sulamerica": "#1B3A63",
};

export function getCaseBgColor(slug: string, index: number): string {
  return BY_SLUG[slug] ?? PALETTE[index % PALETTE.length];
}
