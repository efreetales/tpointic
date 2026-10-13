import localFont from "next/font/local";

// Itaú Text (Itaú + Dalton Maag) e Nu Sans (Blackletra) são fontes
// proprietárias, então os protótipos usam parentes livres (OFL) dos mesmos
// desenhos: Figtree para o Itaú (geométrica amigável, x-height alta, espaçamento
// aberto) e Public Sans para o Nubank (grotesca neutra, na linha da Graphik).
export const itauSans = localFont({
  variable: "--font-ad-itau",
  src: "../../app/fonts-ad/figtree-latin-wght-normal.woff2",
  weight: "300 900",
  display: "swap",
});

export const nubankSans = localFont({
  variable: "--font-ad-nubank",
  src: "../../app/fonts-ad/public-sans-latin-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
});
