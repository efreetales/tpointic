import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ResumeButton } from "@/components/resume-button";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-theme flex min-h-full w-full flex-1 flex-col bg-bg text-navy">
      <Nav />
      <ResumeButton />
      {children}
      <Footer />
    </div>
  );
}
