import type { Metadata } from "next";
import { blogPosts, getBlogPost, getAllBlogSlugs } from "@/lib/blog-data";
import { notFound } from "next/navigation";
import BlogPostContent from "@/components/BlogPostContent";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | CycleRun Blog`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `https://cyclerun.app/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: "CycleRun.app", url: "https://cyclerun.app" },
    url: `https://cyclerun.app/blog/${post.slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://cyclerun.app/blog/${post.slug}` },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "CycleRun.app", item: "https://cyclerun.app" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://cyclerun.app/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://cyclerun.app/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <BlogPostContent post={post} />
    </>
  );
}
