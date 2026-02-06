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

function getSupabase() {
  try {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch {
    return null;
  }
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

  constructor(code: string) {
    this.code = code;
  }

  async start() {
    const sb = getSupabase();
    if (!sb) {
      this.onStatusChange?.("error:no-supabase");
      return;
    }

    // Create WebRTC peer connection
    this.pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    // When we receive the remote stream (phone camera)
    this.pc.ontrack = (event) => {
      if (event.streams[0]) {
        this.onRemoteStream?.(event.streams[0]);
        this.onStatusChange?.("connected");
      }
    };

    // Send ICE candidates to phone via channel
    this.pc.onicecandidate = (event) => {
      if (event.candidate && this.channel) {
        this.channel.send({
          type: "broadcast",
          event: "ice-candidate",
          payload: { candidate: event.candidate.toJSON(), from: "pc" },
        });
      }
    };

    this.pc.onconnectionstatechange = () => {
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
      try {
        const offer = msg.payload.sdp;
        await this.pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);

        this.channel?.send({
          type: "broadcast",
          event: "answer",
          payload: { sdp: answer },
        });
        this.onStatusChange?.("connecting");
      } catch (err) {
        console.error("PairingReceiver: offer handling error", err);
        this.onStatusChange?.("error:offer");
      }
    });

    this.channel.on("broadcast", { event: "ice-candidate" }, async (msg) => {
      if (this._destroyed || !this.pc) return;
      if (msg.payload.from === "phone") {
        try {
          await this.pc.addIceCandidate(new RTCIceCandidate(msg.payload.candidate));
        } catch (err) {
          console.error("PairingReceiver: ICE error", err);
        }
      }
    });

    // Phone announces itself
    this.channel.on("broadcast", { event: "phone-joined" }, () => {
      this.onStatusChange?.("phone-joined");
    });

    await this.channel.subscribe();
    this.onStatusChange?.("waiting");
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

  constructor(code: string) {
    this.code = code;
  }

  async start() {
    const sb = getSupabase();
    if (!sb) {
      this.onStatusChange?.("error:no-supabase");
      return;
    }

    // Request rear camera
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      this.onStatusChange?.("camera-ready");
    } catch (err) {
      console.error("PairingSender: camera error", err);
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
        this.channel.send({
          type: "broadcast",
          event: "ice-candidate",
          payload: { candidate: event.candidate.toJSON(), from: "phone" },
        });
      }
    };

    this.pc.onconnectionstatechange = () => {
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
      try {
        await this.pc.setRemoteDescription(new RTCSessionDescription(msg.payload.sdp));
        this.onStatusChange?.("connecting");
      } catch (err) {
        console.error("PairingSender: answer error", err);
      }
    });

    this.channel.on("broadcast", { event: "ice-candidate" }, async (msg) => {
      if (this._destroyed || !this.pc) return;
      if (msg.payload.from === "pc") {
        try {
          await this.pc.addIceCandidate(new RTCIceCandidate(msg.payload.candidate));
        } catch (err) {
          console.error("PairingSender: ICE error", err);
        }
      }
    });

    await this.channel.subscribe();

    // Announce ourselves
    this.channel.send({
      type: "broadcast",
      event: "phone-joined",
      payload: {},
    });

    // Create and send offer
    try {
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      this.channel.send({
        type: "broadcast",
        event: "offer",
        payload: { sdp: offer },
      });
      this.onStatusChange?.("offer-sent");
    } catch (err) {
      console.error("PairingSender: offer creation error", err);
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
