import type { Metadata } from "next";
import TransparencyContent from "@/components/TransparencyContent";
import { JsonLd, schemas } from "@/app/seo-config";

export const metadata: Metadata = {
  title: "Transparency Report | CycleRun",
  description: "Transparency report: How CycleRun processes your data, which technologies we use, and how we protect your privacy. GDPR compliant.",
  keywords: ["GDPR", "Privacy", "Transparency", "Data Protection", "DSGVO", "CycleRun"],
  alternates: {
    canonical: "https://cyclerun.app/transparency",
    languages: { "en": "/transparency", "de": "/transparenz" },
  },
  openGraph: {
    title: "Transparency Report | CycleRun",
    description: "How CycleRun processes your data and protects your privacy. GDPR Art. 15-17.",
    type: "website",
  },
};

export default function TransparencyPage() {
  return (
    <>
      <JsonLd data={schemas.privacyPolicy({ path: "/transparency", locale: "en" })} />
      <TransparencyContent />
    </>
  );
}
