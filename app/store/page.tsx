import type { Metadata } from "next";
import StoreContent from "@/components/StoreContent";
import { makeAlternates } from "@/app/seo-config";

export const metadata: Metadata = {
  title: "Route Store — Discover POV Cycling Routes",
  description: "Browse and unlock POV cycling routes from the CycleRun community. From easy coastal rides to extreme alpine passes.",
  alternates: makeAlternates("/store"),
  openGraph: {
    title: "CycleRun Route Store — Community Cycling Routes",
    description: "Discover POV cycling routes from creators worldwide. Unlock premium routes with Credits.",
    type: "website",
    url: "https://cyclerun.app/store",
  },
};

export default function StorePage() {
  return <StoreContent />;
}
