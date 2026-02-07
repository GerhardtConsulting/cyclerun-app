import type { Metadata } from "next";
import ProfileContent from "@/components/ProfileContent";

export const metadata: Metadata = {
  title: "My Profile — Stats, Achievements & Streak | CycleRun.app",
  description: "Track your indoor cycling progress. View your Energy points, achievements, streak, level, and personal records.",
  alternates: { canonical: "/profile" },
};

export default function ProfilePage() {
  return <ProfileContent />;
}
