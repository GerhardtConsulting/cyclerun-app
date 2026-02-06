/**
 * CycleRun.app — Share Card Generator
 * Creates a 1080×1920 (9:16) transparent PNG overlay
 * for Instagram Stories with ride metrics + branding
 */

export interface RideMetrics {
  sport: string;
  distanceKm: number;
  durationSeconds: number;
  avgSpeedKmh: number;
  maxSpeedKmh: number;
  avgRpm: number;
  calories: number;
  gear: number;
  date: Date;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function generateShareCard(metrics: RideMetrics, locale: string = "en"): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const W = 1080;
    const H = 1920;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return reject(new Error("Canvas not supported"));

    // Transparent background
    ctx.clearRect(0, 0, W, H);

    // Semi-transparent card background at bottom
    const cardY = H - 820;
    const cardH = 760;
    const cardX = 60;
    const cardW = W - 120;
    const radius = 32;

    // Rounded rect with dark transparent background
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, radius);
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fill();

    // Subtle border
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, radius);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Accent line at top of card
    const gradient = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY);
    gradient.addColorStop(0, "#fbbf24");
    gradient.addColorStop(0.5, "#f97316");
    gradient.addColorStop(1, "#dc2626");
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, 4, [radius, radius, 0, 0]);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Logo: "cyclerun.app"
    const logoY = cardY + 64;
    ctx.font = "800 42px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif";
    ctx.fillStyle = "#fafaf9";
    const logoText = "cyclerun";
    const logoWidth = ctx.measureText(logoText).width;
    ctx.fillText(logoText, cardX + 48, logoY);

    // ".app" with gradient
    const appText = ".app";
    const appX = cardX + 48 + logoWidth;
    // Draw gradient text by using a temp canvas
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 200;
    tempCanvas.height = 60;
    const tCtx = tempCanvas.getContext("2d")!;
    tCtx.font = "800 42px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif";
    const appGrad = tCtx.createLinearGradient(0, 0, 150, 0);
    appGrad.addColorStop(0, "#fbbf24");
    appGrad.addColorStop(0.5, "#f97316");
    appGrad.addColorStop(1, "#dc2626");
    tCtx.fillStyle = appGrad;
    tCtx.fillText(appText, 0, 45);
    ctx.drawImage(tempCanvas, appX, logoY - 45);

    // Activity type badge
    const badgeY = logoY + 28;
    const sportLabel = metrics.sport === "cycling"
      ? (locale === "de" ? "RADFAHREN" : "CYCLING")
      : (locale === "de" ? "LAUFEN" : "RUNNING");
    ctx.font = "600 18px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif";
    ctx.fillStyle = "rgba(249, 115, 22, 0.8)";
    ctx.letterSpacing = "3px";
    ctx.fillText(sportLabel, cardX + 48, badgeY);
    ctx.letterSpacing = "0px";

    // Date
    ctx.font = "400 20px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif";
    ctx.fillStyle = "#a8a29e";
    ctx.textAlign = "right";
    ctx.fillText(formatDate(metrics.date, locale), cardX + cardW - 48, badgeY);
    ctx.textAlign = "left";

    // Main stat: Distance
    const mainY = badgeY + 80;
    ctx.font = "800 96px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif";
    // Distance with gradient
    const distGrad = ctx.createLinearGradient(cardX + 48, mainY, cardX + 400, mainY);
    distGrad.addColorStop(0, "#fbbf24");
    distGrad.addColorStop(0.5, "#f97316");
    distGrad.addColorStop(1, "#dc2626");
    ctx.fillStyle = distGrad;
    const distText = metrics.distanceKm.toFixed(1);
    ctx.fillText(distText, cardX + 48, mainY);
    const distWidth = ctx.measureText(distText).width;

    ctx.font = "500 32px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif";
    ctx.fillStyle = "#a8a29e";
    ctx.fillText("km", cardX + 56 + distWidth, mainY);

    // Divider line
    const divY = mainY + 32;
    ctx.beginPath();
    ctx.moveTo(cardX + 48, divY);
    ctx.lineTo(cardX + cardW - 48, divY);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Stats grid (2×2)
    const statsY = divY + 48;
    const colW = (cardW - 96) / 2;
    const stats = [
      {
        label: locale === "de" ? "DAUER" : "DURATION",
        value: formatDuration(metrics.durationSeconds),
      },
      {
        label: locale === "de" ? "⌀ GESCHW." : "AVG SPEED",
        value: metrics.avgSpeedKmh.toFixed(1) + " km/h",
      },
      {
        label: locale === "de" ? "MAX GESCHW." : "MAX SPEED",
        value: metrics.maxSpeedKmh.toFixed(1) + " km/h",
      },
      {
        label: locale === "de" ? "⌀ RPM" : "AVG RPM",
        value: String(metrics.avgRpm),
      },
    ];

    stats.forEach((stat, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = cardX + 48 + col * colW;
      const y = statsY + row * 100;

      ctx.font = "600 16px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif";
      ctx.fillStyle = "#57534e";
      ctx.letterSpacing = "2px";
      ctx.fillText(stat.label, x, y);
      ctx.letterSpacing = "0px";

      ctx.font = "700 36px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif";
      ctx.fillStyle = "#fafaf9";
      ctx.fillText(stat.value, x, y + 40);
    });

    // Bottom row: Calories + Gear
    const bottomY = statsY + 220;
    const calsLabel = locale === "de" ? "KALORIEN" : "CALORIES";
    ctx.font = "600 16px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif";
    ctx.fillStyle = "#57534e";
    ctx.letterSpacing = "2px";
    ctx.fillText(calsLabel, cardX + 48, bottomY);
    ctx.letterSpacing = "0px";
    ctx.font = "700 32px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif";
    ctx.fillStyle = "#fafaf9";
    ctx.fillText(`~${metrics.calories}`, cardX + 48, bottomY + 36);

    const gearLabel = locale === "de" ? "GANG" : "GEAR";
    ctx.font = "600 16px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif";
    ctx.fillStyle = "#57534e";
    ctx.letterSpacing = "2px";
    ctx.fillText(gearLabel, cardX + 48 + colW, bottomY);
    ctx.letterSpacing = "0px";
    ctx.font = "700 32px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif";
    ctx.fillStyle = "#fafaf9";
    const gearNames = locale === "de"
      ? ["", "Leicht", "Mittel", "Schwer"]
      : ["", "Light", "Medium", "Heavy"];
    ctx.fillText(gearNames[metrics.gear] || String(metrics.gear), cardX + 48 + colW, bottomY + 36);

    // Export as PNG blob
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to generate PNG"));
      },
      "image/png",
      1.0
    );
  });
}

/** Download the share card as PNG */
export async function downloadShareCard(metrics: RideMetrics, locale: string = "en") {
  const blob = await generateShareCard(metrics, locale);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cyclerun-${metrics.distanceKm.toFixed(1)}km-${new Date().toISOString().slice(0, 10)}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
