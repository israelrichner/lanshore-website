import { ImageResponse } from "next/og";

export const alt = "AI Assisted SPM by Lanshore: AI Agents for Sales Performance Management";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #001e2d 0%, #003e50 60%, #135a76 100%)",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              background: "#C9A84C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#001e2d",
              fontSize: 44,
              fontWeight: 800,
            }}
          >
            L
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: 2 }}>LANSHORE</div>
        </div>
        <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.1, maxWidth: 950 }}>
          AI Assisted SPM by Lanshore
        </div>
        <div
          style={{
            fontSize: 32,
            marginTop: 28,
            color: "#E2C87A",
            display: "flex",
          }}
        >
          Executive Dashboards · SPM Operations · Custom Apps
        </div>
        <div style={{ fontSize: 24, marginTop: 28, color: "rgba(255,255,255,0.75)" }}>
          15+ years of sales performance management, converged with agentic AI
        </div>
      </div>
    ),
    { ...size }
  );
}
