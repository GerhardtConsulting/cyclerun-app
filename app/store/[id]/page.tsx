import type { Metadata } from "next";
import StoreRouteContent from "@/components/StoreRouteContent";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Route — Store`,
    description: "Discover and unlock this POV cycling route on CycleRun.",
    alternates: { canonical: `/store/${id}` },
  };
}

export default async function StoreRoutePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StoreRouteContent routeId={id} />;
}
