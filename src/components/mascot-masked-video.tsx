// A video clipped into the shape of the Vivo/Claro "flower" mascot mark
// (`public/mascot-mask.svg`) via CSS `mask-image` — the standard technique
// for "SVG shape as an image mask": the browser renders the referenced SVG
// like an image and uses its alpha as the mask, so `mask-size: contain`
// scales it to fit while keeping the mascot's own aspect ratio (663:912).
// The wrapper needs `aspect-[663/912]` matching that ratio, or the mask
// would center inside a box shaped differently than the shape itself and
// read as oddly cropped.
export function MascotMaskedVideo({ videoUrl, className = "" }: { videoUrl: string; className?: string }) {
  return (
    <div
      className={`aspect-[663/912] shrink-0 ${className}`}
      style={{
        WebkitMaskImage: "url(/mascot-mask.svg)",
        maskImage: "url(/mascot-mask.svg)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    >
      <video
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
      />
    </div>
  );
}
