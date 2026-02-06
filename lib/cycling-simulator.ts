/**
 * CycleRun.app — Indoor Training Simulator
 * Camera-based motion tracking for cycling & running
 */

import { createClient } from "@supabase/supabase-js";
import { t, getLocale } from "@/lib/i18n";
import { downloadShareCard, type RideMetrics } from "@/lib/share-card";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yuxkujcnsrrkwbvftkvq.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1eGt1amNuc3Jya3didmZ0a3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMjAwNzgsImV4cCI6MjA4NTg5NjA3OH0.aQRnjS2lKDr0qQU9eKphynaHajdn5xWruAXnRx8zhZI";

function getSupabase() {
  try {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.warn("Supabase not available");
  }
  return null;
}

interface DetectionZone {
  x: number;
  y: number;
  w: number;
  h: number;
  id: number;
  pair: number;
  position: string;
  side: string;
  active?: boolean;
  motionLevel?: number;
}

export class CyclingSimulator {
  wizardStep: number;
  webcamStream: MediaStream | null;
  detectionZones: DetectionZone[];
  motionThreshold: number;
  previousFrame: ImageData | null;
  pedalState: Record<string, string | number>;
  halfCycles: number[];
  currentRPM: number;
  currentSpeed: number;
  speedScale: number;
  activeRideTime: number;
  isRegistered: boolean;
  registerPopupShown: boolean;
  gear: number;
  riderWeight: number;
  riderHeight: number;
  bikeWeight: number;
  physics: {
    velocity: number;
    targetVelocity: number;
    acceleration: number;
    lastUpdate: number;
    airDensity: number;
    dragCoefficient: number;
    rollingResistance: number;
    gravity: number;
    drivetrainLoss: number;
  };
  isDragging: boolean;
  isResizing: boolean;
  activeZone: DetectionZone | null;
  dragStart: { x: number; y: number };
  isRiding: boolean;
  isPaused: boolean;
  distance: number;
  rideStartTime: number | null;
  physicsLoopRunning: boolean;
  defaultVideoUrl: string;
  selectedSport: string;
  maxSpeed: number;
  rpmSamples: number[];
  speedSamples: number[];
  private _started: boolean;

  constructor() {
    this.wizardStep = 1;
    this.webcamStream = null;
    this.detectionZones = [];
    this.motionThreshold = 15;

    this.previousFrame = null;
    this.pedalState = {};
    this.halfCycles = [];
    this.currentRPM = 0;
    this.currentSpeed = 0;

    this.speedScale = 1.0;

    this.activeRideTime = 0;
    this.isRegistered = localStorage.getItem("cyclerun_registered") === "true";
    this.registerPopupShown = false;

    this.gear = 2;
    this.isPaused = false;
    this.maxSpeed = 0;
    this.rpmSamples = [];
    this.speedSamples = [];

    this.riderWeight = 75;
    this.riderHeight = 175;
    this.bikeWeight = 10;

    this.physics = {
      velocity: 0,
      targetVelocity: 0,
      acceleration: 0,
      lastUpdate: Date.now(),
      airDensity: 1.225,
      dragCoefficient: 0.9,
      rollingResistance: 0.004,
      gravity: 9.81,
      drivetrainLoss: 0.05,
    };

    this.isDragging = false;
    this.isResizing = false;
    this.activeZone = null;
    this.dragStart = { x: 0, y: 0 };

    this.isRiding = false;
    this.distance = 0;
    this.rideStartTime = null;
    this.physicsLoopRunning = false;

    this.defaultVideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
    this.selectedSport = "cycling";
    this._started = false;

    this._start();
  }

  _start() {
    if (this._started) return;
    this._started = true;
    this.bindEvents();
    this.showScreen("welcome");
  }

  bindEvents() {
    // Splash — Sport card click starts flow
    document.getElementById("startCycling")?.addEventListener("click", () => this.startSport("cycling"));
    document.getElementById("startRunning")?.addEventListener("click", () => {
      // Running coming soon — do nothing
    });
    document.getElementById("scrollToFaq")?.addEventListener("click", () => {
      document.getElementById("splashBelow")?.scrollIntoView({ behavior: "smooth" });
    });

    // Legacy wizard start (fallback)
    document.getElementById("startWizard")?.addEventListener("click", () => this.startWizard());

    // Wizard navigation — both back buttons
    document.getElementById("prevStep")?.addEventListener("click", () => this.prevStep());
    document.getElementById("wizardBack")?.addEventListener("click", () => this.prevStep());
    document.getElementById("step1Next")?.addEventListener("click", () => this.showStep(2));
    document.getElementById("step3Next")?.addEventListener("click", () => this.showStep(4));

    // Registration form
    document.getElementById("registerForm")?.addEventListener("submit", (e) => this.handleRegistration(e));

    // Step 1: Camera
    document.getElementById("requestCamera")?.addEventListener("click", () => this.requestCamera());

    // Step 2: Setup type - auto advance on selection
    document.querySelectorAll(".setup-option, .position-card").forEach((btn) => {
      btn.addEventListener("click", (e) => this.selectSetupType(e.currentTarget as HTMLElement));
    });

    // Step 3: Zones
    document.getElementById("addZone")?.addEventListener("click", () => this.addZone());
    document.getElementById("clearZones")?.addEventListener("click", () => this.clearZones());

    // Gear buttons
    document.querySelectorAll(".gear-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.selectGear(e.currentTarget as HTMLElement));
    });

