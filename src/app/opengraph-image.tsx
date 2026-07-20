import { ImageResponse } from "next/og";

export const alt = "MovingPace — Affordable movers in Almere & Amsterdam";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const mark = `<svg viewBox="0 0 260 140" xmlns="http://www.w3.org/2000/svg">
  <g fill="#f5a800">
    <polygon points="0,50 60,44 60,58 10,58"/>
    <polygon points="16,72 60,66 60,80 24,80"/>
    <polygon points="6,94 60,88 60,102 14,102"/>
  </g>
  <rect x="66" y="30" width="94" height="72" rx="9" fill="#f5f6fa"/>
  <path d="M166 102 V50 h30 q7 0 10.5 6 l14 25 q2.5 4.5 2.5 9 v7 a5 5 0 0 1 -5 5 z" fill="#f5f6fa"/>
  <path d="M173 58 h20 q4 0 6 3.5 l8.5 15.5 h-34.5 z" fill="#0a1128"/>
  <circle cx="100" cy="106" r="14" fill="#f5f6fa"/>
  <circle cx="100" cy="106" r="6.5" fill="#0a1128"/>
  <circle cx="188" cy="106" r="14" fill="#f5f6fa"/>
  <circle cx="188" cy="106" r="6.5" fill="#0a1128"/>
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
          background: "#0a1128",
          padding: "80px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          width={220}
          height={118}
          src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(mark)}`}
          alt=""
        />
        <div style={{ display: "flex", marginTop: 36 }}>
          <span style={{ fontSize: 88, fontWeight: 700, color: "#f5f6fa" }}>
            Moving
          </span>
          <span style={{ fontSize: 88, fontWeight: 700, color: "#f5a800" }}>
            Pace
          </span>
        </div>
        <div style={{ fontSize: 38, color: "#a3aec9", marginTop: 12 }}>
          Affordable movers in Almere &amp; Amsterdam
        </div>
        <div style={{ fontSize: 26, color: "#6b7794", marginTop: 28 }}>
          Moving made simple
        </div>
      </div>
    ),
    { ...size }
  );
}
