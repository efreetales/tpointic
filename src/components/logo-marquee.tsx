import Image from "next/image";
import Link from "next/link";

export type ClientLogo = {
  name: string;
  src: string;
  href?: string;
};

// Logos originalmente hospedados em talespereira.com/wp-content/uploads —
// quebraram quando esse domínio passou a apontar pro próprio site novo (não
// existe mais WordPress ali pra servir o arquivo). Recuperados do backup
// `.wpress` e re-hospedados no Supabase Storage (bucket `site`, prefixo
// `clientes/`). `href` só definido quando existe um case correspondente no
// portfólio; logos sem case ainda ganham o hover cinza-pra-cor mas não são
// clicáveis.
const LOGOS_BASE = "https://drjbumieuwuzsjlpqwxg.supabase.co/storage/v1/object/public/site/clientes";

export const CLIENT_LOGOS: ClientLogo[] = [
  {
    name: "Mercado Livre",
    src: `${LOGOS_BASE}/mercado-livre-logo-8-1.png`,
    href: "/cases/lideranca-mercado-livre",
  },
  {
    name: "Vivo",
    src: `${LOGOS_BASE}/Logo_VIVO.svg.png`,
    href: "/cases/e-sim-vivo-empresas",
  },
  {
    name: "Carrefour",
    src: `${LOGOS_BASE}/carrefour-logo-1.png`,
    href: "/cases/postos-carrefour",
  },
  {
    name: "SulAmérica",
    src: `${LOGOS_BASE}/sulamerica-logo.png`,
    href: "/cases/agendamento-online-sulamerica",
  },
  {
    name: "UOL",
    src: `${LOGOS_BASE}/UOL_logo_old.png`,
    href: "/cases/uol-musica-deezer",
  },
  {
    name: "CI&T",
    src: `${LOGOS_BASE}/CINT_BIG-ac0f5a83.png`,
  },
  {
    name: "Dasa",
    src: `${LOGOS_BASE}/LogoDasa.png`,
  },
  {
    name: "RD/Drogasil",
    src: `${LOGOS_BASE}/rd-drogasil-s-a-logo-8BD95D26EC-seeklogo.com_.png`,
  },
  {
    name: "Rakuten",
    src: `${LOGOS_BASE}/Rakuten-Logo-2.png`,
  },
  {
    name: "Casas Bahia",
    src: `${LOGOS_BASE}/casas-bahia-logo-02-scaled.avif`,
  },
  {
    name: "Cofco",
    src: `${LOGOS_BASE}/Cofco-Intl-logo.png`,
  },
  {
    name: "Mercado Pago",
    src: `${LOGOS_BASE}/mercado-pago-logo.png`,
  },
];

// Fixed bounding box (not just a fixed height) so every logo reads at the
// same visual weight regardless of its native aspect ratio — a wide
// wordmark like Casas Bahia would otherwise render far larger than a
// square/icon logo when only height was constrained.
function LogoItem({ logo }: { logo: ClientLogo }) {
  const image = (
    <Image
      src={logo.src}
      alt={logo.name}
      width={160}
      height={64}
      className="max-h-full max-w-full object-contain grayscale opacity-60 transition-all duration-300 group-hover/logo:grayscale-0 group-hover/logo:opacity-100"
    />
  );

  const box = (
    <div className="flex h-8 w-[110px] items-center justify-center sm:h-10 sm:w-[130px]">
      {image}
    </div>
  );

  if (logo.href) {
    return (
      <Link
        href={logo.href}
        aria-label={`Ver case: ${logo.name}`}
        className="group/logo flex shrink-0 items-center px-6"
      >
        {box}
      </Link>
    );
  }

  return <div className="group/logo flex shrink-0 items-center px-6">{box}</div>;
}

export function LogoMarquee({ logos = CLIENT_LOGOS }: { logos?: ClientLogo[] }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div className="logo-marquee-track flex w-max items-center">
        {[...logos, ...logos].map((logo, i) => (
          <LogoItem key={`${logo.name}-${i}`} logo={logo} />
        ))}
      </div>
    </div>
  );
}
