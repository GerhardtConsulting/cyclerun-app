import type { Metadata } from "next";
import TransparencyContent from "@/components/TransparencyContent";

export const metadata: Metadata = {
  title: "Transparenz | CycleRun",
  description: "Transparenzbericht: Wie CycleRun deine Daten verarbeitet, welche Technologien wir nutzen und wie wir deine Privatsphäre schützen.",
  alternates: {
    canonical: "https://cyclerun.app/transparenz",
    languages: { "en": "/transparency", "de": "/transparenz" },
  },
};

export default function TransparenzPage() {
  return <TransparencyContent />;
}
