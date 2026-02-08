import type { Metadata } from "next";
import ChangelogContent from "@/components/ChangelogContent";
import { makeAlternates } from "@/app/seo-config";

export const metadata: Metadata = {
  title: "Changelog — What's New",
  description:
    "See what's new at CycleRun. Feature updates, improvements, and fixes — transparent development in real-time.",
  alternates: makeAlternates("/changelog"),
  openGraph: {
    title: "CycleRun Changelog — We Ship Every Day",
    description: "New features, improvements, and fixes at CycleRun.app. Transparent development.",
    type: "website",
    url: "https://cyclerun.app/changelog",
  },
};

export default function ChangelogPage() {
  return <ChangelogContent />;
}
