---
description: How to add a new blog post to CycleRun (bilingual EN+DE)
---

# Add a New Blog Post

## Schema & File Locations
- **Data file**: `lib/blog-data.ts` — all blog posts live here as a TypeScript array
- **Interface**: `BlogPost` with required EN fields + optional `_de` fields
- **Client component**: `components/BlogPostContent.tsx` — renders locale-aware content
- **Server page**: `app/blog/[slug]/page.tsx` — generates metadata + static params

## Steps

1. **Open `lib/blog-data.ts`** and add a new entry to the `blogPosts` array. Follow this exact structure:

```typescript
{
  slug: "your-url-slug",                    // URL-safe, lowercase, hyphens
  title: "English Title",
  title_de: "German Title",
  description: "English description (max 160 chars for SEO)",
  description_de: "German description",
  date: "Feb 7, 2026",                      // Display date
  readTime: "8 min",
  readTime_de: "8 Min.",
  category: "Guide",                         // Guide | Comparison | Tips
  category_de: "Guide",
  author: "CycleRun.app",
  keywords: "keyword1, keyword2, keyword3",  // SEO keywords
  content: `## English Markdown Content

Your full English blog post in Markdown format.
Supports: ## headings, **bold**, *italic*, [links](url), - lists, | tables |`,
  content_de: `## German Markdown Content

Full German translation of the blog post.`,
}
```

2. **Verify the slug is unique** — check no other entry uses the same slug.

3. **Build and test**:
// turbo
```bash
cd /Users/dev/CascadeProjects/cyclerun-next && npx next build
```

4. **Test both languages** in the browser:
   - Open `/blog/your-url-slug`
   - Switch language to DE using the flag switcher
   - Verify all text switches to German

5. **Sitemap**: The new post is automatically included via `getAllBlogSlugs()` in `app/sitemap.ts`.

6. **Commit and push**:
```bash
git add -A && git commit -m "content: add blog post — your-title" && git push
```

## Important Notes
- Markdown supports: `##`, `###`, `**bold**`, `*italic*`, `` `code` ``, `[link](url)`, `- list`, `| table |`
- The `markdownToHtml()` function in `BlogPostContent.tsx` handles conversion
- Keep content_de as a full translation, not a summary
- Images are NOT supported in blog content (text-only markdown)
- `keywords` field is used in `<meta name="keywords">` — include EN and DE terms
