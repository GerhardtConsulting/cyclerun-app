import type { Metadata } from "next";
import LeaderboardContent from "@/components/LeaderboardContent";

export const metadata: Metadata = {
  title: "Leaderboard — Weekly, Monthly & All-Time Rankings | CycleRun.app",
  description: "See who's leading the pack. Weekly, monthly, and all-time leaderboards for the CycleRun indoor cycling community.",
  alternates: { canonical: "/leaderboard" },
};

export default function LeaderboardPage() {
  return <LeaderboardContent />;
}
