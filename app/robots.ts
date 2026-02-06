import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // TODO: Re-enable crawling after Google Search Console + Analytics are set up
  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/"],
      },
    ],
  };
}
