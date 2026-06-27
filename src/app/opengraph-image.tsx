import { ImageResponse } from "next/og";

export const alt = "MovingPace — Affordable movers in Almere & Amsterdam";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const mark = `<svg viewBox="60 10 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="160" cy="110" r="85" fill="none" stroke="#f2f2f2" stroke-width="6"/>
  <path d="M111,146 L136,92 L166,110 L209,68" fill="none" stroke="#ff5468" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="111" cy="146" r="8" fill="none" stroke="#f2f2f2" stroke-width="5"/>
  <circle cx="209" cy="68" r="13" fill="#ff5468"/>
</svg>`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0a0a0b",
          padding: "80px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          width={120}
          height={120}
          src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(mark)}`}
          alt=""
        />
        <div style={{ display: "flex", marginTop: 40 }}>
          <span style={{ fontSize: 88, fontWeight: 700, color: "#f5f5f7" }}>
            Moving
          </span>
          <span style={{ fontSize: 88, fontWeight: 700, color: "#e11d2a" }}>
            Pace
          </span>
        </div>
        <div style={{ fontSize: 38, color: "#a1a1aa", marginTop: 12 }}>
          Affordable movers in Almere &amp; Amsterdam
        </div>
        <div style={{ fontSize: 26, color: "#71717a", marginTop: 28 }}>
          Moving made simple
        </div>
      </div>
    ),
    { ...size }
  );
}
