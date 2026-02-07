import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CycleRun TV Mode",
  description: "TV display for CycleRun indoor training",
  robots: { index: false, follow: false },
};

export default function TVLayout({ children }: { children: React.ReactNode }) {
  return children;
}
