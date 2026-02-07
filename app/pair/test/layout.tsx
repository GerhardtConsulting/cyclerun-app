import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pairing Test — CycleRun.app",
  description: "Test page for phone camera pairing via WebRTC.",
  robots: { index: false, follow: false },
};

export default function PairTestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
