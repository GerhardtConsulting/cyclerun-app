import type { Metadata } from "next";
import CreatorDashboardContent from "@/components/CreatorDashboardContent";

export const metadata: Metadata = {
  title: "Creator Dashboard — Upload & Manage Routes",
  description: "Upload POV cycling videos, set your price, and earn Credits. The CycleRun Creator Dashboard.",
  alternates: { canonical: "/creator/dashboard" },
};

export default function CreatorDashboardPage() {
  return <CreatorDashboardContent />;
}
