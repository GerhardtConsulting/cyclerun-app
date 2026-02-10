import type { Metadata } from "next";
import TransparencyContent from "@/components/TransparencyContent";

export const metadata: Metadata = {
  title: "Transparency Report | CycleRun",
  description: "Transparency report: How CycleRun processes your data, which technologies we use, and how we protect your privacy.",
  alternates: {
    canonical: "https://cyclerun.app/transparency",
    languages: { "en": "/transparency", "de": "/transparenz" },
  },
};

export default function TransparencyPage() {
  return <TransparencyContent />;
}
