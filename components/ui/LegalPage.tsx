import { site } from "@/content/site";
import { PageHero } from "./PageHero";
import { DraftNote } from "./DraftNote";

export function LegalPage({ title, path, children }: { title: string; path: string; children: React.ReactNode }) {
  const updated = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${site.legal.lastUpdated}T00:00:00Z`));
  return (
    <>
      <PageHero title={title} crumbs={[{ label: title, href: path }]} />
      <section className="section pt-12">
        <div className="container max-w-3xl">
          {!site.legal.reviewed && (
            <DraftNote>
              this is a jurisdiction-neutral TEMPLATE. It must be reviewed and adapted by a suitably qualified professional for the
              applicable law(s) before launch. Using it does not by itself ensure compliance with data protection or other law.
            </DraftNote>
          )}
          <p className="mb-10 text-sm text-ink-muted">Last updated: {updated}</p>
          <div className="prose-body [&_h2]:text-2xl">{children}</div>
        </div>
      </section>
    </>
  );
}
