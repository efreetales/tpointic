export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M100 100H0V0H100V100ZM34.25 40.25V74.75H43.25V40.25H34.25ZM66.75 25.25V34.25H72.25V52.25H50.25V61.25H81.25V25.25H66.75ZM18.75 25.25V34.25H59.75V25.25H18.75Z"
        fill="currentColor"
      />
    </svg>
  );
}
