import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/env";

/**
 * Organisation structured data is emitted only once the official company
 * name is supplied; LocalBusiness data additionally requires a confirmed
 * office address (no geographic claims before then).
 */
function organisationJsonLd() {
  if (!site.company.name) return null;
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": site.location.office ? "ProfessionalService" : "Organization",
    name: site.company.displayName ?? site.company.name,
    legalName: site.company.name,
    url: siteUrl(),
    description: site.company.shortDescription,
    founder: { "@type": "Person", name: site.owner.name },
  };
  if (site.contact.email) base.email = site.contact.email;
  if (site.contact.phone) base.telephone = site.contact.phone;
  if (!site.location.office && site.location.country) {
    base.address = { "@type": "PostalAddress", addressLocality: site.location.city ?? undefined, addressCountry: site.location.country };
  }
  if (site.location.office) {
    const o = site.location.office;
    base.address = { "@type": "PostalAddress", streetAddress: o.street, addressLocality: o.city, addressRegion: o.region, postalCode: o.postalCode, addressCountry: o.country };
  }
  if (site.social.linkedin) base.sameAs = [site.social.linkedin];
  return base;
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const org = organisationJsonLd();
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      {org && <JsonLd data={org} />}
    </>
  );
}
