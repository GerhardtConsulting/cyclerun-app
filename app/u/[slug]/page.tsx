import type { Metadata } from "next";
import PublicProfileContent from "@/components/PublicProfileContent";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug} — Profile`,
    description: `Check out ${slug}'s cycling stats, achievements, and leaderboard rank on CycleRun.`,
    alternates: { canonical: `/u/${slug}` },
    openGraph: {
      title: `${slug} — Profile`,
      description: `Indoor cycling stats and achievements for ${slug}.`,
      type: "profile",
      url: `https://cyclerun.app/u/${slug}`,
    },
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PublicProfileContent slug={slug} />;
}
