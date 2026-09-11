import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { SITE_NAME } from "@/lib/site";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: `${SITE_NAME} — Tales Pereira`,
  description:
    "Portfólio de Design e Masterclass de Design Thinking com Tales Pereira.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