    // Speed calibration slider
    document.getElementById("speedScaleSlider")?.addEventListener("input", (e) => {
      this.speedScale = parseFloat((e.target as HTMLInputElement).value);
      const el = document.getElementById("speedScaleValue");
      if (el) el.textContent = this.speedScale.toFixed(1) + "x";
    });

    // Start ride button (in step 4)
    document.getElementById("startRideBtn")?.addEventListener("click", () => this.startRide());

    // Ride controls
    document.getElementById("toggleWebcam")?.addEventListener("click", () => this.toggleWebcamMinimap());
    document.getElementById("pauseRide")?.addEventListener("click", () => this.togglePause());
    document.getElementById("stopRide")?.addEventListener("click", () => this.stopRide());

    // Gear shift during ride
    document.getElementById("gearUp")?.addEventListener("click", () => this.shiftGear(1));
    document.getElementById("gearDown")?.addEventListener("click", () => this.shiftGear(-1));

    // Video
    document.getElementById("useDefaultVideo")?.addEventListener("click", () => this.loadDefaultVideo());
    document.getElementById("videoUpload")?.addEventListener("change", (e) => this.uploadVideo(e));
    document.getElementById("loadVideoUrl")?.addEventListener("click", () => this.loadVideoFromUrl());

    // Post-ride summary
    document.getElementById("summaryDone")?.addEventListener("click", () => this.closeSummary("welcome"));
    document.getElementById("summaryRideAgain")?.addEventListener("click", () => this.closeSummary("ride"));
    document.getElementById("downloadShareCard")?.addEventListener("click", () => this.handleShareCard());
  }

  // ============ SCREEN MANAGEMENT ============

  showScreen(name: string) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    document.getElementById(name + "Screen")?.classList.add("active");
  }

  startSport(sport: string) {
    this.selectedSport = sport;
    this.wizardStep = 1;
    this.showScreen("setup");
    this.showStep(1);
  }

  startWizard() {
    this.selectedSport = "cycling";
    this.wizardStep = 1;
    this.showScreen("setup");
    this.showStep(1);
  }

  showStep(step: number) {
    this.wizardStep = step;
    document.querySelectorAll(".wizard-step").forEach((s) => s.classList.remove("active"));
    document.getElementById("step" + step)?.classList.add("active");

    // Progress bar
    const progressFill = document.getElementById("progressFill");
    if (progressFill) progressFill.style.width = step * 25 + "%";

    // Navigation — hide footer back on step 1, always show top back
    const prevStep = document.getElementById("prevStep");
    if (prevStep) prevStep.style.display = step === 1 ? "none" : "";
    const wizBack = document.getElementById("wizardBack");
    if (wizBack) wizBack.textContent = step === 1 ? t('wizard.home') : t('wizard.back');

    // Step-specific init
    if (step === 3) {
      this.initZoneSetup();
      this.startPhysicsLoop();
    } else if (step === 4) {
      this.initCalibration();
    }
  }

  prevStep() {
    if (this.wizardStep > 1) {
      this.showStep(this.wizardStep - 1);
    } else {
      this.showScreen("welcome");
    }
  }

  nextStep() {
    if (this.wizardStep < 4) {
      this.showStep(this.wizardStep + 1);
    } else {
      this.startRide();
    }
  }

  // ============ STEP 1: CAMERA ============

  async requestCamera() {
    const status = document.getElementById("cameraStatus");
    if (status) {
      status.textContent = t('sim.camera.activating');
      status.className = "status-message info";
    }

    // Read rider data
    this.riderWeight = parseFloat((document.getElementById("riderWeight") as HTMLInputElement)?.value) || 75;
    this.riderHeight = parseFloat((document.getElementById("riderHeight") as HTMLInputElement)?.value) || 175;
    this.bikeWeight = parseFloat((document.getElementById("bikeWeight") as HTMLInputElement)?.value) || 10;

    console.log(`Rider: ${this.riderWeight}kg, ${this.riderHeight}cm, Bike: ${this.bikeWeight}kg`);

    try {
      this.webcamStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
      });
      if (status) {
        status.textContent = t('sim.camera.success');
        status.className = "status-message success";
      }

      // Show camera preview
      const preview = document.getElementById("cameraPreview");
      const previewVideo = document.getElementById("step1Video") as HTMLVideoElement;
      if (preview && previewVideo) {
        previewVideo.srcObject = this.webcamStream;
        preview.style.display = "block";
      }

      // Show the Weiter button
      const nextBtn = document.getElementById("step1Next") as HTMLElement;
      if (nextBtn) nextBtn.style.display = "flex";
    } catch (err: unknown) {
      if (status) {
        status.textContent = t('sim.camera.denied') + (err instanceof Error ? err.message : String(err));
        status.className = "status-message error";
      }
    }
  }

  // ============ STEP 2: SETUP TYPE ============

  selectSetupType(btn: HTMLElement) {
    document.querySelectorAll(".setup-option").forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");

    const type = btn.dataset.setup;
    this.detectionZones = [];

    if (type === "side") {
      this.detectionZones.push({ x: 0.35, y: 0.25, w: 0.15, h: 0.15, id: 1, pair: 1, position: "top", side: "left" });
      this.detectionZones.push({ x: 0.35, y: 0.55, w: 0.15, h: 0.15, id: 2, pair: 1, position: "bottom", side: "left" });
    } else if (type === "front") {
      this.detectionZones.push({ x: 0.2, y: 0.25, w: 0.12, h: 0.12, id: 1, pair: 1, position: "top", side: "left" });
      this.detectionZones.push({ x: 0.2, y: 0.55, w: 0.12, h: 0.12, id: 2, pair: 1, position: "bottom", side: "left" });
      this.detectionZones.push({ x: 0.68, y: 0.25, w: 0.12, h: 0.12, id: 3, pair: 2, position: "top", side: "right" });
      this.detectionZones.push({ x: 0.68, y: 0.55, w: 0.12, h: 0.12, id: 4, pair: 2, position: "bottom", side: "right" });
    }

    // Auto-advance to step 3
    setTimeout(() => this.showStep(3), 300);
  }

  // ============ STEP 3: ZONE SETUP ============

  initZoneSetup() {
    const video = document.getElementById("zoneSetupVideo") as HTMLVideoElement;
    const canvas = document.getElementById("zoneCanvas") as HTMLCanvasElement;

    if (!this.webcamStream) return;

    video.srcObject = this.webcamStream;
    video.play();

    const setupCanvas = () => {
      const rect = video.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      console.log("Canvas setup:", canvas.width, "x", canvas.height);

      this.setupCanvasEvents(canvas);
      this.startMotionLoop("zoneSetupVideo", "zoneCanvas");
    };

    video.onloadedmetadata = () => {
      setTimeout(setupCanvas, 100);
    };

    window.addEventListener("resize", () => {
      if (this.wizardStep === 3) {
        const rect = video.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    });

    this.updateZoneCount();
  }

  setupCanvasEvents(canvas: HTMLCanvasElement) {
    canvas.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.onPointerDown(e, canvas);
    });

    canvas.addEventListener("mousemove", (e) => {
      if (this.isDragging || this.isResizing) {
        e.preventDefault();
        this.onPointerMove(e, canvas);
      }
    });

    canvas.addEventListener("mouseup", () => this.onPointerUp());
    canvas.addEventListener("mouseleave", () => this.onPointerUp());

    canvas.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        this.onPointerDown(e.touches[0], canvas);
      },
      { passive: false }
    );

    canvas.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
        this.onPointerMove(e.touches[0], canvas);
      },
      { passive: false }
    );

    canvas.addEventListener("touchend", () => this.onPointerUp());
  }

  getCanvasPos(e: MouseEvent | Touch, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  onPointerDown(e: MouseEvent | Touch, canvas: HTMLCanvasElement) {
    const pos = this.getCanvasPos(e, canvas);

    for (let i = this.detectionZones.length - 1; i >= 0; i--) {
      const z = this.detectionZones[i];
      const zx = z.x * canvas.width;
      const zy = z.y * canvas.height;
      const zw = z.w * canvas.width;
      const zh = z.h * canvas.height;

      if (pos.x >= zx + zw - 15 && pos.x <= zx + zw + 10 && pos.y >= zy + zh - 15 && pos.y <= zy + zh + 10) {
        this.isResizing = true;
        this.activeZone = z;
        canvas.style.cursor = "nwse-resize";
        return;
      }

      if (pos.x >= zx && pos.x <= zx + zw && pos.y >= zy && pos.y <= zy + zh) {
        this.isDragging = true;
        this.activeZone = z;
        this.dragStart = { x: pos.x - zx, y: pos.y - zy };
        canvas.style.cursor = "grabbing";
        return;
      }
    }
  }

  onPointerMove(e: MouseEvent | Touch, canvas: HTMLCanvasElement) {
    if (!this.activeZone) return;

    const pos = this.getCanvasPos(e, canvas);

    if (this.isDragging) {
      this.activeZone.x = Math.max(0, Math.min(1 - this.activeZone.w, (pos.x - this.dragStart.x) / canvas.width));
      this.activeZone.y = Math.max(0, Math.min(1 - this.activeZone.h, (pos.y - this.dragStart.y) / canvas.height));
    }

    if (this.isResizing) {
      const zx = this.activeZone.x * canvas.width;
      const zy = this.activeZone.y * canvas.height;
      this.activeZone.w = Math.max(0.05, Math.min(1 - this.activeZone.x, (pos.x - zx) / canvas.width));
      this.activeZone.h = Math.max(0.05, Math.min(1 - this.activeZone.y, (pos.y - zy) / canvas.height));
    }
  }

  onPointerUp() {
    this.isDragging = false;
    this.isResizing = false;
    this.activeZone = null;
    const canvas = document.getElementById("zoneCanvas") as HTMLCanvasElement;
    if (canvas) canvas.style.cursor = "grab";
  }

  addZonePair() {
    if (this.detectionZones.length >= 4) return;

    const pairId = Math.floor(this.detectionZones.length / 2) + 1;
    const isLeft = this.detectionZones.length < 2;
    const xPos = isLeft ? 0.25 : 0.6;

    this.detectionZones.push({
      x: xPos,
      y: 0.25,
      w: 0.15,
      h: 0.15,
      id: this.detectionZones.length + 1,
      pair: pairId,
      position: "top",
      side: isLeft ? "left" : "right",
    });

    this.detectionZones.push({
      x: xPos,
      y: 0.55,
      w: 0.15,
      h: 0.15,
      id: this.detectionZones.length + 1,
      pair: pairId,
      position: "bottom",
      side: isLeft ? "left" : "right",
    });

    this.updateZoneCount();
  }

  addZone() {
    this.addZonePair();
  }

  clearZones() {
    this.detectionZones = [];
    this.updateZoneCount();
  }

  updateZoneCount() {
    const el = document.getElementById("zoneCount");
    const pairs = Math.floor(this.detectionZones.length / 2);
    if (el) el.textContent = t('sim.zones.count', { n: pairs });
  }

  selectGear(btn: HTMLElement) {
    document.querySelectorAll(".gear-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    this.gear = parseInt(btn.dataset.gear || "2");
    this.updateRideGearDisplay();
  }

  shiftGear(direction: number) {
    const newGear = Math.min(3, Math.max(1, this.gear + direction));
    if (newGear === this.gear) return;
    this.gear = newGear;
    this.updateRideGearDisplay();
  }

  updateRideGearDisplay() {
    const num = document.getElementById("rideGearNum");
    const label = document.getElementById("rideGearLabel");
    if (num) num.textContent = String(this.gear);
    if (label) label.textContent = t(`hud.gear.${this.gear}`);
  }

  // ============ MOTION DETECTION LOOP ============

  startMotionLoop(videoId: string, canvasId: string) {
    const video = document.getElementById(videoId) as HTMLVideoElement;
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d")!;
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d")!;

    const loop = () => {
      if (videoId === "zoneSetupVideo" && this.wizardStep !== 3) return;
      if (videoId === "calibrationVideo" && this.wizardStep !== 4) return;

      if (video.readyState >= 2) {
        if (tempCanvas.width !== canvas.width) {
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
        }

        tempCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const currentFrame = tempCtx.getImageData(0, 0, canvas.width, canvas.height);

        if (this.previousFrame) {
          this.detectMotion(currentFrame, ctx, canvas);
        }

        this.previousFrame = currentFrame;
        this.drawZones(ctx, canvas);
        this.updateStatsUI();
      }

      requestAnimationFrame(loop);
    };

    loop();
  }

  detectMotion(currentFrame: ImageData, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    const prevData = this.previousFrame!.data;
    const currData = currentFrame.data;
    const now = Date.now();

    this.detectionZones.forEach((zone) => {
      const zx = Math.floor(zone.x * canvas.width);
      const zy = Math.floor(zone.y * canvas.height);
      const zw = Math.floor(zone.w * canvas.width);
      const zh = Math.floor(zone.h * canvas.height);

      let motion = 0;
      let pixelCount = 0;

      for (let y = zy; y < zy + zh; y += 2) {
        for (let x = zx; x < zx + zw; x += 2) {
          const i = (y * canvas.width + x) * 4;
          if (i >= 0 && i < currData.length - 2) {
            const diff = Math.abs(currData[i] - prevData[i]) + Math.abs(currData[i + 1] - prevData[i + 1]) + Math.abs(currData[i + 2] - prevData[i + 2]);
            motion += diff / 3;
            pixelCount++;
          }
        }
      }

      const avgMotion = pixelCount > 0 ? motion / pixelCount : 0;
      zone.active = avgMotion > this.motionThreshold;
      zone.motionLevel = avgMotion;
    });

    // Track pedal cycles per zone pair
    const pairs: Record<string, { top?: DetectionZone; bottom?: DetectionZone }> = {};
    this.detectionZones.forEach((zone) => {
      const pairKey = String(zone.pair || 1);
      if (!pairs[pairKey]) pairs[pairKey] = {};
      if (zone.position === "top") pairs[pairKey].top = zone;
      if (zone.position === "bottom") pairs[pairKey].bottom = zone;
    });

    const numPairs = Object.keys(pairs).length;
    const trackingBothLegs = numPairs >= 2;

    Object.entries(pairs).forEach(([pairId, pair]) => {
      if (!pair.top || !pair.bottom) return;

      const topMotion = pair.top.motionLevel || 0;
      const bottomMotion = pair.bottom.motionLevel || 0;
      const either = pair.top.active || pair.bottom.active;
      const lastState = this.pedalState[pairId] as string | undefined;

      let newState: string | null = null;
      if (either) {
        newState = topMotion > bottomMotion ? "top" : "bottom";
      }

      if (newState && newState !== lastState && lastState) {
        const lastTime = (this.pedalState[pairId + "_time"] as number) || 0;
        if (now - lastTime > 250) {
          if (trackingBothLegs) {
            if (lastState === "top" && newState === "bottom") {
              this.halfCycles.push(now);
              this.pedalState[pairId + "_time"] = now;
            }
          } else {
            this.halfCycles.push(now);
            this.pedalState[pairId + "_time"] = now;
          }
        }
      }

      if (newState) {
        this.pedalState[pairId] = newState;
      }
    });

    this.halfCycles = this.halfCycles.filter((t) => t > now - 5000);
    this.calculateRPM();
  }

  calculateRPM() {
    const now = Date.now();
    const recent = this.halfCycles.filter((t) => t > now - 3000);

    if (recent.length < 2) return;

    const timeSpan = recent[recent.length - 1] - recent[0];
    if (timeSpan < 200) return;

    const strokesPerMin = ((recent.length - 1) / timeSpan) * 60000;
    const rpm = strokesPerMin / 2;
    const clampedRpm = Math.min(130, Math.max(0, rpm));
    this.currentRPM = Math.round(this.currentRPM * 0.85 + clampedRpm * 0.15);
  }

  startPhysicsLoop() {
    if (this.physicsLoopRunning) return;
    this.physicsLoopRunning = true;

    const physicsLoop = () => {
      if (this.wizardStep >= 3 || this.isRiding) {
        const now = Date.now();
        const recentStrokes = this.halfCycles.filter((t) => t > now - 2000);
        if (recentStrokes.length < 1) {
          this.currentRPM = Math.max(0, this.currentRPM - 1);
        }

        this.updatePhysics();
        this.updateStatsUI();
      }
      requestAnimationFrame(physicsLoop);
    };
    physicsLoop();
  }

  updatePhysics() {
    const now = Date.now();
    const dt = (now - this.physics.lastUpdate) / 1000;
    this.physics.lastUpdate = now;

    if (dt > 0.5) return;

    const gearMultipliers: Record<number, number> = { 1: 0.3, 2: 0.4, 3: 0.5 };
    const gearMultiplier = gearMultipliers[this.gear] || 0.4;

    const targetSpeed = this.currentRPM * gearMultiplier * this.speedScale;

    const totalMass = this.riderWeight + this.bikeWeight;
    const inertiaFactor = 85 / totalMass;

    const speedDiff = targetSpeed - this.currentSpeed;
    const isAccelerating = speedDiff > 0;
    const baseRate = isAccelerating ? 0.03 : 0.02;
    const responseRate = inertiaFactor * baseRate;

    this.currentSpeed += speedDiff * responseRate * Math.min(dt * 60, 1);

    if (this.currentRPM === 0 && this.currentSpeed > 0) {
      const deceleration = 0.15 + this.currentSpeed * 0.005;
      this.currentSpeed = Math.max(0, this.currentSpeed - deceleration * dt * 60);
    }

    this.currentSpeed = Math.max(0, Math.min(60, this.currentSpeed));
    this.physics.velocity = this.currentSpeed / 3.6;
  }

  drawZones(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.detectionZones.forEach((zone) => {
      const x = zone.x * canvas.width;
      const y = zone.y * canvas.height;
      const w = zone.w * canvas.width;
      const h = zone.h * canvas.height;

      // Fill
      ctx.fillStyle = zone.active ? "rgba(249, 115, 22, 0.35)" : "rgba(249, 115, 22, 0.1)";
      ctx.fillRect(x, y, w, h);

      // Border — orange accent
      ctx.strokeStyle = zone.active ? "#f97316" : "rgba(249, 115, 22, 0.5)";
      ctx.lineWidth = zone.active ? 3 : 1.5;
      ctx.strokeRect(x, y, w, h);

      // Label
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "bold 11px system-ui, sans-serif";
      const label = zone.side ? `${zone.side[0].toUpperCase()} ${zone.position}` : "Zone " + zone.id;
      ctx.fillText(label, x + 4, y + 14);

      // Resize handle — orange dot
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.arc(x + w, y + h, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  updateStatsUI() {
    const testRpm = document.getElementById("testRpm");
    const testSpeed = document.getElementById("testSpeed");
    const testGear = document.getElementById("testGear");

    if (testRpm) testRpm.textContent = String(this.currentRPM);
    if (testSpeed) testSpeed.textContent = this.currentSpeed.toFixed(1);
    if (testGear) testGear.textContent = ["", t('sim.gear.light'), t('sim.gear.medium'), t('sim.gear.heavy')][this.gear];

    const calSpeed = document.getElementById("calSpeedValue");
    const calRpm = document.getElementById("calRpmValue");

    if (calSpeed) calSpeed.textContent = this.currentSpeed.toFixed(1);
    if (calRpm) calRpm.textContent = String(this.currentRPM);

    this.updateCalibrationTargets();
  }

  // ============ STEP 4: CALIBRATION ============

  initCalibration() {
    const video = document.getElementById("calibrationVideo") as HTMLVideoElement;
    const canvas = document.getElementById("calibrationCanvas") as HTMLCanvasElement;

    if (!this.webcamStream) return;

    video.srcObject = this.webcamStream;
    video.play();

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      this.startMotionLoop("calibrationVideo", "calibrationCanvas");
    };
  }

  updateCalibrationTargets() {
    const targets = [15, 25, 35];
    targets.forEach((target) => {
      const card = document.querySelector(`.target-card[data-target="${target}"]`) as HTMLElement;
      const status = document.getElementById("target" + target);

      if (!card || !status) return;

      if (this.currentSpeed >= target - 2 && this.currentSpeed <= target + 2) {
        card.classList.add("reached");
        card.classList.remove("active");
        status.textContent = t('sim.target.reached');
      } else if (this.currentSpeed < target && !card.classList.contains("reached")) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });
  }

  // ============ RIDE MODE ============

  startRide() {
    this.showScreen("ride");
    document.getElementById("videoModal")?.classList.add("active");
  }

  loadDefaultVideo() {
    const video = document.getElementById("rideVideo") as HTMLVideoElement;
    video.src = this.defaultVideoUrl;
    video.load();

    video.oncanplay = () => {
      document.getElementById("videoModal")?.classList.remove("active");
      this.beginRide(video);
    };

    video.onerror = () => {
      alert(t('sim.video.error'));
    };
  }

  loadVideoFromUrl() {
    const urlInput = document.getElementById("videoUrlInput") as HTMLInputElement;
    const url = urlInput?.value?.trim();
    if (!url) return;

    const video = document.getElementById("rideVideo") as HTMLVideoElement;
    video.src = url;
    video.load();

    video.oncanplay = () => {
      document.getElementById("videoModal")?.classList.remove("active");
      this.beginRide(video);
    };

    video.onerror = () => {
      alert(t('sim.video.url.error'));
    };
  }

  uploadVideo(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const video = document.getElementById("rideVideo") as HTMLVideoElement;
    video.src = URL.createObjectURL(file);

    video.oncanplay = () => {
      document.getElementById("videoModal")?.classList.remove("active");
      this.beginRide(video);
    };
  }

  async beginRide(video: HTMLVideoElement) {
    await this.showCountdown();

    this.isRiding = true;
    this.rideStartTime = Date.now();
    this.distance = 0;
    this.maxSpeed = 0;
    this.rpmSamples = [];
    this.speedSamples = [];
    this.previousFrame = null;

    video.play();

    this.startPhysicsLoop();

    document.getElementById("webcamMinimap")?.classList.remove("hidden");

    const minimapVideo = document.getElementById("webcamMinimapVideo") as HTMLVideoElement;
    const minimapCanvas = document.getElementById("minimapCanvas") as HTMLCanvasElement;

    if (this.webcamStream && minimapVideo) {
      minimapVideo.srcObject = this.webcamStream;
      minimapVideo.play().catch(() => {});

      const trySetSize = () => {
        if (minimapVideo.videoWidth > 0) {
          minimapCanvas.width = minimapVideo.videoWidth;
          minimapCanvas.height = minimapVideo.videoHeight;
          console.log("[RIDE] Webcam canvas ready:", minimapCanvas.width, "x", minimapCanvas.height);
          console.log("[RIDE] Zones loaded:", this.detectionZones.length);
          this.rideLoop(video);
        } else {
          setTimeout(trySetSize, 100);
        }
      };
      trySetSize();
    } else {
      console.warn("[RIDE] No webcam stream! Motion detection disabled.");
      this.rideLoop(video);
    }
  }

  rideLoop(video: HTMLVideoElement) {
    if (!this.isRiding) return;

    const minimapVideo = document.getElementById("webcamMinimapVideo") as HTMLVideoElement;
    const minimapCanvas = document.getElementById("minimapCanvas") as HTMLCanvasElement;

    if (minimapVideo && minimapCanvas && minimapCanvas.width > 0 && minimapVideo.readyState >= 2) {
      const ctx = minimapCanvas.getContext("2d")!;

      ctx.drawImage(minimapVideo, 0, 0, minimapCanvas.width, minimapCanvas.height);
      const frame = ctx.getImageData(0, 0, minimapCanvas.width, minimapCanvas.height);

      if (this.previousFrame && this.previousFrame.data.length === frame.data.length) {
        this.detectMotion(frame, ctx, minimapCanvas);
      }
      this.previousFrame = frame;
      this.drawZones(ctx, minimapCanvas);
    }

    const targetRate = Math.max(0.1, Math.min(2, this.currentSpeed / 25));
    if (this.currentSpeed < 0.5) {
      video.playbackRate = 0.1;
    } else {
      video.playbackRate = targetRate;
    }

    if (video.paused && video.readyState >= 2) {
      video.play().catch(() => {});
    }

    if (this.currentSpeed > 0.5 && !this.registerPopupShown) {
      this.activeRideTime += 1 / 60;
    }

    // Track metrics for post-ride summary
    if (this.currentSpeed > this.maxSpeed) this.maxSpeed = this.currentSpeed;
    if (this.currentSpeed > 0.5) {
      this.speedSamples.push(this.currentSpeed);
      this.rpmSamples.push(this.currentRPM);
    }

    if (!this.isRegistered && !this.registerPopupShown && this.activeRideTime >= 60) {
      this.showRegistrationPopup();
    }

    this.distance += (this.currentSpeed / 3600) * (1 / 60);

    const speedEl = document.getElementById("speedValue");
    const rpmEl = document.getElementById("rpmValue");
    const distEl = document.getElementById("distanceValue");
    const timeEl = document.getElementById("timeValue");

    if (speedEl) speedEl.textContent = this.currentSpeed.toFixed(1);
    if (rpmEl) rpmEl.textContent = String(this.currentRPM);
    if (distEl) distEl.textContent = this.distance.toFixed(2);

    if (timeEl && this.rideStartTime) {
      const elapsed = Math.floor((Date.now() - this.rideStartTime) / 1000);
      const mins = Math.floor(elapsed / 60).toString().padStart(2, "0");
      const secs = (elapsed % 60).toString().padStart(2, "0");
      timeEl.textContent = `${mins}:${secs}`;
    }

    requestAnimationFrame(() => this.rideLoop(video));
  }

  toggleWebcamMinimap() {
    document.getElementById("webcamMinimap")?.classList.toggle("hidden");
  }

  togglePause() {
    const video = document.getElementById("rideVideo") as HTMLVideoElement;
    const btn = document.getElementById("pauseRide");

    if (this.isPaused) {
      this.isPaused = false;
      video.play();
      if (btn) btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
    } else {
      this.isPaused = true;
      video.pause();
      if (btn) btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    }
  }

  stopRide() {
    this.isRiding = false;
    this.isPaused = false;
    const video = document.getElementById("rideVideo") as HTMLVideoElement;
    video.pause();
    video.currentTime = 0;

    // Calculate final metrics
    const durationSeconds = this.rideStartTime ? Math.floor((Date.now() - this.rideStartTime) / 1000) : 0;
    const avgRpm = this.rpmSamples.length > 0
      ? Math.round(this.rpmSamples.reduce((a, b) => a + b, 0) / this.rpmSamples.length)
      : 0;
    const avgSpeed = this.speedSamples.length > 0
      ? this.speedSamples.reduce((a, b) => a + b, 0) / this.speedSamples.length
      : 0;
    const totalMass = this.riderWeight + this.bikeWeight;
    const calories = Math.round(durationSeconds / 3600 * avgSpeed * totalMass * 0.0175);

    // Populate summary overlay
    const setEl = (id: string, val: string) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    setEl("summaryDistance", this.distance.toFixed(2));
    const h = Math.floor(durationSeconds / 3600);
    const m = Math.floor((durationSeconds % 3600) / 60);
    const s = durationSeconds % 60;
    setEl("summaryDuration", h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`);
    setEl("summaryAvgSpeed", avgSpeed.toFixed(1));
    setEl("summaryMaxSpeed", this.maxSpeed.toFixed(1));
    setEl("summaryAvgRpm", String(avgRpm));
    setEl("summaryCalories", `~${calories}`);

    // Store metrics for share card
    const metrics = {
      sport: this.selectedSport,
      distanceKm: this.distance,
      durationSeconds,
      avgSpeedKmh: avgSpeed,
      maxSpeedKmh: this.maxSpeed,
      avgRpm,
      calories,
      gear: this.gear,
      date: new Date(),
    };
    (window as unknown as Record<string, unknown>).__cyclerunLastRide = metrics;

    // Save session to Supabase if registered
    const email = localStorage.getItem("cyclerun_email");
    if (email && durationSeconds > 10) {
      this.saveSession(metrics, email);
    }

    // Show save prompt only if not registered
    const savePrompt = document.getElementById("summarySavePrompt");
    if (savePrompt) savePrompt.style.display = this.isRegistered ? "none" : "";

    // Show summary overlay
    document.getElementById("rideSummary")?.classList.add("active");
  }

  async saveSession(metrics: Record<string, unknown>, email: string) {
    try {
      const sb = getSupabase();
      if (!sb) return;

      // Get user ID from email
      const { data: user } = await sb.from("registrations")
        .select("id")
        .eq("email", email)
        .single();

      if (!user) return;

      await sb.from("sessions").insert({
        user_id: user.id,
        sport_type: metrics.sport,
        duration_seconds: metrics.durationSeconds,
        distance_km: metrics.distanceKm,
        avg_speed_kmh: metrics.avgSpeedKmh,
        max_speed_kmh: metrics.maxSpeedKmh,
        avg_rpm: metrics.avgRpm,
        max_rpm: 0,
        calories_estimated: metrics.calories,
        gear: metrics.gear,
      });

      // Update profile totals
      try {
        await sb.rpc("increment_profile_stats", {
          p_user_id: user.id,
          p_distance: metrics.distanceKm,
          p_duration: metrics.durationSeconds,
        });
      } catch { /* optional RPC, ignore errors */ }
    } catch (err) {
      console.error("Session save error:", err);
    }
  }

  closeSummary(target: "welcome" | "ride") {
    document.getElementById("rideSummary")?.classList.remove("active");
    if (target === "welcome") {
      this.showScreen("welcome");
    } else {
      this.startRide();
    }
  }

  async handleShareCard() {
    const metrics = (window as unknown as Record<string, unknown>).__cyclerunLastRide as RideMetrics | undefined;
    if (!metrics) return;
    try {
      await downloadShareCard(metrics, getLocale());
    } catch (err) {
      console.error("Share card error:", err);
    }
  }

  showCountdown(): Promise<void> {
    return new Promise((resolve) => {
      const overlay = document.getElementById("countdownOverlay");
      const numEl = document.getElementById("countdownNum");
      if (!overlay || !numEl) {
        resolve();
        return;
      }

      overlay.classList.add("active");
      let count = 3;
      numEl.textContent = String(count);
      numEl.style.animation = "none";
      void (numEl as HTMLElement).offsetWidth;
      numEl.style.animation = "countPop 0.6s cubic-bezier(0.16, 1, 0.3, 1)";

      const tick = setInterval(() => {
        count--;
        if (count <= 0) {
          clearInterval(tick);
          overlay.classList.remove("active");
          resolve();
        } else {
          numEl.textContent = String(count);
          numEl.style.animation = "none";
          void (numEl as HTMLElement).offsetWidth;
          numEl.style.animation = "countPop 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
        }
      }, 800);
    });
  }

  showRegistrationPopup() {
    this.registerPopupShown = true;

    const video = document.getElementById("rideVideo") as HTMLVideoElement;
    if (video) video.playbackRate = 0.1;

    const speedStr = this.currentSpeed.toFixed(1);
    const regTitle = document.querySelector(".register-card h2");
    const regSub = document.querySelector(".register-subtitle");
    if (regTitle) regTitle.textContent = t('reg.popup.title');
    if (regSub) regSub.textContent = t('reg.popup.subtitle', { speed: speedStr });

    document.getElementById("registerOverlay")?.classList.add("active");
  }

  async handleRegistration(e: Event) {
    e.preventDefault();

    const firstName = (document.getElementById("regName") as HTMLInputElement)?.value?.trim();
    const lastName = (document.getElementById("regLastName") as HTMLInputElement)?.value?.trim();
    const email = (document.getElementById("regEmail") as HTMLInputElement)?.value?.trim();
    const consentPrivacy = (document.getElementById("regConsent") as HTMLInputElement)?.checked;

    if (!firstName || !email || !consentPrivacy) return;

    const submitBtn = (e.target as HTMLFormElement).querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = t('reg.popup.saving');
    }

    try {
      const sb = getSupabase();
      if (!sb) throw new Error("Supabase not loaded");
      const newsletterOpt = (document.getElementById("regNewsletter") as HTMLInputElement)?.checked || false;
      const { error } = await sb.from("registrations").insert({
        first_name: firstName,
        last_name: lastName || null,
        email: email,
        preferred_sport: this.selectedSport || "cycling",
        locale: navigator.language || "en",
        consent_privacy: consentPrivacy,
        consent_data_processing: consentPrivacy,
        newsletter_opt_in: newsletterOpt,
      });

      // Subscribe to newsletter if opted in
      if (newsletterOpt) {
        fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, locale: navigator.language?.startsWith("de") ? "de" : "en" }),
        }).catch(() => {});
      }

      if (error && error.code === "23505") {
        // Duplicate email — user already registered, that's fine
      } else if (error) {
        throw error;
      }

      localStorage.setItem("cyclerun_registered", "true");
      localStorage.setItem("cyclerun_name", firstName);
      localStorage.setItem("cyclerun_email", email);
      this.isRegistered = true;

      document.getElementById("registerOverlay")?.classList.remove("active");

      const video = document.getElementById("rideVideo") as HTMLVideoElement;
      if (video) video.play().catch(() => {});
    } catch (err) {
      console.error("Registration error:", err);
      localStorage.setItem("cyclerun_registered", "true");
      this.isRegistered = true;
      document.getElementById("registerOverlay")?.classList.remove("active");
      const video = document.getElementById("rideVideo") as HTMLVideoElement;
      if (video) video.play().catch(() => {});
    }
  }
}
