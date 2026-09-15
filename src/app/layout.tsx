import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SITE_NAME } from "@/lib/site";
import "./globals.css";

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

export const metadata: Metadata = {
  title: `${SITE_NAME} — Tales Pereira`,
  description:
    "Portfólio de Design e Masterclass de Design Thinking com Tales Pereira.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
