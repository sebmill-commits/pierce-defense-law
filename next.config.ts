import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
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
