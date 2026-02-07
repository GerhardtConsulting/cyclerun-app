"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PairingReceiver, pollState, type TVState } from "@/lib/phone-pairing";

const WIZARD_LABELS: Record<number, string> = {
  0: "Camera Setup",
  1: "Camera Preview",
  2: "Sport Selection",
  3: "Zone Setup",
  4: "Calibration",
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TVPage() {
  const [pairCode, setPairCode] = useState("");
  const [phase, setPhase] = useState<"qr" | "connecting" | "wizard" | "riding" | "finished">("qr");
  const [tvState, setTvState] = useState<TVState | null>(null);
  const [streamActive, setStreamActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const receiverRef = useRef<PairingReceiver | null>(null);
  const statePollerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startReceiver = useCallback(() => {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setPairCode(code);

    receiverRef.current?.destroy();
    const receiver = new PairingReceiver(code);
    receiverRef.current = receiver;

    receiver.onStatusChange = (s) => {
      if (s === "phone-joined" || s === "connecting") {
        setPhase("connecting");
      } else if (s === "connected") {
        setPhase("wizard");
        // Start polling state
        if (statePollerRef.current) clearInterval(statePollerRef.current);
        statePollerRef.current = setInterval(async () => {
          const st = await pollState(code);
          if (st) {
            setTvState(st);
            if (st.phase === "riding") setPhase("riding");
            else if (st.phase === "finished") setPhase("finished");
            else if (st.phase === "wizard") setPhase("wizard");
          }
        }, 500);
      }
    };

    receiver.onRemoteStream = (stream) => {
      streamRef.current = stream;
      setStreamActive(true);
    };

    receiver.start();
  }, []);

  useEffect(() => {
    startReceiver();
    return () => {
      receiverRef.current?.destroy();
      if (statePollerRef.current) clearInterval(statePollerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate QR code
  useEffect(() => {
    if (!pairCode) return;
    const pairUrl = `https://cyclerun.app?tv=${pairCode}`;
    import("qrcode").then((QRCode) => {
      const canvas = document.createElement("canvas");
      QRCode.toCanvas(canvas, pairUrl, {
        width: 320,
        margin: 2,
        color: { dark: "#ffffff", light: "#00000000" },
      }).then(() => {
        const container = document.getElementById("tv-qr");
        if (container) {
          container.innerHTML = "";
          container.appendChild(canvas);
        }
      });
    });
  }, [pairCode]);

  // ---- QR Screen ----
  if (phase === "qr") {
    return (
      <div style={{
        width: "100vw", height: "100vh", background: "#0a0a0a",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'Inter', system-ui, sans-serif", color: "#fff",
      }}>
        <div style={{ fontSize: "1.2rem", fontWeight: 600, letterSpacing: 2, color: "#f59e0b", marginBottom: "1rem", textTransform: "uppercase" }}>
          CycleRun
        </div>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, margin: "0 0 0.5rem", textAlign: "center" }}>
          TV Mode
        </h1>
        <p style={{ color: "#888", fontSize: "1.1rem", marginBottom: "2rem" }}>
          Scan with your phone to connect
        </p>
        <div id="tv-qr" style={{
          background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: "1.5rem",
          border: "1px solid rgba(255,255,255,0.1)", marginBottom: "1.5rem",
        }} />
        <div style={{
          fontSize: "3rem", fontWeight: 900, letterSpacing: "0.5em",
          fontFamily: "monospace", color: "#f59e0b", marginBottom: "1rem",
        }}>
          {pairCode.split("").join(" ")}
        </div>
        <p style={{ color: "#666", fontSize: "0.9rem" }}>
          Or visit <strong style={{ color: "#f59e0b" }}>cyclerun.app</strong> and enter this code
        </p>
      </div>
    );
  }

  // ---- Connecting Screen ----
  if (phase === "connecting") {
    return (
      <div style={{
        width: "100vw", height: "100vh", background: "#0a0a0a",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'Inter', system-ui, sans-serif", color: "#fff",
      }}>
        <div style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
          Phone detected!
        </div>
        <p style={{ color: "#888", fontSize: "1.2rem" }}>Establishing connection...</p>
        <div style={{
          width: 60, height: 60, border: "4px solid #333", borderTopColor: "#f59e0b",
          borderRadius: "50%", marginTop: "2rem",
          animation: "spin 1s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ---- Wizard Screen ----
  if (phase === "wizard") {
    const step = tvState?.wizardStep ?? 0;
    const stepLabel = WIZARD_LABELS[step] || `Step ${step}`;
    return (
      <div style={{
        width: "100vw", height: "100vh", background: "#0a0a0a",
        display: "flex", flexDirection: "column",
        fontFamily: "'Inter', system-ui, sans-serif", color: "#fff",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.5rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "1rem", fontWeight: 600, color: "#f59e0b", letterSpacing: 2, textTransform: "uppercase" }}>CycleRun</span>
            <span style={{ fontSize: "0.85rem", background: "#22c55e22", color: "#22c55e", padding: "0.25rem 0.75rem", borderRadius: 20, fontWeight: 600 }}>
              Phone Connected
            </span>
          </div>
          <div style={{ fontSize: "1rem", color: "#888" }}>
            Setup: <strong style={{ color: "#fff" }}>{stepLabel}</strong>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: "#1a1a1a" }}>
          <div style={{ height: "100%", background: "#f59e0b", width: `${Math.max(step, 1) * 25}%`, transition: "width 0.3s" }} />
        </div>

        {/* Main content — camera feed */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          {streamActive ? (
            <div style={{ position: "relative", maxWidth: "80%", maxHeight: "80%" }}>
              <video
                ref={(el) => {
                  videoRef.current = el;
                  if (el && streamRef.current && el.srcObject !== streamRef.current) {
                    el.srcObject = streamRef.current;
                    el.play().catch(() => {});
                  }
                }}
                autoPlay muted playsInline
                style={{ width: "100%", maxHeight: "70vh", borderRadius: 16, background: "#000", objectFit: "contain" }}
              />
              <div style={{
                position: "absolute", bottom: 16, left: 16,
                background: "rgba(0,0,0,0.7)", padding: "0.5rem 1rem", borderRadius: 8,
                fontSize: "0.9rem", color: "#ccc",
              }}>
                Phone Camera — {stepLabel}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "#666" }}>
              <p style={{ fontSize: "1.5rem" }}>Waiting for camera stream...</p>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div style={{
          padding: "1rem 2rem", borderTop: "1px solid rgba(255,255,255,0.08)",
          textAlign: "center", color: "#666", fontSize: "0.9rem",
        }}>
          Complete the setup on your phone. This screen will mirror your progress.
        </div>
      </div>
    );
  }

  // ---- Riding Screen ----
  if (phase === "riding" || phase === "finished") {
    const speed = tvState?.speed ?? 0;
    const rpm = tvState?.rpm ?? 0;
    const distance = tvState?.distance ?? 0;
    const rideTime = tvState?.rideTime ?? 0;
    const gear = tvState?.gear ?? 2;
    const maxSpeed = tvState?.maxSpeed ?? 0;

    return (
      <div style={{
        width: "100vw", height: "100vh", background: "#0a0a0a",
        display: "flex", flexDirection: "column",
        fontFamily: "'Inter', system-ui, sans-serif", color: "#fff",
      }}>
        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <span style={{ fontSize: "1rem", fontWeight: 600, color: "#f59e0b", letterSpacing: 2, textTransform: "uppercase" }}>CycleRun</span>
          <span style={{ fontSize: "1rem", color: phase === "finished" ? "#f59e0b" : "#22c55e", fontWeight: 600 }}>
            {phase === "finished" ? "Ride Complete!" : formatTime(rideTime)}
          </span>
        </div>

        {/* Main stats grid */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: "rgba(255,255,255,0.04)" }}>
          {/* Speed — big central stat */}
          <div style={{
            gridColumn: "1 / 3", gridRow: "1 / 2",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            background: "#0a0a0a", padding: "2rem",
          }}>
            <div style={{ fontSize: "0.9rem", color: "#888", textTransform: "uppercase", letterSpacing: 2, marginBottom: "0.5rem" }}>Speed</div>
            <div style={{ fontSize: "8rem", fontWeight: 900, lineHeight: 1, fontFamily: "monospace", color: speed > 0 ? "#fff" : "#333" }}>
              {speed.toFixed(1)}
            </div>
            <div style={{ fontSize: "1.2rem", color: "#666", marginTop: "0.5rem" }}>km/h</div>
          </div>

          {/* Camera minimap */}
          <div style={{
            gridColumn: "3 / 4", gridRow: "1 / 2",
            background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem",
          }}>
            {streamActive ? (
              <video
                ref={(el) => {
                  if (el && streamRef.current && el.srcObject !== streamRef.current) {
                    el.srcObject = streamRef.current;
                    el.play().catch(() => {});
                  }
                }}
                autoPlay muted playsInline
                style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 12, background: "#000" }}
              />
            ) : (
              <div style={{ color: "#444", textAlign: "center" }}>No camera</div>
            )}
          </div>

          {/* Bottom stats row */}
          <StatBox label="RPM" value={rpm.toFixed(0)} color={rpm > 0 ? "#3b82f6" : "#333"} />
          <StatBox label="Distance" value={distance.toFixed(2)} unit="km" color="#22c55e" />
          <StatBox label="Gear" value={`${gear}`} sub={`Max: ${maxSpeed.toFixed(1)} km/h`} color="#f59e0b" />
        </div>
      </div>
    );
  }

  return null;
}

function StatBox({ label, value, unit, sub, color }: {
  label: string; value: string; unit?: string; sub?: string; color: string;
}) {
  return (
    <div style={{
      background: "#0a0a0a", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "1.5rem",
    }}>
      <div style={{ fontSize: "0.8rem", color: "#888", textTransform: "uppercase", letterSpacing: 2, marginBottom: "0.5rem" }}>{label}</div>
      <div style={{ fontSize: "3.5rem", fontWeight: 800, fontFamily: "monospace", color, lineHeight: 1 }}>{value}</div>
      {unit && <div style={{ fontSize: "1rem", color: "#666", marginTop: "0.25rem" }}>{unit}</div>}
      {sub && <div style={{ fontSize: "0.8rem", color: "#555", marginTop: "0.5rem" }}>{sub}</div>}
    </div>
  );
}
