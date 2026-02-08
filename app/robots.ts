import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/admin", "/profile", "/pair", "/tv", "/api/", "/u/"],
      },
    ],
    sitemap: "https://cyclerun.app/sitemap.xml",
  };
}
