import Link from "next/link";
import { site } from "@/content/site";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { DraftNote } from "@/components/ui/DraftNote";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FounderFacts, FounderPortrait } from "@/components/services/FounderPanel";
import { brandName } from "@/lib/brand";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "About",
  description: `About ${brandName()}: our purpose, professional values and approach to procurement and contract advisory engagements.`,
  path: "/about",
});

const values = [
  { title: "Integrity", text: "We say what the documents support, including when the answer is not the one a client hoped for." },
  { title: "Precision", text: "Contractual wording, dates and procedures matter. We read carefully and record accurately." },
  { title: "Discretion", text: "Client matters are treated as confidential and discussed only with those who need to know." },
  { title: "Accountability", text: "We agree what we will deliver and when, and we keep clients informed if anything changes." },
  { title: "Practicality", text: "Advice should be usable by a project team on a working day, not only by specialists." },
];

const approach = [
  "We start by understanding your role, the documents and the decision you need to make.",
  "We confirm the scope, deliverables, timeline and fees in writing before work begins.",
  "We identify early anything that falls outside our scope, including matters that need a qualified lawyer or other regulated professional.",
  "We agree how documents will be shared securely, and we return or delete them in line with the agreed terms.",
];

export default function AboutPage() {
  const loc = site.location;
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A focused advisory practice for procurement and contract matters"
        lede="We help organisations prepare, administer and document their procurement and contracts with care, so that obligations are understood and decisions are well recorded."
        crumbs={[{ label: "About", href: "/about" }]}
      />

      <section className="section">
        <div className="container grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Overview" title="What we do" />
            <div className="mt-6 space-y-5 text-ink-muted">
              <p>
                {brandName()} provides advisory support in procurement, contract management, FIDIC-related contract
                administration, Memoranda of Understanding and business documentation.
              </p>
              <p>
                Our work sits alongside our clients&rsquo; own teams. We help them read contracts for what they require,
                keep the records that matter and approach procurement with a clear, defensible process.
              </p>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:gap-10">
            <div className="border-t border-navy/20 pt-6">
              <p className="eyebrow mb-3">Mission</p>
              <p className="font-serif text-xl leading-snug text-navy">To give clients clarity on their procurement and contractual obligations, and the confidence to act on it.</p>
            </div>
            <div className="border-t border-navy/20 pt-6">
              <p className="eyebrow mb-3">Vision</p>
              <p className="font-serif text-xl leading-snug text-navy">Procurement and contract processes that are well understood, well documented and fair to all parties.</p>
            </div>
            <div className="sm:col-span-2"><DraftNote>mission and vision are proposed drafts for the owner to edit or approve.</DraftNote></div>
          </div>
        </div>
      </section>

      <section className="section bg-canvas" aria-labelledby="values-heading">
        <div className="container">
          <SectionHeading id="values-heading" eyebrow="Values" title="Professional values" />
          <ul className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
            {values.map((v) => (
              <li key={v.title} className="bg-canvas p-6 lg:p-7">
                <h3 className="mb-2 text-xl">{v.title}</h3>
                <p className="text-[0.95rem] text-ink-muted">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="founder-heading" id="founder">
        <div className="container grid gap-12 md:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="max-w-sm">
            <FounderPortrait />
            {!site.owner.portrait && <DraftNote>professional portrait (approved photograph).</DraftNote>}
          </div>
          <div>
            <h2 id="founder-heading" className="sr-only">Founder profile</h2>
            <FounderFacts />
          </div>
        </div>
      </section>

      <section className="section border-t border-line bg-canvas" aria-labelledby="approach-heading">
        <div className="container grid gap-12 lg:grid-cols-2">
          <SectionHeading id="approach-heading" eyebrow="Approach" title="How we approach client engagements" />
          <ol className="space-y-6">
            {approach.map((a, i) => (
              <li key={a} className="flex gap-5">
                <span className="font-serif text-2xl text-bronze" aria-hidden="true">{i + 1}.</span>
                <p className="pt-1 text-ink">{a}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="scope-heading">
        <div className="container max-w-3xl">
          <SectionHeading id="scope-heading" eyebrow="Where we work" title="Geographic scope and languages" />
          <div className="mt-6 space-y-3 text-ink-muted">
            {loc.country && <p>Based in {loc.city ? `${loc.city}, ` : ""}{loc.country}.</p>}
            {loc.serviceAreas.length > 0 && <p>We work with clients in {loc.serviceAreas.join(", ")}.</p>}
            {loc.languages.length > 0 && <p>Working languages: {loc.languages.join(", ")}.</p>}
            {!loc.country && loc.serviceAreas.length === 0 && (
              <p>Please <Link href="/contact">contact us</Link> to confirm whether we can assist with matters in your country or jurisdiction.</p>
            )}
            {(loc.serviceAreas.length === 0 || loc.languages.length === 0 || !loc.governingLaw) && (
              <DraftNote>service areas (Rwanda only, or also regional/international), governing law and working languages.</DraftNote>
            )}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
