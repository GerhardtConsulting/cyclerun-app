/**
 * Phone Camera Pairing via Supabase Realtime + WebRTC
 * 
 * Flow:
 * 1. PC generates 4-digit code, subscribes to Supabase Realtime channel `pair-{code}`
 * 2. Phone user enters code at /pair, joins the same channel
 * 3. Phone requests camera, creates RTCPeerConnection, adds video track
 * 4. Phone sends SDP offer via channel
 * 5. PC receives offer, creates answer, sends back
 * 6. ICE candidates exchanged via channel
 * 7. WebRTC connection established — phone camera streams to PC
 */

import { createClient, type RealtimeChannel } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yuxkujcnsrrkwbvftkvq.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1eGt1amNuc3Jya3didmZ0a3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMjAwNzgsImV4cCI6MjA4NTg5NjA3OH0.aQRnjS2lKDr0qQU9eKphynaHajdn5xWruAXnRx8zhZI";

const LOG_PREFIX = "[Pairing]";
function log(...args: unknown[]) {
  console.log(LOG_PREFIX, ...args);
}
function logErr(...args: unknown[]) {
  console.error(LOG_PREFIX, ...args);
}

// Singleton client — avoids multiple WebSocket connections and ensures
// the API key is passed correctly for Realtime auth
let _supabase: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (_supabase) return _supabase;
  try {
    _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      realtime: {
        params: {
          apikey: SUPABASE_ANON_KEY,
        },
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      },
    });
    log("Supabase client created, URL:", SUPABASE_URL);
    return _supabase;
  } catch (err) {
    logErr("Failed to create Supabase client:", err);
    return null;
  }
}

function waitForSubscribed(channel: RealtimeChannel): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Channel subscribe timeout")), 10000);
    channel.subscribe((status) => {
      log("Channel status:", status);
      if (status === "SUBSCRIBED") {
        clearTimeout(timeout);
        resolve();
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        clearTimeout(timeout);
        reject(new Error(`Channel subscribe failed: ${status}`));
      }
    });
  });
}

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

// ============ PC SIDE (Receiver) ============

export class PairingReceiver {
  code: string;
  channel: RealtimeChannel | null = null;
  pc: RTCPeerConnection | null = null;
  onRemoteStream: ((stream: MediaStream) => void) | null = null;
  onStatusChange: ((status: string) => void) | null = null;
  private _destroyed = false;
  private _iceCandidateQueue: RTCIceCandidateInit[] = [];
  private _remoteDescSet = false;

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
    const sb = getSupabase();
    if (!sb) {
      this.onStatusChange?.("error:no-supabase");
      return;
    }
    log("Receiver: starting with code", this.code);

    // Create WebRTC peer connection
    this.pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    // When we receive the remote stream (phone camera)
    this.pc.ontrack = (event) => {
      log("Receiver: ontrack fired, streams:", event.streams.length);
      if (event.streams[0]) {
        this.onRemoteStream?.(event.streams[0]);
        this.onStatusChange?.("connected");
      }
    };

    // Send ICE candidates to phone via channel
    this.pc.onicecandidate = (event) => {
      if (event.candidate && this.channel) {
        log("Receiver: sending ICE candidate to phone");
        this.channel.send({
          type: "broadcast",
          event: "ice-candidate",
          payload: { candidate: event.candidate.toJSON(), from: "pc" },
        });
      }
    };

    this.pc.oniceconnectionstatechange = () => {
      log("Receiver: ICE connection state:", this.pc?.iceConnectionState);
    };

    this.pc.onconnectionstatechange = () => {
      log("Receiver: connection state:", this.pc?.connectionState);
      if (this.pc?.connectionState === "connected") {
        this.onStatusChange?.("connected");
      } else if (this.pc?.connectionState === "failed") {
        this.onStatusChange?.("failed");
      }
    };

    // Subscribe to Supabase Realtime channel
    this.channel = sb.channel(`pair-${this.code}`, {
      config: { broadcast: { self: false } },
    });

