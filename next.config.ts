import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Both hosts otherwise serve the same pages, which splits ranking
      // signals between two URLs for every page.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.piercedefense.com" }],
        destination: "https://piercedefense.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
