import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A página interna da masterclass foi removida — ela vive em
  // tpoint.manus.space. Redirect temporário (não permanente) pra links
  // antigos (LinkedIn, e-mails de matrícula...) continuarem funcionando, e
  // pra poder reverter sem ficar com 301 em cache no navegador.
  async redirects() {
    return [
      {
        source: "/treinamentos/design-thinking-5-fundamentos/:path*",
        destination: "https://tpoint.manus.space/",
        permanent: false,
      },
    ];
  },
  images: {
    qualities: [75, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drjbumieuwuzsjlpqwxg.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "talespereira.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
