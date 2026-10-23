import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // Services merged into "Commercial Agreements & Documentation Support" (2026-10-23).
    return [
      { source: "/services/mou-drafting-review", destination: "/services/commercial-agreements-documentation", permanent: true },
      { source: "/services/legal-documentation-support", destination: "/services/commercial-agreements-documentation", permanent: true },
    ];
  },
};

export default nextConfig;
