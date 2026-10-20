import Link from "next/link";
import { notFound } from "next/navigation";
import { getVisibleArticle, insightsEnabled, visibleArticles } from "@/content/articles";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CtaBand } from "@/components/ui/CtaBand";
import { DraftNote } from "@/components/ui/DraftNote";
import { JsonLd } from "@/components/ui/JsonLd";
import { legalName } from "@/lib/brand";
import { siteUrl } from "@/lib/env";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return insightsEnabled() ? visibleArticles().map((a) => ({ slug: a.slug })) : [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const a = getVisibleArticle((await params).slug);
  if (!a) return {};
  return pageMeta({ title: a.title, description: a.excerpt, path: `/insights/${a.slug}`, type: "article", noindex: a.status !== "published" });
}

const fmt = (d: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${d}T00:00:00Z`));

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = insightsEnabled() ? getVisibleArticle((await params).slug) : undefined;
  if (!a) notFound();
  const related = a.related.map((s) => getVisibleArticle(s)).filter((r) => r !== undefined);

  return (
    <>
      <article className="section pt-10">
        <div className="container max-w-3xl">
          <Breadcrumbs items={[{ label: "Insights", href: "/insights" }, { label: a.title, href: `/insights/${a.slug}` }]} />
          {a.status === "draft" && <DraftNote>draft article: review the content, then set status to &quot;published&quot; with a publishedAt date.</DraftNote>}
          <header className="mb-10 mt-10 border-b border-line pb-8">
            <p className="eyebrow mb-4">{a.category}</p>
            <h1 className="text-[clamp(2rem,4vw,3rem)]">{a.title}</h1>
            <p className="lede mt-5">{a.excerpt}</p>
            <p className="mt-6 text-sm text-ink-muted">
              By {a.author} · {a.publishedAt ? <time dateTime={a.publishedAt}>{fmt(a.publishedAt)}</time> : "Unpublished draft"} · {a.readingMinutes} min read
            </p>
          </header>
          <div className="prose-body text-[1.08rem] leading-[1.75]">
            {a.body.map((b, i) => {
              switch (b.type) {
                case "p": return <p key={i}>{b.text}</p>;
                case "h2": return <h2 key={i}>{b.text}</h2>;
                case "ul": return <ul key={i}>{b.items.map((it) => <li key={it}>{it}</li>)}</ul>;
                case "note": return <p key={i} className="mt-10 border-l-2 border-bronze-soft bg-canvas px-5 py-4 text-[0.95rem] text-ink-muted">{b.text}</p>;
              }
            })}
          </div>

          {related.length > 0 && (
            <aside className="mt-16 border-t border-line pt-10" aria-labelledby="related-heading">
              <h2 id="related-heading" className="mb-6 text-2xl">Related articles</h2>
              <ul className="space-y-3">
                {related.map((r) => <li key={r.slug}><Link href={`/insights/${r.slug}`} className="font-serif text-lg">{r.title}</Link></li>)}
              </ul>
            </aside>
          )}
        </div>
      </article>
      <CtaBand title="Have a question about your own contract?" text="Articles are general information. For advice on your situation, book a consultation." />
      {a.status === "published" && (
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.excerpt,
          datePublished: a.publishedAt,
          dateModified: a.updatedAt,
          author: { "@type": "Person", name: a.author },
          publisher: { "@type": "Organization", name: legalName() },
          mainEntityOfPage: `${siteUrl()}/insights/${a.slug}`,
        }} />
      )}
    </>
  );
}
