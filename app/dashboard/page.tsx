import type { Metadata } from "next";
import DashboardContent from "@/components/DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard | CycleRun",
  description: "Your personal cycling dashboard with ride history, stats, and progress tracking.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardContent />;
}
