import type { Metadata } from "next";
import { getCases } from "@/lib/cases";
import { CasesParallaxHero } from "@/components/cases-parallax-hero";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Cases — ${SITE_NAME}`,
  description: "Portfólio de cases de Service Design, UX Research e UX Design de Tales Pereira.",
};

export default async function CasesPage() {
  const cases = await getCases();

  return (
    <main className="flex-1">
      <CasesParallaxHero cases={cases} />
    </main>
  );
}
