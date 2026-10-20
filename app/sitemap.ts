import type { MetadataRoute } from "next";
import { insightsEnabled, visibleArticles } from "@/content/articles";
import { publicServices } from "@/content/services";
import { siteUrl } from "@/lib/env";

/** Only public, published pages. Draft services and draft articles are excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const staticPaths = ["", "/about", "/services", "/book", "/contact", "/privacy", "/terms", "/disclaimer", "/cookies"];
  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({ url: `${base}${p}`, changeFrequency: "monthly", priority: p === "" ? 1 : 0.7 }));
  for (const s of publicServices()) entries.push({ url: `${base}/services/${s.slug}`, changeFrequency: "monthly", priority: 0.8 });
  if (insightsEnabled()) {
    entries.push({ url: `${base}/insights`, changeFrequency: "weekly", priority: 0.6 });
    for (const a of visibleArticles().filter((a) => a.status === "published")) {
      entries.push({ url: `${base}/insights/${a.slug}`, lastModified: a.updatedAt, priority: 0.5 });
    }
  }
  return entries;
}
