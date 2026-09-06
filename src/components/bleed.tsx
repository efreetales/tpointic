export function Bleed({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative left-1/2 right-1/2 -mx-[50vw] w-screen ${className ?? ""}`}>
      {children}
    </div>
  );
}
