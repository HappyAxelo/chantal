import type { Metadata } from "next";
import { brandName } from "@/lib/brand";

/** Per-page metadata with canonical URL and Open Graph defaults. */
export function pageMeta({ title, description, path, noindex = false, type = "website" }: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | ${brandName()}`, description, url: path, type },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}
