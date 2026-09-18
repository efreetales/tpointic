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
  "uol-musica-deezer": "#6a2238",
};

export function getCaseBgColor(slug: string, index: number): string {
  return BY_SLUG[slug] ?? PALETTE[index % PALETTE.length];
}

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

// Deriva a cor do flare direto do bg do painel (mesmo matiz, saturação e
// luminosidade elevadas) em vez de manter um mapa separado por slug — antes
// (`PANEL_FLARE_BY_SLUG` em case-parallax-showcase.tsx) trocar a cor de
// fundo de um case deixava o flare "órfão" com a cor antiga, já que os dois
// mapas viviam desincronizados. Agora o flare sempre acompanha o bg.
export function getCaseFlareColor(bgColor: string): string {
  const [h, s] = hexToHsl(bgColor);
  return `hsl(${h}, ${Math.max(s, 60)}%, 65%)`;
}
