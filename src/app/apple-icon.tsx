import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2d3142",
        }}
      >
        <svg width="112" height="112" viewBox="0 0 1581 1581" fill="none">
          <path
            d="M1481 0C1536.23 0 1581 44.7715 1581 100V1527C1581 1582.23 1536.23 1627 1481 1627H100C44.7715 1627 0 1582.23 0 1527V100C4.1233e-06 44.7715 44.7715 0 100 0H1481ZM283.161 371.245V654.856H453.229V1209.75H736.84V654.856H906.908L906.907 371.245H283.161ZM959.338 371.245V654.856H1063.25V707.52H789.538L789.539 991.131L1297.84 991.13V371.245H959.338Z"
            fill="#ef8354"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
