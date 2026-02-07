"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PairingReceiver } from "@/lib/phone-pairing";

export default function PairTestPage() {
  const [pairCode, setPairCode] = useState<string>("");
  const [status, setStatus] = useState("Initializing...");
  const [statusColor, setStatusColor] = useState("#888");
  const [logs, setLogs] = useState<string[]>([]);
  const [streamActive, setStreamActive] = useState(false);
  const [videoStats, setVideoStats] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const receiverRef = useRef<PairingReceiver | null>(null);
  const statsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addLog = useCallback((msg: string) => {
    const ts = new Date().toLocaleTimeString("de-DE", { hour12: false, fractionalSecondDigits: 1 });
    setLogs((prev) => [`[${ts}] ${msg}`, ...prev].slice(0, 100));
  }, []);

  const startReceiver = useCallback(async () => {
    // Generate 4-digit code
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setPairCode(code);
    addLog(`Generated pairing code: ${code}`);

    // Clean up previous receiver
    receiverRef.current?.destroy();
    if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);

    const receiver = new PairingReceiver(code);
    receiverRef.current = receiver;

    receiver.onStatusChange = (s) => {
      addLog(`Status: ${s}`);
      switch (s) {
        case "waiting":
          setStatus("Waiting for phone to connect...");
          setStatusColor("#f59e0b");
          break;
        case "phone-joined":
          setStatus("Phone found! Connecting camera...");
          setStatusColor("#3b82f6");
          break;
        case "connecting":
          setStatus("Establishing video stream...");
          setStatusColor("#8b5cf6");
          break;
        case "connected":
          setStatus("Connected! Streaming from phone camera.");
          setStatusColor("#22c55e");
          break;
        case "failed":
          setStatus("Connection failed. Click 'New Code' to retry.");
          setStatusColor("#ef4444");
          break;
        default:
          if (s.startsWith("error:")) {
            setStatus(`Error: ${s.split(":").slice(1).join(":")}`);
            setStatusColor("#ef4444");
          }
      }
    };

    receiver.onRemoteStream = (stream) => {
      addLog(`Remote stream received! Tracks: ${stream.getTracks().length}`);
      setStreamActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((e) => addLog(`Video play error: ${e.message}`));
      }

      // Stats polling
      statsIntervalRef.current = setInterval(() => {
        const video = videoRef.current;
        if (video && video.videoWidth > 0) {
          setVideoStats(`${video.videoWidth}×${video.videoHeight} @ ${video.currentTime.toFixed(1)}s`);
        }
      }, 1000);
    };

    await receiver.start();
  }, [addLog]);

  // Generate QR code after pairCode is set
  useEffect(() => {
    if (!pairCode) return;
    const qrEl = canvasRef.current?.parentElement;
    if (!qrEl) return;

    const pairUrl = `https://cyclerun.app/pair?code=${pairCode}`;
    addLog(`QR URL: ${pairUrl}`);

    import("qrcode").then((QRCode) => {
      const canvas = document.createElement("canvas");
      QRCode.toCanvas(canvas, pairUrl, {
        width: 220,
        margin: 2,
        color: { dark: "#ffffffee", light: "#00000000" },
      }).then(() => {
        const container = document.getElementById("qr-container");
        if (container) {
          container.innerHTML = "";
          container.appendChild(canvas);
        }
        addLog("QR code generated successfully");
      }).catch((err: Error) => {
        addLog(`QR generation failed: ${err.message}`);
      });
    });
  }, [pairCode, addLog]);

  // Auto-start on mount
  useEffect(() => {
    startReceiver();
    return () => {
      receiverRef.current?.destroy();
      if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Intercept console.log for [Pairing] messages
  useEffect(() => {
    const origLog = console.log;
    const origErr = console.error;
    console.log = (...args: unknown[]) => {
      origLog(...args);
      if (typeof args[0] === "string" && args[0] === "[Pairing]") {
        addLog(args.slice(1).map(String).join(" "));
      }
    };
    console.error = (...args: unknown[]) => {
      origErr(...args);
      if (typeof args[0] === "string" && args[0] === "[Pairing]") {
        addLog("ERROR: " + args.slice(1).map(String).join(" "));
      }
    };
    return () => {
      console.log = origLog;
      console.error = origErr;
    };
  }, [addLog]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#e5e5e5",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "2rem",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>
            📱 Phone Camera Pairing Test
          </h1>
          <p style={{ color: "#888", marginTop: "0.5rem" }}>
            PC/TV Receiver — scan the QR code with your phone to stream its camera here
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: streamActive ? "1fr 1fr" : "1fr", gap: "1.5rem" }}>
          {/* Left: QR + Code + Status */}
          <div style={{
            background: "#141414",
            borderRadius: 16,
            padding: "2rem",
            border: "1px solid rgba(255,255,255,0.06)",
            textAlign: "center",
          }}>
            {/* Status badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 999,
              background: `${statusColor}15`,
              border: `1px solid ${statusColor}30`,
              marginBottom: "1.5rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: statusColor,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: statusColor,
                animation: status.includes("Waiting") || status.includes("Connecting") ? "pulse 1.5s infinite" : "none",
              }} />
              {status}
            </div>

            {/* QR Code */}
            <div id="qr-container" style={{
              margin: "1rem auto",
              width: 220,
              height: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.02)",
              borderRadius: 12,
              border: "1px dashed rgba(255,255,255,0.1)",
            }}>
              <canvas ref={canvasRef} />
            </div>

            {/* Pairing code */}
            <div style={{ marginTop: "1rem" }}>
              <p style={{ color: "#888", fontSize: "0.8rem", marginBottom: 8 }}>Pairing Code</p>
              <div style={{
                fontSize: "2.5rem",
                fontWeight: 800,
                letterSpacing: "0.5em",
                fontFamily: "monospace",
                color: "#fff",
              }}>
                {pairCode || "----"}
              </div>
            </div>

            {/* URL hint */}
            <p style={{ color: "#666", fontSize: "0.75rem", marginTop: "1rem" }}>
              Or visit <strong style={{ color: "#f59e0b" }}>cyclerun.app/pair</strong> on your phone and enter the code
            </p>

            {/* New Code button */}
            <button
              onClick={startReceiver}
              style={{
                marginTop: "1.5rem",
                padding: "10px 24px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                color: "#e5e5e5",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              🔄 Generate New Code
            </button>
          </div>

          {/* Right: Video stream (only when active) */}
          {streamActive && (
            <div style={{
              background: "#141414",
              borderRadius: 16,
              padding: "1rem",
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              flexDirection: "column",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.75rem",
                padding: "0 0.5rem",
              }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>📹 Phone Camera Feed</span>
                {videoStats && (
                  <span style={{ fontSize: "0.75rem", color: "#888", fontFamily: "monospace" }}>{videoStats}</span>
                )}
              </div>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: "100%",
                  borderRadius: 12,
                  background: "#000",
                  border: "1px solid rgba(255,255,255,0.06)",
                  flex: 1,
                  objectFit: "contain",
                }}
              />
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: "0.75rem",
                padding: "6px 12px",
                borderRadius: 8,
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
                fontSize: "0.8rem",
                color: "#22c55e",
                fontWeight: 600,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                Live — Peer-to-peer connection active
              </div>
            </div>
          )}
        </div>

        {/* Debug Log */}
        <div style={{
          marginTop: "1.5rem",
          background: "#141414",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "0.75rem 1rem",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>🔍 Connection Log</span>
            <button
              onClick={() => setLogs([])}
              style={{
                padding: "4px 12px",
                borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "transparent",
                color: "#888",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>
          <div style={{
            padding: "0.75rem 1rem",
            maxHeight: 250,
            overflowY: "auto",
            fontFamily: "monospace",
            fontSize: "0.75rem",
            lineHeight: 1.6,
          }}>
            {logs.length === 0 ? (
              <span style={{ color: "#555" }}>No log entries yet...</span>
            ) : (
              logs.map((l, i) => (
                <div key={i} style={{
                  color: l.includes("ERROR") ? "#ef4444" : l.includes("connected") || l.includes("success") ? "#22c55e" : "#888",
                }}>
                  {l}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          marginTop: "1.5rem",
          background: "#141414",
          borderRadius: 16,
          padding: "1.5rem",
          border: "1px solid rgba(255,255,255,0.06)",
          fontSize: "0.85rem",
          lineHeight: 1.7,
          color: "#999",
        }}>
          <h3 style={{ color: "#e5e5e5", marginTop: 0, fontSize: "0.95rem" }}>How to test:</h3>
          <ol style={{ paddingLeft: "1.2rem", margin: 0 }}>
            <li><strong style={{ color: "#e5e5e5" }}>Same network:</strong> Make sure your phone and this device are on the same WiFi network</li>
            <li><strong style={{ color: "#e5e5e5" }}>Scan QR:</strong> Open your phone camera and scan the QR code above</li>
            <li><strong style={{ color: "#e5e5e5" }}>Allow camera:</strong> Grant camera access when prompted on your phone</li>
            <li><strong style={{ color: "#e5e5e5" }}>Watch stream:</strong> The phone&apos;s camera feed should appear on the right</li>
          </ol>
          <p style={{ marginTop: "1rem", marginBottom: 0, fontSize: "0.8rem", color: "#666" }}>
            Tip: WebRTC works peer-to-peer. If you&apos;re behind a strict firewall/NAT, the STUN servers may not be enough.
            For production, consider adding a TURN server.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
