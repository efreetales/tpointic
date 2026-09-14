import { useId } from "react";

// The path's own outer boundary is drawn to a 1627-tall corner (a leftover
// from the mark's previous proportions) but the artwork's real canvas is
// the 1581×1581 square below — the clipPath is what actually rounds off
// that bottom edge at the right height instead of leaving it square.
export function Logo({ className }: { className?: string }) {
  const clipId = useId();
  return (
    <svg
      viewBox="0 0 1581 1581"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M1481 0C1536.23 0 1581 44.7715 1581 100V1527C1581 1582.23 1536.23 1627 1481 1627H100C44.7715 1627 0 1582.23 0 1527V100C4.1233e-06 44.7715 44.7715 0 100 0H1481ZM273.161 371.245V654.856H443.229V1209.75H726.84V654.856H896.908L896.907 371.245H273.161ZM969.338 371.246V654.856H1073.25V727.52H799.538L799.539 1011.13L1307.84 1011.13V371.245L969.338 371.246Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="1581" height="1581" rx="100" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
