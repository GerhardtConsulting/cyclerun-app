import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts } from "@/lib/blog-data";
import SubpageFooter from "@/components/SubpageFooter";

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

        <section className="seo-cta" style={{ maxWidth: '680px', margin: '2rem auto 0' }}>
          <h2>Start Riding Now — It&apos;s Free</h2>
          <p>Open CycleRun in your browser. No download, no signup, no smart trainer needed.</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" className="btn-primary btn-lg">Start Riding Free</Link>
            <Link href="/creator" className="btn-ghost">Become a Creator →</Link>
          </div>
        </section>

        <section style={{ maxWidth: '680px', margin: '2rem auto', padding: '0 2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', textAlign: 'center' }}>Explore Guides</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/guide/zwift-alternative-free" className="route-badge">Zwift Alternative</Link>
            <Link href="/guide/rouvy-alternative" className="route-badge">Rouvy Alternative</Link>
            <Link href="/guide/indoor-cycling-app" className="route-badge">Indoor Cycling App</Link>
            <Link href="/guide/virtual-cycling-videos" className="route-badge">Virtual Cycling Videos</Link>
            <Link href="/routes" className="route-badge">Browse Routes</Link>
          </div>
        </section>

        <SubpageFooter />
      </div>
    </>
  );
}
