import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CycleRun — Free Indoor Training with Your Webcam";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0b 0%, #1a1a1d 50%, #0a0a0b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(ellipse at 50% 30%, rgba(249,115,22,0.12) 0%, transparent 70%)",
          }}
        />
        <div style={{ display: "flex", alignItems: "baseline", marginBottom: 24 }}>
          <span style={{ fontSize: 48, fontWeight: 800, color: "#fafaf9", letterSpacing: "-0.03em" }}>cyclerun</span>
          <span style={{ fontSize: 48, fontWeight: 800, color: "#f97316", letterSpacing: "-0.03em" }}>.app</span>
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#fafaf9", marginBottom: 12, textAlign: "center", maxWidth: 800 }}>
          Free Indoor Training with Your Webcam
        </div>
        <div style={{ fontSize: 18, color: "#a3a3a3", textAlign: "center", maxWidth: 600, lineHeight: 1.5 }}>
          The free Zwift alternative. Use your webcam instead of expensive sensors for spinning, ergometer &amp; treadmill.
        </div>
        <div
          style={{
            display: "flex",
            gap: 32,
            marginTop: 40,
            fontSize: 14,
            color: "#737373",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          <span>No Smart Trainer</span>
          <span>·</span>
          <span>No Subscription</span>
          <span>·</span>
          <span>100% Free</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
