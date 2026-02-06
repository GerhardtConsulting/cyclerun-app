import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phone Camera Pairing — CycleRun.app",
  description: "Connect your phone camera to CycleRun for motion tracking. Scan the QR code or enter your pairing code.",
  robots: { index: false, follow: false },
};

export default function PairLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
