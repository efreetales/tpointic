import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { SITE_NAME } from "@/lib/site";
import { VercelAnalytics } from "@/components/vercel-analytics";
import "./globals.css";

// Microsoft Clarity — gravação de sessão, mapa de calor de cliques/scroll.
// `afterInteractive` (padrão recomendado do Next pra scripts de analytics
// de terceiros) carrega depois da hidratação, sem bloquear o first paint.
const CLARITY_PROJECT_ID = "ykf9ibhkma";

// Self-hosted instead of next/font/google — the build-time fetch to
// fonts.googleapis.com is unreliable in sandboxed/offline dev environments
// and silently falls back to a system font with no build error.
const nunito = localFont({
  variable: "--font-nunito",
  src: [
    { path: "./fonts/nunito-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/nunito-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/nunito-800.woff2", weight: "800", style: "normal" },
    { path: "./fonts/nunito-900.woff2", weight: "900", style: "normal" },
  ],
});

// Sem isso, redes sociais que puxam preview do link (LinkedIn, WhatsApp...)
// não achavam og:image nenhuma e tentavam adivinhar uma imagem da própria
// página — acabavam pegando qualquer coisa, inclusive logo de cliente de
// algum case. `metadataBase` resolve a URL relativa da imagem pro domínio
// de produção (sem ele o Next usa localhost em dev, quebrando o preview).
const OG_IMAGE_URL =
  "https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/og-image.png";

export const metadata: Metadata = {
  metadataBase: new URL("https://talespereira.com"),
  title: `${SITE_NAME} — Tales Pereira`,
  description:
    "Portfólio de Design e Masterclass de Design Thinking com Tales Pereira.",
  openGraph: {
    title: `${SITE_NAME} — Tales Pereira`,
    description:
      "Portfólio de Design e Masterclass de Design Thinking com Tales Pereira.",
    url: "https://talespereira.com",
    siteName: SITE_NAME,
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630 }],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Tales Pereira`,
    description:
      "Portfólio de Design e Masterclass de Design Thinking com Tales Pereira.",
    images: [OG_IMAGE_URL],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <VercelAnalytics />
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");`}
        </Script>
      </body>
    </html>
  );
}
