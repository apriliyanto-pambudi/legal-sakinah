import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Landing page ads selalu noindex — dikecualikan dari crawl
        disallow: [
          "/admin/",
          "/api/",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
