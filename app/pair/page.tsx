"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PairingSender } from "@/lib/phone-pairing";

function PairContent() {
  const searchParams = useSearchParams();
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [status, setStatus] = useState<{ text: string; type: string }>({ text: "", type: "" });
  const [showCamera, setShowCamera] = useState(false);
  const [connected, setConnected] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const senderRef = useRef<PairingSender | null>(null);

  // Auto-fill code from URL param
  useEffect(() => {
    const urlCode = searchParams.get("code");
    if (urlCode && urlCode.length === 4) {
      setDigits(urlCode.split(""));
    }
  }, [searchParams]);

  const handleDigit = useCallback((index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [digits]);

  const handleConnect = useCallback(async () => {
    const code = digits.join("");
    if (code.length !== 4) return;

    setStatus({ text: "Starting camera...", type: "info" });

    // Clean up previous sender
    senderRef.current?.destroy();

    const sender = new PairingSender(code);
    senderRef.current = sender;

    sender.onStatusChange = (s) => {
      switch (s) {
        case "camera-ready":
          setStatus({ text: "Camera active! Connecting to your device...", type: "success" });
          // Show local preview
          if (videoRef.current && sender.stream) {
            videoRef.current.srcObject = sender.stream;
            setShowCamera(true);
          }
          break;
        case "offer-sent":
          setStatus({ text: "Waiting for your computer to respond...", type: "info" });
          break;
        case "connecting":
          setStatus({ text: "Establishing video stream...", type: "info" });
          break;
        case "connected":
          setStatus({ text: "Connected! Your camera is streaming to your device.", type: "success" });
          setConnected(true);
          break;
        case "failed":
          setStatus({ text: "Connection failed. Make sure the code is correct and try again.", type: "error" });
          break;
        case "error:camera":
          setStatus({ text: "Camera access denied. Please allow camera access and reload.", type: "error" });
          break;
        case "error:no-supabase":
          setStatus({ text: "Connection service unavailable. Please try again.", type: "error" });
          break;
        default:
          if (s.startsWith("error:")) {
            setStatus({ text: `Error: ${s.split(":")[1]}`, type: "error" });
          }
      }
    };

    await sender.start();
  }, [digits]);

  // Auto-connect when all 4 digits are filled
  useEffect(() => {
    if (digits.every((d) => d.length === 1)) {
      handleConnect();
    }
  }, [digits, handleConnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { senderRef.current?.destroy(); };
  }, []);

  return (
    <div className="pair-mobile-page">
      <div className="pair-mobile-card">
        <div className="pair-mobile-logo">
          cyclerun<span className="header-logo-app">.app</span>
        </div>

        <h1>Connect Camera</h1>
        <p className="pair-mobile-desc">
          Enter the 4-digit code shown on your TV or computer to connect your phone&apos;s camera.
        </p>

        <div className="pair-mobile-form">
          <div className="pair-code-inputs">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]"
                className="pair-digit"
                autoFocus={i === 0}
                value={d}
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
              />
            ))}
          </div>

          <button className="btn-primary btn-lg btn-full" onClick={handleConnect}>
            Connect
          </button>

          {status.text && (
            <div className={`pair-mobile-status ${status.type}`}>{status.text}</div>
          )}
        </div>

        {showCamera && (
          <div className="pair-mobile-camera">
            <video ref={videoRef} autoPlay muted playsInline></video>
            <p className="pair-camera-label">
              {connected ? "Camera is streaming to your device" : "Camera preview — connecting..."}
            </p>
            {connected && (
              <div className="pair-connected-badge" style={{ display: "flex" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                Connected
              </div>
            )}
          </div>
        )}

        <p className="pair-mobile-privacy">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          Your camera feed is sent directly to your computer via peer-to-peer connection. No images pass through our servers.
        </p>
      </div>
    </div>
  );
}

export default function PairPage() {
  return (
    <Suspense fallback={
      <div className="pair-mobile-page">
        <div className="pair-mobile-card">
          <div className="pair-mobile-logo">cyclerun<span className="header-logo-app">.app</span></div>
          <h1>Connect Camera</h1>
          <p className="pair-mobile-desc">Loading...</p>
        </div>
      </div>
    }>
      <PairContent />
    </Suspense>
  );
}
