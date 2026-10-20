import Link from "next/link";
import { bookingCategories } from "@/content/services";
import { site } from "@/content/site";
import { PageHero } from "@/components/ui/PageHero";
import { DraftNote } from "@/components/ui/DraftNote";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Contact & Request a Quotation",
  description: "Send an inquiry or request a quotation for procurement, contract management, FIDIC, MoU or documentation support.",
  path: "/contact",
});

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const categories = bookingCategories();
  const { service } = await searchParams;
  const defaultService = categories.some((c) => c.id === service) ? service : undefined;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Send an inquiry or request a quotation"
        lede="Tell us briefly about your matter. We will review it and contact you to discuss scope and next steps."
        crumbs={[{ label: "Contact", href: "/contact" }]}
      />
      <section className="section">
        <div className="container grid gap-14 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <InquiryForm categories={categories} defaultService={defaultService} responseStandard={site.responseStandard} privacyVersion={site.legal.privacyNoticeVersion} />
          </div>

          <aside className="space-y-8 lg:pt-2">
            <div className="border border-line p-7">
              <h2 className="text-xl">Prefer to talk first?</h2>
              <p className="mt-2 text-[0.95rem] text-ink-muted">Request an appointment for an initial consultation at a time that suits you.</p>
              <Link href="/book" className="btn-secondary mt-5 w-full">Book a Consultation</Link>
            </div>

            <div className="border border-line p-7">
              <h2 className="text-xl">Contact details</h2>
              <dl className="mt-4 space-y-3 text-[0.95rem]">
                {site.contact.email && (<div><dt className="text-ink-muted">Email</dt><dd><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></dd></div>)}
                {site.contact.phone && (<div><dt className="text-ink-muted">Telephone</dt><dd><a href={`tel:${site.contact.phone.replace(/\s/g, "")}`}>{site.contact.phone}</a></dd></div>)}
                {site.location.office && (
                  <div><dt className="text-ink-muted">Office</dt><dd><address className="not-italic">{site.location.office.street}, {site.location.office.city}, {site.location.office.country}</address></dd></div>
                )}
                {site.location.hours && (<div><dt className="text-ink-muted">Hours</dt><dd>{site.location.hours}</dd></div>)}
              </dl>
              {!site.contact.email && !site.contact.phone && (
                <>
                  <p className="mt-2 text-[0.95rem] text-ink-muted">Please use the form and we will reply by your preferred method.</p>
                  <DraftNote>verified email, telephone, office address and hours.</DraftNote>
                </>
              )}
            </div>

            <div className="text-sm text-ink-muted">
              <h2 className="mb-2 font-sans text-sm font-semibold text-ink">How we use your information</h2>
              <p>We use the details you submit only to respond to your inquiry. See our <Link href="/privacy">privacy policy</Link> for how long we keep it and your rights.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