    this.channel.on("broadcast", { event: "offer" }, async (msg) => {
      if (this._destroyed || !this.pc) return;
      log("Receiver: got offer from phone");
      try {
        const offer = msg.payload.sdp;
        await this.pc.setRemoteDescription(new RTCSessionDescription(offer));
        this._remoteDescSet = true;
        log("Receiver: remote description set, draining ICE queue");
        await this._drainIceQueue();

        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);
        log("Receiver: sending answer to phone");

        this.channel?.send({
          type: "broadcast",
          event: "answer",
          payload: { sdp: answer },
        });
        this.onStatusChange?.("connecting");
      } catch (err) {
        logErr("Receiver: offer handling error", err);
        this.onStatusChange?.("error:offer");
      }
    });

    this.channel.on("broadcast", { event: "ice-candidate" }, async (msg) => {
      if (this._destroyed || !this.pc) return;
      if (msg.payload.from === "phone") {
        if (!this._remoteDescSet) {
          log("Receiver: queuing ICE candidate (remote desc not set yet)");
          this._iceCandidateQueue.push(msg.payload.candidate);
        } else {
          try {
            await this.pc.addIceCandidate(new RTCIceCandidate(msg.payload.candidate));
            log("Receiver: added ICE candidate from phone");
          } catch (err) {
            logErr("Receiver: ICE error", err);
          }
        }
      }
    });

    // Phone announces itself
    this.channel.on("broadcast", { event: "phone-joined" }, () => {
      log("Receiver: phone joined the channel");
      this.onStatusChange?.("phone-joined");
    });

    try {
      await waitForSubscribed(this.channel);
      log("Receiver: channel subscribed, waiting for phone");
      this.onStatusChange?.("waiting");
    } catch (err) {
      logErr("Receiver: channel subscribe failed", err);
      this.onStatusChange?.("error:channel");
    }
  }

  destroy() {
    this._destroyed = true;
    this.pc?.close();
    this.pc = null;
    this.channel?.unsubscribe();
    this.channel = null;
  }
}

// ============ PHONE SIDE (Sender) ============

export class PairingSender {
  code: string;
  channel: RealtimeChannel | null = null;
  pc: RTCPeerConnection | null = null;
  stream: MediaStream | null = null;
  onStatusChange: ((status: string) => void) | null = null;
  private _destroyed = false;
  private _iceCandidateQueue: RTCIceCandidateInit[] = [];
  private _remoteDescSet = false;

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
    const sb = getSupabase();
    if (!sb) {
      this.onStatusChange?.("error:no-supabase");
      return;
    }
    log("Sender: starting with code", this.code);

    // Request rear camera
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

    // Create WebRTC peer connection
    this.pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    // Add camera tracks
    this.stream.getTracks().forEach((track) => {
      this.pc!.addTrack(track, this.stream!);
    });

    // Send ICE candidates to PC via channel
    this.pc.onicecandidate = (event) => {
      if (event.candidate && this.channel) {
        log("Sender: sending ICE candidate to PC");
        this.channel.send({
          type: "broadcast",
          event: "ice-candidate",
          payload: { candidate: event.candidate.toJSON(), from: "phone" },
        });
      }
    };

    this.pc.oniceconnectionstatechange = () => {
      log("Sender: ICE connection state:", this.pc?.iceConnectionState);
    };

    this.pc.onconnectionstatechange = () => {
      log("Sender: connection state:", this.pc?.connectionState);
      if (this.pc?.connectionState === "connected") {
        this.onStatusChange?.("connected");
      } else if (this.pc?.connectionState === "failed") {
        this.onStatusChange?.("failed");
      }
    };

    // Subscribe to channel
    this.channel = sb.channel(`pair-${this.code}`, {
      config: { broadcast: { self: false } },
    });

    this.channel.on("broadcast", { event: "answer" }, async (msg) => {
      if (this._destroyed || !this.pc) return;
      log("Sender: got answer from PC");
      try {
        await this.pc.setRemoteDescription(new RTCSessionDescription(msg.payload.sdp));
        this._remoteDescSet = true;
        log("Sender: remote description set, draining ICE queue");
        await this._drainIceQueue();
        this.onStatusChange?.("connecting");
      } catch (err) {
        logErr("Sender: answer error", err);
      }
    });

    this.channel.on("broadcast", { event: "ice-candidate" }, async (msg) => {
      if (this._destroyed || !this.pc) return;
      if (msg.payload.from === "pc") {
        if (!this._remoteDescSet) {
          log("Sender: queuing ICE candidate (remote desc not set yet)");
          this._iceCandidateQueue.push(msg.payload.candidate);
        } else {
          try {
            await this.pc.addIceCandidate(new RTCIceCandidate(msg.payload.candidate));
            log("Sender: added ICE candidate from PC");
          } catch (err) {
            logErr("Sender: ICE error", err);
          }
        }
      }
    });

    try {
      await waitForSubscribed(this.channel);
      log("Sender: channel subscribed");
    } catch (err) {
      logErr("Sender: channel subscribe failed", err);
      this.onStatusChange?.("error:channel");
      return;
    }

    // Small delay to ensure receiver is ready to receive broadcasts
    await new Promise((r) => setTimeout(r, 300));

    // Announce ourselves
    log("Sender: announcing phone-joined");
    this.channel.send({
      type: "broadcast",
      event: "phone-joined",
      payload: {},
    });

    // Create and send offer
    try {
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);
      log("Sender: sending SDP offer");

      this.channel.send({
        type: "broadcast",
        event: "offer",
        payload: { sdp: offer },
      });
      this.onStatusChange?.("offer-sent");
    } catch (err) {
      logErr("Sender: offer creation error", err);
      this.onStatusChange?.("error:offer");
    }
  }

  destroy() {
    this._destroyed = true;
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.pc?.close();
    this.pc = null;
    this.channel?.unsubscribe();
    this.channel = null;
  }
}
