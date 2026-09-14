"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "@mynaui/icons-react";
import { Logo } from "@/components/logo";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/sobre", label: "Sobre" },
  { href: "/servicos", label: "Serviços" },
  { href: "/cases", label: "Cases" },
  { href: "/lideranca", label: "Liderança" },
  { href: "/treinamentos", label: "Treinamentos" },
  { href: "/contato", label: "Contato" },
];

// Páginas com hero full-bleed (vídeo de fundo, sem card/moldura) em vez do
// fundo escuro padrão do site — o header precisa nascer transparente/claro
// sobre elas e virar sólido normal assim que o usuário rola além do hero.
const TRANSPARENT_HERO_PATHS = ["/", "/cases", "/sobre"];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // EXPERIMENTAL — as páginas acima têm um vídeo full-bleed como fundo do
  // hero e o header precisa parecer "dentro" dele — não uma faixa colada em
  // cima. Header continua `sticky` normalmente (não muda o mecanismo de
  // posicionamento — só fica transparente aqui), e é a PRÓPRIA seção do
  // hero que sobe por trás dele via margin-top negativo (ver `--nav-h`
  // abaixo), então o vídeo realmente ocupa a área do header em vez de só
  // imitar a cor. As demais páginas nunca tiveram hero full-bleed, então
  // mantêm o header sempre sólido, sem esse toggle nem a variável de altura.
  const hasTransparentHero = TRANSPARENT_HERO_PATHS.includes(pathname);
  const [pastHero, setPastHero] = useState(!hasTransparentHero);

  useEffect(() => {
    if (!hasTransparentHero) {
      setPastHero(true);
      return;
    }

    // Páginas com hero de altura variável (ex.: /cases, que agora é uma
    // trilha pinada com vários viewports de scroll — ver
    // `cases-parallax-hero.tsx`) publicam um marcador `#hero-sentinel` bem
    // no fim da trilha. Quando ele existe, usamos IntersectionObserver nele
    // em vez da heurística de 85% de UM viewport (que só faz sentido pra
    // hero de altura fixa, como o da home).
    const sentinel = document.getElementById("hero-sentinel");
    if (sentinel) {
      setPastHero(false);
      const io = new IntersectionObserver(([entry]) => setPastHero(entry.isIntersecting), {
        threshold: 0,
      });
      io.observe(sentinel);
      return () => io.disconnect();
    }

    function onScroll() {
      setPastHero(window.scrollY > window.innerHeight * 0.85);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasTransparentHero, pathname]);

  // Publica a altura real do header numa CSS var — a seção do hero (em
  // page.tsx, um componente separado) lê `--nav-h` pra saber exatamente
  // quanto subir por trás dele, sem os dois lados precisarem concordar um
  // valor fixo hardcoded (a altura muda entre mobile/desktop).
  useEffect(() => {
    if (!hasTransparentHero || !headerRef.current) return;
    const el = headerRef.current;
    const update = () => {
      document.documentElement.style.setProperty("--nav-h", `${el.offsetHeight}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [hasTransparentHero]);

  const transparentHero = hasTransparentHero && !pastHero;

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 border-b transition-colors ${
        transparentHero ? "border-transparent bg-transparent" : "border-border bg-bg/80 backdrop-blur"
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className={`flex items-center gap-2 ${transparentHero ? "text-[#1a1a1a]" : "text-navy"}`}
        >
          <Logo className={`h-8 w-8 ${transparentHero ? "text-[#1a1a1a]" : "text-coral"}`} />
          <span className="flex flex-col leading-tight">
            <span className="text-base font-black">TALES PEREIRA</span>
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${
                transparentHero ? "text-[#4a4a4a]" : "text-slate"
              }`}
            >
              UX Leader
            </span>
          </span>
        </Link>

        <ul
          className={`hidden items-center gap-x-7 text-sm font-bold sm:flex ${
            transparentHero ? "text-[#4a4a4a]" : "text-slate"
          }`}
        >
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative py-1 transition-colors ${
                    transparentHero
                      ? `hover:text-[#058fa1] ${active ? "text-[#058fa1]" : ""}`
                      : `hover:text-coral ${active ? "text-coral" : ""}`
                  }`}
                >
                  {link.label}
                  {active && (
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 w-full rounded-full ${
                        transparentHero ? "bg-[#058fa1]" : "bg-coral"
                      }`}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
          className={`sm:hidden ${transparentHero ? "text-[#1a1a1a]" : "text-navy"}`}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {open && (
        <ul
          className={`flex flex-col gap-1 border-t px-6 py-4 text-sm font-bold sm:hidden ${
            transparentHero ? "border-[#1a1a1a]/15 text-[#4a4a4a]" : "border-border text-slate"
          }`}
        >
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-2 py-2 transition-colors hover:bg-surface ${
                  transparentHero
                    ? `hover:text-[#058fa1] ${pathname === link.href ? "text-[#058fa1]" : ""}`
                    : `hover:text-coral ${pathname === link.href ? "text-coral" : ""}`
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
