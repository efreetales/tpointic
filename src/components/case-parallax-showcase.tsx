import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@mynaui/icons-react";
import type { Case } from "@/lib/cases";

// Same sticky-stack parallax pattern used inside case pages for the impact
// gallery (`case-body.tsx`) — each panel covers the previous one while
// scrolling. Reused here on the homepage to showcase 3 cases with more
// impact than a plain card grid. No `overflow-hidden` on any ancestor: the
// children rely on `position: sticky`, which breaks under non-visible
// overflow on a parent (documented in the tpointic-wow-case skill).
const PANEL_BG = ["#0a0a0a", "#12102a", "#0a1f1d"];

export function CaseParallaxShowcase({ cases }: { cases: Case[] }) {
  return (
    <div className="relative">
      {cases.map((c, i) => {
        return (
          <div
            key={c.id}
            className="sticky top-0 flex h-screen w-full flex-col lg:flex-row"
            style={{ backgroundColor: PANEL_BG[i % PANEL_BG.length] }}
          >
            <div className="flex flex-1 flex-col justify-center px-6 py-10 lg:w-[38%] lg:flex-none lg:px-16">
              {c.cliente && (
                <p className="text-xs font-bold uppercase tracking-widest text-coral">
                  {c.cliente}
                </p>
              )}
              <h3 className="mt-3 max-w-lg text-3xl font-black leading-tight text-white sm:text-5xl">
                {c.titulo}
              </h3>
              {c.resumo && (
                <p className="mt-4 max-w-md text-white/75">{c.resumo}</p>
              )}
              <Link
                href={`/cases/${c.slug}`}
                className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
              >
                Ver case completo
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>

            <div className="relative flex-1 lg:w-[62%] lg:flex-none">
              {c.capa_url && (
                <Image
                  src={c.capa_url}
                  alt={c.titulo}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 62vw, 100vw"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
