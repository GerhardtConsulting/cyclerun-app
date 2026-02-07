/**
 * Phone Camera Pairing via Supabase REST API Polling + WebRTC
 *
 * Signaling uses the `pair_signals` DB table instead of Realtime WebSocket.
 *
 * Flow:
 * 1. PC generates 4-digit code, polls DB for signals with that code
 * 2. Phone user enters code at /pair, inserts "phone-joined" + SDP offer
 * 3. PC sees offer, creates answer, inserts it into DB
 * 4. ICE candidates exchanged via DB rows
 * 5. WebRTC connection established — phone camera streams to PC
 */

const SUPABASE_URL = "https://yuxkujcnsrrkwbvftkvq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1eGt1amNuc3Jya3didmZ0a3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMjAwNzgsImV4cCI6MjA4NTg5NjA3OH0.aQRnjS2lKDr0qQU9eKphynaHajdn5xWruAXnRx8zhZI";

const REST_BASE = `${SUPABASE_URL}/rest/v1/pair_signals`;
const REST_HEADERS = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=minimal",
};

const LOG_PREFIX = "[Pairing]";
function log(...args: unknown[]) {
  console.log(LOG_PREFIX, ...args);
}
function logErr(...args: unknown[]) {
  console.error(LOG_PREFIX, ...args);
}

// ---- REST helpers ----

