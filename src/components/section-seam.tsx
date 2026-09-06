// A subtle "seam" marking a section boundary on dark case pages: a thin
// gradient hairline plus a soft, low-opacity color glow. Meant to reinforce
// where one section ends and the next begins on long stretches of near-black
// background, without needing a full animated-gradient block. The parent
// section only needs `relative` — deliberately no `overflow-hidden` here,
// since some sections contain `position: sticky` children that overflow
// clipping on an ancestor would break.
export function SectionSeam({ color = "#66fcf1" }: { color?: string }) {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-56 w-[520px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ backgroundColor: color, opacity: 0.14 }}
      />
    </>
  );
}
