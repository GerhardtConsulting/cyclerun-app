import type { Metadata } from "next";
import { getBlogPost, getAllBlogSlugs } from "@/lib/blog-data";
import { notFound } from "next/navigation";
import BlogPostContent from "@/components/BlogPostContent";
import { JsonLd, schemas, makeAlternates } from "@/app/seo-config";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Blog`,
    description: post.description,
    keywords: post.keywords,
    alternates: makeAlternates(`/blog/${post.slug}`),
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

  return (
    <>
      <JsonLd data={[
        schemas.blogPosting(post),
        schemas.breadcrumbs([
          { name: "CycleRun", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]),
      ]} />
      <BlogPostContent post={post} />
    </>
  );
}
