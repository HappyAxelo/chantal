import Link from "next/link";
import { notFound } from "next/navigation";
import { insightsEnabled, visibleArticles } from "@/content/articles";
import { PageHero } from "@/components/ui/PageHero";
import { DraftNote } from "@/components/ui/DraftNote";
import { Icon } from "@/components/ui/Icon";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Insights",
  description: "Practical notes on procurement, contract administration, FIDIC-based contracts and MoUs.",
  path: "/insights",
});

const fmt = (d: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${d}T00:00:00Z`));

export default function InsightsPage() {
  if (!insightsEnabled()) notFound();
  const articles = visibleArticles();
  const categories = Array.from(new Set(articles.map((a) => a.category)));

  return (
    <>
      <PageHero eyebrow="Insights" title="Practical notes on procurement and contracts" lede="Short, general articles on the procedures and documents that matter. They are not advice on any particular matter." crumbs={[{ label: "Insights", href: "/insights" }]} />
      <section className="section">
        <div className="container">
          <ul className="mb-10 flex flex-wrap gap-2" aria-label="Categories">
            {categories.map((c) => <li key={c} className="border border-line px-3 py-1 text-sm text-ink-muted">{c}</li>)}
          </ul>
          <div className="grid gap-px border border-line bg-line md:grid-cols-2">
            {articles.map((a) => (
              <article key={a.slug} className="relative flex flex-col bg-white p-8">
                <p className="eyebrow mb-4">{a.category}</p>
                <h2 className="text-2xl">
                  <Link href={`/insights/${a.slug}`} className="no-underline after:absolute after:inset-0">{a.title}</Link>
                </h2>
                <p className="mt-3 text-ink-muted">{a.excerpt}</p>
                <p className="mt-auto pt-6 text-sm text-ink-muted">
                  {a.publishedAt ? <time dateTime={a.publishedAt}>{fmt(a.publishedAt)}</time> : "Draft"} · {a.readingMinutes} min read
                </p>
                {a.status === "draft" && <DraftNote>draft article, visible only in preview until reviewed and published.</DraftNote>}
                <span className="link-arrow mt-4 text-sm" aria-hidden="true">Read <Icon name="arrow" className="h-4 w-4" /></span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
