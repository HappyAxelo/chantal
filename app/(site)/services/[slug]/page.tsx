import Link from "next/link";
import { notFound } from "next/navigation";
import { allServices, getPublicService, publicServices } from "@/content/services";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { DraftNote } from "@/components/ui/DraftNote";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { legalName } from "@/lib/brand";
import { draftPreview, siteUrl } from "@/lib/env";
import { pageMeta } from "@/lib/seo";
import type { ServiceContent } from "@/types/content";

export const dynamicParams = false;

/** Draft services (e.g. notarial) are only generated in draft preview, and never indexed. */
function resolve(slug: string): ServiceContent | undefined {
  return getPublicService(slug) ?? (draftPreview ? allServices().find((s) => s.slug === slug) : undefined);
}

export function generateStaticParams() {
  return (draftPreview ? allServices() : publicServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const s = resolve((await params).slug);
  if (!s) return {};
  return pageMeta({ title: s.seo.title, description: s.seo.description, path: `/services/${s.slug}`, noindex: s.status !== "published" });
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i} className="flex gap-3">
          <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-bronze" />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const s = resolve((await params).slug);
  if (!s) notFound();

  const others = publicServices().filter((o) => o.slug !== s.slug).slice(0, 3);
  const bookHref = `/book?service=${s.category}`;

  return (
    <>
      <PageHero eyebrow="Service" title={s.title} lede={s.summary} crumbs={[{ label: "Services", href: "/services" }, { label: s.shortTitle, href: `/services/${s.slug}` }]}>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href={bookHref} className="btn-light">{s.cta}</Link>
          <Link href={`/contact?service=${s.category}`} className="btn-ghost-light">Send an Inquiry</Link>
        </div>
      </PageHero>

      {s.status === "draft" && (
        <div className="container"><DraftNote>this service is a DRAFT: hidden from navigation, the sitemap and search engines until activated in content/services.ts and content/site.ts.</DraftNote></div>
      )}
      {!s.scopeConfirmed && (
        <div className="container"><DraftNote>the scope items on this page are candidates drafted from the brief. The owner must confirm each one (then set scopeConfirmed: true).</DraftNote></div>
      )}

      <section className="section pb-0">
        <div className="container grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="eyebrow mb-3">Overview</p>
            <h2>What this service is about</h2>
          </div>
          <div className="space-y-5 text-lg text-ink-muted">
            {s.intro.map((p) => <p key={p}>{p}</p>)}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="covers">
        <div className="container">
          <h2 id="covers" className="mb-12">What the service can cover</h2>
          <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {s.covers.map((c) => (
              <div key={c.title} className="bg-white p-7">
                <span className="mb-4 block h-px w-8 bg-bronze-soft" aria-hidden="true" />
                <h3 className="mb-2 text-lg">{c.title}</h3>
                <p className="text-[0.95rem] text-ink-muted">{c.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-ink-muted">The precise scope of each engagement is agreed in writing and depends on your documents, the applicable law and our engagement terms.</p>
        </div>
      </section>

      <section className="section border-y border-line bg-canvas">
        <div className="container grid gap-14 md:grid-cols-2">
          <div>
            <h2 className="mb-8 text-[1.75rem]">Who may need it</h2>
            <List items={s.whoMayNeed} />
          </div>
          <div>
            <h2 className="mb-8 text-[1.75rem]">Typical problems we help address</h2>
            <List items={s.problems} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="mb-8 text-[1.75rem]">Possible deliverables</h2>
            <List items={s.deliverables} />
          </div>
          <div>
            <h2 className="mb-8 text-[1.75rem]">How the engagement works</h2>
            <ol className="space-y-0">
              {s.process.map((p, i) => (
                <li key={p.title} className="grid grid-cols-[3rem_1fr] border-t border-line py-5">
                  <span className="font-serif text-2xl text-navy/30" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-lg">{p.title}</h3>
                    <p className="mt-1 text-[0.95rem] text-ink-muted">{p.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container grid gap-8 md:grid-cols-2">
          <div className="border border-line p-8">
            <h2 className="mb-6 text-2xl">What to prepare</h2>
            <List items={s.prepare} />
            <p className="mt-6 text-sm text-ink-muted">Please do not upload or email confidential documents before an engagement is agreed. We will arrange a secure way to share them.</p>
          </div>
          <div className="border border-line bg-canvas p-8">
            <h2 className="mb-6 text-2xl">Limitations and scope</h2>
            <ul className="space-y-3 text-[0.95rem] text-ink-muted">
              {s.limitations.map((l) => <li key={l} className="border-l-2 border-navy/20 pl-4">{l}</li>)}
            </ul>
            <p className="mt-6 text-sm"><Link href="/disclaimer">Read our professional services disclaimer</Link></p>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="section border-t border-line pt-14" aria-labelledby="related">
          <div className="container">
            <h2 id="related" className="mb-8 text-2xl">Related services</h2>
            <ul className="grid gap-4 md:grid-cols-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/services/${o.slug}`} className="flex items-center justify-between border border-line px-6 py-5 no-underline transition-colors hover:border-navy/40">
                    <span className="font-serif text-lg text-navy">{o.title}</span>
                    <Icon name="arrow" className="h-4 w-4 text-navy" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand title={`${s.cta}.`} text="Start with a short consultation. We will confirm whether we can help and what the engagement would involve." primary={{ href: bookHref, label: "Book a Consultation" }} secondary={{ href: `/contact?service=${s.category}`, label: "Send an Inquiry" }} />

      {s.status === "published" && (
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.title,
          description: s.summary,
          url: `${siteUrl()}/services/${s.slug}`,
          provider: { "@type": "Organization", name: legalName() },
        }} />
      )}
    </>
  );
}
