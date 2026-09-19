import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ResumeButton } from "@/components/resume-button";
import { SmoothScroll } from "@/components/smooth-scroll";
import { LikeStamper } from "@/components/like-stamper";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <div className="site-theme flex min-h-full w-full flex-1 flex-col bg-bg text-navy">
        <Nav />
        <ResumeButton />
        <LikeStamper />
        {children}
        <Footer />
      </div>
    </SmoothScroll>
  );
}
