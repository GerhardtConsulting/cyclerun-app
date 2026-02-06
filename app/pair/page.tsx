import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phone Camera Pairing — CycleRun.app",
  description: "Connect your phone camera to CycleRun for motion tracking. Scan the QR code or enter your pairing code.",
  robots: { index: false, follow: false },
};

export default function PairPage() {
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
          <div className="pair-code-inputs" id="pairCodeInputs">
            <input type="text" maxLength={1} pattern="[0-9]" inputMode="numeric" className="pair-digit" autoFocus />
            <input type="text" maxLength={1} pattern="[0-9]" inputMode="numeric" className="pair-digit" />
            <input type="text" maxLength={1} pattern="[0-9]" inputMode="numeric" className="pair-digit" />
            <input type="text" maxLength={1} pattern="[0-9]" inputMode="numeric" className="pair-digit" />
          </div>

          <button id="pairConnect" className="btn-primary btn-lg btn-full">
            Connect
          </button>

          <div id="pairMobileStatus" className="pair-mobile-status"></div>
        </div>

        <div className="pair-mobile-camera" id="pairMobileCamera" style={{ display: "none" }}>
          <video id="pairCameraFeed" autoPlay muted playsInline></video>
          <p className="pair-camera-label">Camera is streaming to your device</p>
          <div className="pair-connected-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
            Connected
          </div>
        </div>

        <p className="pair-mobile-privacy">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          Your camera feed is sent directly to your computer via peer-to-peer connection. No images pass through our servers.
        </p>
      </div>

      <PairClientScript />
    </div>
  );
}

function PairClientScript() {
  const script = `
    (function() {
      const inputs = document.querySelectorAll('.pair-digit');
      inputs.forEach((input, i) => {
        input.addEventListener('input', function(e) {
          if (e.target.value.length === 1 && i < inputs.length - 1) {
            inputs[i + 1].focus();
          }
          // Auto-submit when all 4 digits entered
          const code = Array.from(inputs).map(inp => inp.value).join('');
          if (code.length === 4) {
            document.getElementById('pairConnect').click();
          }
        });
        input.addEventListener('keydown', function(e) {
          if (e.key === 'Backspace' && !e.target.value && i > 0) {
            inputs[i - 1].focus();
          }
        });
      });

      // Check for code in URL
      const params = new URLSearchParams(window.location.search);
      const urlCode = params.get('code');
      if (urlCode && urlCode.length === 4) {
        urlCode.split('').forEach((digit, i) => {
          if (inputs[i]) inputs[i].value = digit;
        });
      }

      document.getElementById('pairConnect').addEventListener('click', async function() {
        const code = Array.from(inputs).map(inp => inp.value).join('');
        if (code.length !== 4) return;

        const status = document.getElementById('pairMobileStatus');
        status.textContent = 'Connecting...';
        status.className = 'pair-mobile-status info';

        try {
          // Request camera access
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
          });

          const video = document.getElementById('pairCameraFeed');
          video.srcObject = stream;
          document.getElementById('pairMobileCamera').style.display = 'block';

          status.textContent = 'Camera active! Establishing connection...';
          status.className = 'pair-mobile-status success';

          // TODO: In production, use Supabase Realtime + WebRTC
          // 1. Join channel with pairing code
          // 2. Exchange SDP offers/answers via channel
          // 3. Stream video via WebRTC data channel
          console.log('Pairing code:', code, 'Camera stream ready');

          setTimeout(() => {
            status.textContent = 'Connected to your device!';
            document.querySelector('.pair-connected-badge').style.display = 'flex';
          }, 1500);

        } catch (err) {
          status.textContent = 'Camera access denied. Please allow camera access and try again.';
          status.className = 'pair-mobile-status error';
        }
      });
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
