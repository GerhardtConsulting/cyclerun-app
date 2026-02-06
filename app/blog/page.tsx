import type { Metadata } from "next";
import { blogPosts } from "@/lib/blog-data";
import BlogIndexContent from "@/components/BlogIndexContent";

export const metadata: Metadata = {
  title: "Blog — Indoor Cycling Tips, Guides & Comparisons | CycleRun.app",
  description:
    "Expert guides on indoor cycling, route recording, camera settings, and platform comparisons. Learn how to get the most from your home trainer with CycleRun.",
  keywords:
    "indoor cycling blog, home trainer tips, cycling training guides, virtual cycling routes, Zwift alternative, GoPro cycling, POV cycling video",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "CycleRun Blog — Indoor Cycling Guides & Tips",
    description: "Expert guides on indoor cycling, route recording, and getting the most from your home trainer.",
    type: "website",
    url: "https://cyclerun.app/blog",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "CycleRun Blog",
  description: "Indoor cycling tips, guides, and comparisons",
  url: "https://cyclerun.app/blog",
  publisher: {
    "@type": "Organization",
    name: "CycleRun.app",
    url: "https://cyclerun.app",
  },
  blogPost: blogPosts.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    author: { "@type": "Organization", name: p.author },
    url: `https://cyclerun.app/blog/${p.slug}`,
  })),
};

export default function BlogIndex() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogIndexContent />
    </>
  );
}
