import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/admin", "/profile", "/pair", "/api/", "/u/", "/favicon.ico"],
      },
    ],
    sitemap: "https://cyclerun.app/sitemap.xml",
  };
}
