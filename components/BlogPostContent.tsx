"use client";

import Link from "next/link";
import { blogPosts, type BlogPost } from "@/lib/blog-data";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";
import SubpageNav from "@/components/SubpageNav";
import SubpageFooter from "@/components/SubpageFooter";

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

interface BlogPostContentProps {
  post: BlogPost;
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  const locale = useLocale();
  const isDE = locale === "de";

  const title = isDE ? (post.title_de || post.title) : post.title;
  const description = isDE ? (post.description_de || post.description) : post.description;
  const category = isDE ? (post.category_de || post.category) : post.category;
  const readTime = isDE ? (post.readTime_de || post.readTime) : post.readTime;
  const content = isDE ? (post.content_de || post.content) : post.content;

  const otherPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="blog-page">
      <SubpageNav rightKey="sub.all_posts" rightHref="/blog" />

      <article className="blog-article">
        <header className="blog-article-header">
          <div className="blog-article-meta">
            <span className="blog-card-category">{category}</span>
            <span>{post.date}</span>
            <span>&middot;</span>
            <span>{readTime} {t("sub.blog.read")}</span>
          </div>
          <h1>{title}</h1>
          <p className="blog-article-desc">{description}</p>
        </header>

        <div
          className="blog-article-body"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
        />
      </article>

      {otherPosts.length > 0 && (
        <section className="blog-related">
          <h3>{t("sub.blog.related")}</h3>
          <div className="blog-related-grid">
            {otherPosts.map((p) => (
              <Link href={`/blog/${p.slug}`} key={p.slug} className="blog-card">
                <div className="blog-card-category">{isDE ? (p.category_de || p.category) : p.category}</div>
                <h2>{isDE ? (p.title_de || p.title) : p.title}</h2>
                <p>{isDE ? (p.description_de || p.description) : p.description}</p>
                <div className="blog-card-meta">
                  <span>{p.date}</span>
                  <span>&middot;</span>
                  <span>{isDE ? (p.readTime_de || p.readTime) : p.readTime} {t("sub.blog.read")}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="seo-cta" style={{ maxWidth: '640px', margin: '2rem auto 0' }}>
        <h2>{t("sub.blog.try_title")}</h2>
        <p>{t("sub.blog.try_desc")}</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary btn-lg">{t("sub.start_riding")}</Link>
          <Link href="/creator" className="btn-ghost">{t("sub.film_earn")}</Link>
        </div>
      </section>

      <SubpageFooter />
    </div>
  );
}
