import type { Metadata } from "next";
import TransparencyContent from "@/components/TransparencyContent";
import { JsonLd, schemas } from "@/app/seo-config";

export const metadata: Metadata = {
  title: "Transparenz | CycleRun",
  description: "Transparenzbericht: Wie CycleRun deine Daten verarbeitet, welche Technologien wir nutzen und wie wir deine Privatsphäre schützen. DSGVO-konform.",
  keywords: ["DSGVO", "Datenschutz", "Transparenz", "Privacy", "GDPR", "Datensicherheit", "CycleRun"],
  alternates: {
    canonical: "https://cyclerun.app/transparenz",
    languages: { "en": "/transparency", "de": "/transparenz" },
  },
  openGraph: {
    title: "Transparenzbericht | CycleRun",
    description: "Wie CycleRun deine Daten verarbeitet und deine Privatsphäre schützt. DSGVO Art. 15-17.",
    type: "website",
  },
};

export default function TransparenzPage() {
  return (
    <>
      <JsonLd data={schemas.privacyPolicy({ path: "/transparenz", locale: "de" })} />
      <TransparencyContent />
    </>
  );
}
