import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /defense/* is the Seattle site, served on its own subdomain. Blocking
      // it here keeps the same pages from being indexed twice under
      // piercedefense.com.
      disallow: ["/api/", "/defense/"],
    },
    sitemap: "https://piercedefense.com/sitemap.xml",
  };
}
