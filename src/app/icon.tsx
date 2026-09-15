import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 1581 1581" fill="none">
          <path
            d="M1481 0C1536.23 0 1581 44.7715 1581 100V1527C1581 1582.23 1536.23 1627 1481 1627H100C44.7715 1627 0 1582.23 0 1527V100C4.1233e-06 44.7715 44.7715 0 100 0H1481ZM273.161 371.245V654.856H443.229V1209.75H726.84V654.856H896.908L896.907 371.245H273.161ZM969.338 371.246V654.856H1073.25V727.52H799.538L799.539 1011.13L1307.84 1011.13V371.245L969.338 371.246Z"
            fill="#000000"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
