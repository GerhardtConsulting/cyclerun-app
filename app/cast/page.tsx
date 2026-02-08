import type { Metadata } from "next";
import CastContent from "@/components/CastContent";

export const metadata: Metadata = {
  title: "Cast to Screen",
  description: "Cast your CycleRun ride video to a second screen — TV, Mac, or any browser.",
  robots: { index: false, follow: false },
};

export default function CastPage() {
  return <CastContent />;
}
