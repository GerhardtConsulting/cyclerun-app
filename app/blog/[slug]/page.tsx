import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts, getBlogPost, getAllBlogSlugs } from "@/lib/blog-data";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getBlogPost(params.slug);
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

function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^\| (.+)$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim()).map(c => c.trim());
      if (cells.every(c => /^-+$/.test(c))) return '';
      const tag = cells.every(c => /^\*\*/.test(c)) ? 'th' : 'td';
      return `<tr>${cells.map(c => `<${tag}>${c.replace(/\*\*/g, '')}</${tag}>`).join('')}</tr>`;
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, (match) => `<table>${match}</table>`)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/^(?!<[a-z])((?!^\s*$).+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/\n{2,}/g, '\n');
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
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

  const otherPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      </head>
      <div className="blog-page">
        <nav className="creator-nav">
          <Link href="/" className="creator-nav-logo">cyclerun<span className="creator-nav-app">.app</span></Link>
          <Link href="/blog" className="btn-ghost btn-sm">← All Posts</Link>
        </nav>

        <article className="blog-article">
          <header className="blog-article-header">
            <div className="blog-article-meta">
              <span className="blog-card-category">{post.category}</span>
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime} read</span>
            </div>
            <h1>{post.title}</h1>
            <p className="blog-article-desc">{post.description}</p>
          </header>

          <div
            className="blog-article-body"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
          />
        </article>

        {otherPosts.length > 0 && (
          <section className="blog-related">
            <h3>More from the blog</h3>
            <div className="blog-related-grid">
              {otherPosts.map((p) => (
                <Link href={`/blog/${p.slug}`} key={p.slug} className="blog-card">
                  <div className="blog-card-category">{p.category}</div>
                  <h2>{p.title}</h2>
                  <p>{p.description}</p>
                  <div className="blog-card-meta">
                    <span>{p.date}</span>
                    <span>·</span>
                    <span>{p.readTime} read</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <footer className="creator-footer">
          <div className="creator-footer-inner">
            <div className="creator-footer-logo">cyclerun<span className="header-logo-app">.app</span></div>
            <div className="creator-footer-links">
              <Link href="/">Home</Link>
              <Link href="/creator">Creators</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/datenschutz">Privacy</Link>
            </div>
            <p className="creator-footer-copy">© 2026 CycleRun.app — Community project</p>
          </div>
        </footer>
      </div>
    </>
  );
}
