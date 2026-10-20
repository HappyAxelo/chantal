import Link from "next/link";
import { publicServices } from "@/content/services";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { Icon } from "@/components/ui/Icon";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Services",
  description:
    "Procurement advisory, contract management, FIDIC contract administration, MoU drafting and review, and documentation support. Find the right service for your matter.",
  path: "/services",
});

export default function ServicesPage() {
  const services = publicServices();
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Find the support that fits your matter"
        lede="Each service is scoped to your documents and your role. If you are not sure which applies, book a general consultation and we will help you decide."
        crumbs={[{ label: "Services", href: "/services" }]}
      />

      <section className="section">
        <div className="container">
          <ul className="divide-y divide-line border-y border-line">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="group grid gap-6 py-10 no-underline md:grid-cols-[auto_1fr_1.2fr_auto] md:items-start md:gap-10">
                  <span className="inline-flex h-14 w-14 items-center justify-center border border-line text-navy transition-colors group-hover:border-bronze-soft">
                    <Icon name={s.icon} className="h-7 w-7" />
                  </span>
                  <div>
                    <h2 className="text-2xl md:text-[1.75rem]">{s.title}</h2>
                    <p className="mt-3 text-[0.95rem] text-ink">{s.clientValue}</p>
                  </div>
                  <div>
                    <p className="text-ink-muted">{s.summary}</p>
                    <p className="mt-3 text-sm text-ink-muted">
                      <span className="font-semibold text-ink">Typically for: </span>
                      {s.whoMayNeed.slice(0, 2).join("; ")}.
                    </p>
                  </div>
                  <span className="link-arrow self-center text-[0.95rem]">View <Icon name="arrow" className="h-4 w-4" /></span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-14 grid gap-6 border border-line bg-canvas p-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl">Not sure which service you need?</h2>
              <p className="mt-2 text-ink-muted">Book a general consultation. We will talk through the matter and suggest the most suitable scope.</p>
            </div>
            <Link href="/book?service=general" className="btn-primary">Book a General Consultation</Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
