import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts } from "@/lib/blog-data";

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
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <div className="blog-page">
        <nav className="creator-nav">
          <Link href="/" className="creator-nav-logo">cyclerun<span className="creator-nav-app">.app</span></Link>
          <Link href="/creator" className="btn-ghost btn-sm">Become a Creator</Link>
        </nav>

        <header className="blog-hero">
          <span className="creator-badge">Blog</span>
          <h1>Indoor Cycling <span className="gradient-text">Knowledge Hub</span></h1>
          <p className="blog-hero-sub">Guides, tips, and insights to get the most from your indoor training — no smart trainer required.</p>
        </header>

        <section className="blog-grid">
          {blogPosts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="blog-card">
              <div className="blog-card-category">{post.category}</div>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <div className="blog-card-meta">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime} read</span>
              </div>
            </Link>
          ))}
        </section>

        <footer className="creator-footer">
          <div className="creator-footer-inner">
            <div className="creator-footer-logo">cyclerun<span className="header-logo-app">.app</span></div>
            <div className="creator-footer-links">
              <Link href="/">Home</Link>
              <Link href="/creator">Creators</Link>
              <Link href="/datenschutz">Privacy</Link>
              <Link href="/impressum">Legal</Link>
            </div>
            <p className="creator-footer-copy">© 2026 CycleRun.app — Community project</p>
          </div>
        </footer>
      </div>
    </>
  );
}
