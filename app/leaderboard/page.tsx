import type { Metadata } from "next";
import LeaderboardContent from "@/components/LeaderboardContent";
import { makeAlternates } from "@/app/seo-config";

export const metadata: Metadata = {
  title: "Leaderboard — Weekly, Monthly & All-Time Rankings",
  description: "See who's leading the pack. Weekly, monthly, and all-time leaderboards for the CycleRun indoor cycling community.",
  alternates: makeAlternates("/leaderboard"),
  robots: { index: false, follow: true },
};

export default function LeaderboardPage() {
  return <LeaderboardContent />;
}
