import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Icon-only mark in light colors (sits on a dark rounded background).
const mark = `<svg viewBox="60 10 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="160" cy="110" r="85" fill="none" stroke="#f2f2f2" stroke-width="6"/>
  <path d="M111,146 L136,92 L166,110 L209,68" fill="none" stroke="#ff5468" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="111" cy="146" r="8" fill="none" stroke="#f2f2f2" stroke-width="5"/>
  <circle cx="209" cy="68" r="13" fill="#ff5468"/>
</svg>`;

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
          background: "#0a0a0b",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          width={140}
          height={140}
          src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(mark)}`}
          alt="MovingPace"
        />
      </div>
    ),
    { ...size }
  );
}
