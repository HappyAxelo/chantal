import type { MetadataRoute } from "next";
import { draftPreview, siteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  // Preview/staging deployments must not be indexed.
  if (draftPreview) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
