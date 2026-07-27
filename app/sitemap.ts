import type { MetadataRoute } from "next";

const BASE_URL = "https://piercedefense.com";

const ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/fight-my-ticket", priority: 0.9 },
  { path: "/traffic-tickets", priority: 0.9 },
  { path: "/dui-defense", priority: 0.9 },
  { path: "/dui-defense/consultation", priority: 0.7 },
  { path: "/contact", priority: 0.6 },
  { path: "/about", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority,
  }));
}
