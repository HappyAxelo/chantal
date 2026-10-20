import Link from "next/link";
import { siteUrl } from "@/lib/env";
import { JsonLd } from "./JsonLd";

export interface Crumb {
  label: string;
  href: string;
}

export function Breadcrumbs({ items, light = false }: { items: Crumb[]; light?: boolean }) {
  const all = [{ label: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${light ? "text-white/65" : "text-ink-muted"}`}>
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className={light ? "text-white" : "text-ink"}>{c.label}</span>
                ) : (
                  <>
                    <Link href={c.href} className={`no-underline hover:underline ${light ? "text-white/65 hover:text-white" : "text-ink-muted"}`}>
                      {c.label}
                    </Link>
                    <span aria-hidden="true">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: `${siteUrl()}${c.href}` })),
        }}
      />
    </>
  );
}
