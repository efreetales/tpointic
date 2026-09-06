import Image from "next/image";

type Screen = { src: string; alt: string };

const COLUMN_COUNT = 3;
const MIN_ITEMS_PER_COLUMN = 5;
const COLUMN_DURATIONS = [38, 46, 32];

export function ScreenMarquee({ screens }: { screens: Screen[] }) {
  const columns: Screen[][] = Array.from({ length: COLUMN_COUNT }, () => []);
  screens.forEach((s, i) => columns[i % COLUMN_COUNT].push(s));

  return (
    <div
      className="relative h-[720px] overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <div className="flex h-full items-center justify-center gap-5">
        {columns.map((col, i) => {
          // Pad short columns by cycling so one loop unit always comfortably
          // exceeds the container height — otherwise the animation shows a
          // blank gap before the next copy scrolls into view.
          const unit: Screen[] = [];
          for (let j = 0; unit.length < MIN_ITEMS_PER_COLUMN; j++) {
            unit.push(col[j % col.length]);
          }

          return (
            <div
              key={i}
              className="marquee-col flex w-[220px] shrink-0 flex-col gap-5 sm:w-[260px]"
              style={{
                animation: `${i % 2 === 0 ? "marquee-up" : "marquee-down"} ${COLUMN_DURATIONS[i % COLUMN_DURATIONS.length]}s linear infinite`,
              }}
            >
              {[...unit, ...unit].map((s, j) => (
                <div
                  key={j}
                  className="overflow-hidden rounded-[1.75rem] border border-border shadow-2xl"
                >
                  <Image
                    src={s.src}
                    alt={s.alt}
                    width={800}
                    height={1732}
                    quality={95}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
