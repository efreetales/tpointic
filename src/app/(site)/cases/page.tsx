import type { Metadata } from "next";
import { getCases } from "@/lib/cases";
import { CasesOrbitHero } from "@/components/cases-orbit-hero";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Cases — ${SITE_NAME}`,
  description: "Portfólio de cases de Service Design, UX Research e UX Design de Tales Pereira.",
};

export default async function CasesPage() {
  const cases = await getCases();

  return (
    <main className="flex-1">
      <CasesOrbitHero cases={cases} />
    </main>
  );
}
