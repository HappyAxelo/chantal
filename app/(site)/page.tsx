import Link from "next/link";
import { publicServices } from "@/content/services";
import { site } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { CtaBand } from "@/components/ui/CtaBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HeroVisual } from "@/components/services/HeroVisual";
import { ServiceCard } from "@/components/services/ServiceCard";
import { FounderPortrait } from "@/components/services/FounderPanel";
import { DraftNote } from "@/components/ui/DraftNote";
import { ownerCredential, ownerDisplayName } from "@/lib/brand";
import { pageMeta } from "@/lib/seo";
import type { IconName } from "@/types/content";

export const metadata = pageMeta({
  title: "Procurement, Contract Management & FIDIC Advisory",
  description:
    "Professional advisory services in procurement, contract management, FIDIC-related contract administration, MoU drafting and documentation support. Book a consultation.",
  path: "/",
});

const principles: { icon: IconName; title: string; text: string }[] = [
  { icon: "layers", title: "Structured, transparent process", text: "Scope, deliverables and terms are agreed in writing before work begins, so you know what you are getting." },
  { icon: "documents", title: "Careful document review", text: "We work from your actual documents, including amendments and particular conditions, not generic assumptions." },
  { icon: "message", title: "Clear communication", text: "Findings are written in plain language, with the points that need your decision made explicit." },
  { icon: "clock", title: "Attention to obligations and deadlines", text: "Notices, time limits and deliverables are identified early and tracked, because missed procedure is costly." },
  { icon: "check", title: "Practical, commercially informed advice", text: "Recommendations take account of the project, the relationship and the cost of each option." },
  { icon: "shield", title: "Confidentiality and care with data", text: "Documents are shared only through agreed channels, and we collect only the information we need." },
];

const steps = [
  { title: "Submit an inquiry", text: "Tell us briefly what the matter is about. Please do not send confidential documents at this stage." },
  { title: "Book an initial consultation", text: "We discuss your situation, the documents involved and what kind of support would help." },
  { title: "Agree scope and deliverables", text: "We confirm in writing what will be done, by when, and on what terms." },
  { title: "Begin the engagement", text: "Work starts once terms are agreed, with secure arrangements for sharing documents." },
];

export default function HomePage() {
  const services = publicServices();
  const credential = ownerCredential();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="container grid items-center gap-14 pb-20 pt-14 md:pt-20 lg:grid-cols-[1.15fr_1fr] lg:gap-20 lg:pb-28">
          <div>
            <p className="eyebrow reveal mb-6">Procurement · Contracts · FIDIC · MoUs</p>
            <h1 className="text-[clamp(2.25rem,4.2vw,3.4rem)]">
              <span className="block">Clarity in Procurement.</span>
              <span className="block italic text-navy-700">Confidence in Contracts.</span>
            </h1>
            <p className="lede mt-7 max-w-xl">
              Professional advisory services in procurement, contract management, FIDIC-related contract administration
              and documentation support, for organisations that need their processes and paperwork to hold up.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/book" className="btn-primary">Book a Consultation</Link>
              <Link href="/services" className="btn-secondary">Explore Our Services</Link>
            </div>
          </div>
          <div className="reveal reveal-delay-2 pb-6">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-canvas" aria-labelledby="services-heading">
        <div className="container">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              id="services-heading"
              eyebrow="Services"
              title="Advisory support across the life of a contract"
              lede="From preparing a procurement to closing out a contract, each engagement is scoped to your documents, your role and the rules that apply to you."
            />
            <Link href="/services" className="link-arrow shrink-0">All services <Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
          <div className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => <ServiceCard key={s.slug} service={s} index={i} />)}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="section" aria-labelledby="principles-heading">
        <div className="container grid gap-14 lg:grid-cols-[1fr_1.6fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              id="principles-heading"
              eyebrow="Why work with us"
              title="How we work"
              lede="These are the principles every engagement is run on. They describe our approach, not a promise about any particular outcome."
            />
          </div>
          <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {principles.map((p) => (
              <li key={p.title}>
                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center border border-line text-navy"><Icon name={p.icon} className="h-5 w-5" /></span>
                <h3 className="mb-2 text-xl">{p.title}</h3>
                <p className="text-ink-muted">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process */}
      <section className="section border-y border-line bg-canvas" aria-labelledby="process-heading">
        <div className="container">
          <SectionHeading id="process-heading" eyebrow="Engagement" title="How an engagement works" />
          <ol className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((s, i) => (
              <li key={s.title} className="relative border-t border-navy/20 pt-6">
                <span className="absolute -top-px left-0 h-px w-12 bg-bronze-soft" aria-hidden="true" />
                <span className="font-serif text-4xl text-navy/25" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mb-2 mt-3 text-xl"><span className="sr-only">Step {i + 1}: </span>{s.title}</h3>
                <p className="text-ink-muted">{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-12 max-w-3xl text-sm text-ink-muted">
            Submitting an inquiry or booking request does not by itself create an engagement or professional relationship.
            An engagement begins only once scope and terms have been agreed.
          </p>
        </div>
      </section>

      {/* Founder */}
      <section className="section" aria-labelledby="founder-heading">
        <div className="container grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="max-w-sm">
            <FounderPortrait />
          </div>
          <div>
            <p className="eyebrow mb-3">About the founder</p>
            <h2 id="founder-heading">{ownerDisplayName()}</h2>
            {credential && <p className="mt-3 font-medium text-bronze">{credential}</p>}
            {site.owner.biography ? (
              <p className="lede mt-6">{site.owner.biography}</p>
            ) : (
              <>
                <p className="lede mt-6">
                  {site.owner.name} founded this practice to give clients practical, well-documented support on procurement and contract matters.
                </p>
                <DraftNote>founder biography, background and credentials. The sentence above is draft copy for the owner to approve.</DraftNote>
              </>
            )}
            <Link href="/about" className="link-arrow mt-8">More about our approach <Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
