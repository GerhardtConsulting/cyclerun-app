import DatenschutzContent from "./DatenschutzContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung von CycleRun.app — Wie wir mit deinen Daten umgehen. Informationen zu Cookies, Google Analytics und deinen Rechten.",
  alternates: { canonical: "/datenschutz" },
  openGraph: {
    title: "Datenschutzerklärung",
    description: "Wie CycleRun.app mit deinen Daten umgeht. DSGVO-konforme Cookie-Einwilligung.",
    url: "https://cyclerun.app/datenschutz",
  },
};

export default function Datenschutz() {
  return <DatenschutzContent />;
}