async function insertSignal(code: string, signalType: string, payload: unknown) {
  const res = await fetch(REST_BASE, {
    method: "POST",
    headers: REST_HEADERS,
    body: JSON.stringify({ code, signal_type: signalType, payload }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Insert ${signalType} failed (${res.status}): ${text}`);
  }
}

interface SignalRow {
  id: number;
  code: string;
  signal_type: string;
  payload: unknown;
  created_at: string;
}

async function pollSignals(code: string, types: string[], afterId: number): Promise<SignalRow[]> {
  const typeFilter = types.map((t) => `"${t}"`).join(",");
  const url = `${REST_BASE}?code=eq.${code}&signal_type=in.(${typeFilter})&id=gt.${afterId}&order=id.asc`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  });
  if (!res.ok) return [];
  return res.json();
}

const POLL_INTERVAL = 400; // ms

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

// ============ PC SIDE (Receiver) ============

export class PairingReceiver {
  code: string;
  pc: RTCPeerConnection | null = null;
  onRemoteStream: ((stream: MediaStream) => void) | null = null;
  onStatusChange: ((status: string) => void) | null = null;
  private _destroyed = false;
  private _iceCandidateQueue: RTCIceCandidateInit[] = [];
  private _remoteDescSet = false;
  private _pollTimer: ReturnType<typeof setInterval> | null = null;
  private _lastId = 0;

  constructor(code: string) {
    this.code = code;
  }

  private async _drainIceQueue() {
    while (this._iceCandidateQueue.length > 0) {
      const c = this._iceCandidateQueue.shift()!;
      try {
        await this.pc?.addIceCandidate(new RTCIceCandidate(c));
        log("Receiver: queued ICE candidate applied");
      } catch (err) {
        logErr("Receiver: queued ICE candidate error", err);
      }
    }
  }

  async start() {
    log("Receiver: starting with code", this.code);

    this.pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    this.pc.ontrack = (event) => {
      log("Receiver: ontrack fired, streams:", event.streams.length);
      if (event.streams[0]) {
        this.onRemoteStream?.(event.streams[0]);
        this.onStatusChange?.("connected");
      }
    };

    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        log("Receiver: sending ICE candidate to phone");
        insertSignal(this.code, "ice-pc", { candidate: event.candidate.toJSON() }).catch((e) =>
          logErr("Receiver: ICE insert error", e)
        );
      }
    };

    this.pc.oniceconnectionstatechange = () => {
      log("Receiver: ICE state:", this.pc?.iceConnectionState);
    };

    this.pc.onconnectionstatechange = () => {
      log("Receiver: connection state:", this.pc?.connectionState);
      if (this.pc?.connectionState === "connected") {
        this._stopPolling();
        this.onStatusChange?.("connected");
      } else if (this.pc?.connectionState === "failed") {
        this._stopPolling();
        this.onStatusChange?.("failed");
      }
    };

    // Start polling for signals from phone
    this.onStatusChange?.("waiting");
    log("Receiver: polling for signals...");
    this._pollTimer = setInterval(() => this._poll(), POLL_INTERVAL);
  }

  private async _poll() {
    if (this._destroyed) return;
    try {
      const rows = await pollSignals(this.code, ["phone-joined", "offer", "ice-phone"], this._lastId);
      for (const row of rows) {
        this._lastId = row.id;
        await this._handleSignal(row);
      }
    } catch {
      // Network hiccup, retry next interval
    }
  }

  private async _handleSignal(row: SignalRow) {
    if (this._destroyed || !this.pc) return;

    if (row.signal_type === "phone-joined") {
      log("Receiver: phone joined");
      this.onStatusChange?.("phone-joined");
    }

    if (row.signal_type === "offer") {
      log("Receiver: got offer from phone");
      try {
        const sdp = (row.payload as { sdp: RTCSessionDescriptionInit }).sdp;
        await this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
        this._remoteDescSet = true;
        log("Receiver: remote desc set, draining ICE queue");
        await this._drainIceQueue();

        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);
        log("Receiver: sending answer");
        await insertSignal(this.code, "answer", { sdp: answer });
        this.onStatusChange?.("connecting");
      } catch (err) {
        logErr("Receiver: offer handling error", err);
        this.onStatusChange?.("error:offer");
      }
    }

    if (row.signal_type === "ice-phone") {
      const { candidate } = row.payload as { candidate: RTCIceCandidateInit };
      if (!this._remoteDescSet) {
        log("Receiver: queuing ICE candidate");
        this._iceCandidateQueue.push(candidate);
      } else {
        try {
          await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
          log("Receiver: added ICE candidate from phone");
        } catch (err) {
          logErr("Receiver: ICE error", err);
        }
      }
    }
  }

  private _stopPolling() {
    if (this._pollTimer) {
      clearInterval(this._pollTimer);
      this._pollTimer = null;
    }
  }

  destroy() {
    this._destroyed = true;
    this._stopPolling();
    this.pc?.close();
    this.pc = null;
  }
}

// ============ PHONE SIDE (Sender) ============

export class PairingSender {
  code: string;
  pc: RTCPeerConnection | null = null;
  stream: MediaStream | null = null;
  onStatusChange: ((status: string) => void) | null = null;
  private _destroyed = false;
  private _iceCandidateQueue: RTCIceCandidateInit[] = [];
  private _remoteDescSet = false;
  private _pollTimer: ReturnType<typeof setInterval> | null = null;
  private _lastId = 0;

  constructor(code: string) {
    this.code = code;
  }

  private async _drainIceQueue() {
    while (this._iceCandidateQueue.length > 0) {
      const c = this._iceCandidateQueue.shift()!;
      try {
        await this.pc?.addIceCandidate(new RTCIceCandidate(c));
        log("Sender: queued ICE candidate applied");
      } catch (err) {
        logErr("Sender: queued ICE candidate error", err);
      }
    }
  }

  async start() {
    log("Sender: starting with code", this.code);

    // Request camera
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      log("Sender: camera acquired, tracks:", this.stream.getTracks().length);
      this.onStatusChange?.("camera-ready");
    } catch (err) {
      logErr("Sender: camera error", err);
      this.onStatusChange?.("error:camera");
      return;
    }

    this.pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    this.stream.getTracks().forEach((track) => {
      this.pc!.addTrack(track, this.stream!);
    });

    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        log("Sender: sending ICE candidate to PC");
        insertSignal(this.code, "ice-phone", { candidate: event.candidate.toJSON() }).catch((e) =>
          logErr("Sender: ICE insert error", e)
        );
      }
    };

    this.pc.oniceconnectionstatechange = () => {
      log("Sender: ICE state:", this.pc?.iceConnectionState);
    };

    this.pc.onconnectionstatechange = () => {
      log("Sender: connection state:", this.pc?.connectionState);
      if (this.pc?.connectionState === "connected") {
        this._stopPolling();
        this.onStatusChange?.("connected");
      } else if (this.pc?.connectionState === "failed") {
        this._stopPolling();
        this.onStatusChange?.("failed");
      }
    };

    // Announce + send offer
    try {
      log("Sender: announcing phone-joined");
      await insertSignal(this.code, "phone-joined", {});

      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);
      log("Sender: sending SDP offer");
      await insertSignal(this.code, "offer", { sdp: offer });
      this.onStatusChange?.("offer-sent");
    } catch (err) {
      logErr("Sender: offer error", err);
      this.onStatusChange?.("error:offer");
      return;
    }

    // Poll for answer + ICE candidates from PC
    this._pollTimer = setInterval(() => this._poll(), POLL_INTERVAL);
  }

  private async _poll() {
    if (this._destroyed) return;
    try {
      const rows = await pollSignals(this.code, ["answer", "ice-pc"], this._lastId);
      for (const row of rows) {
        this._lastId = row.id;
        await this._handleSignal(row);
      }
    } catch {
      // Network hiccup, retry next interval
    }
  }

  private async _handleSignal(row: SignalRow) {
    if (this._destroyed || !this.pc) return;

    if (row.signal_type === "answer") {
      log("Sender: got answer from PC");
      try {
        const sdp = (row.payload as { sdp: RTCSessionDescriptionInit }).sdp;
        await this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
        this._remoteDescSet = true;
        log("Sender: remote desc set, draining ICE queue");
        await this._drainIceQueue();
        this.onStatusChange?.("connecting");
      } catch (err) {
        logErr("Sender: answer error", err);
      }
    }

    if (row.signal_type === "ice-pc") {
      const { candidate } = row.payload as { candidate: RTCIceCandidateInit };
      if (!this._remoteDescSet) {
        log("Sender: queuing ICE candidate");
        this._iceCandidateQueue.push(candidate);
      } else {
        try {
          await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
          log("Sender: added ICE candidate from PC");
        } catch (err) {
          logErr("Sender: ICE error", err);
        }
      }
    }
  }

  private _stopPolling() {
    if (this._pollTimer) {
      clearInterval(this._pollTimer);
      this._pollTimer = null;
    }
  }

  destroy() {
    this._destroyed = true;
    this._stopPolling();
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.pc?.close();
    this.pc = null;
  }
}
