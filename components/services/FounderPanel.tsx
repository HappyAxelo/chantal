import Image from "next/image";
import { site } from "@/content/site";
import { ownerCredential, ownerDisplayName } from "@/lib/brand";
import { DraftNote } from "@/components/ui/DraftNote";

/** Founder portrait or, until a photo is approved, a typographic monogram (never a stock face). */
export function FounderPortrait() {
  const { portrait, name } = site.owner;
  if (portrait) {
    return (
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-canvas">
        <Image src={portrait} alt={`Portrait of ${name}`} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
      </div>
    );
  }
  const initials = name.split(" ").map((p) => p[0]).join("");
  return (
    <div className="relative flex aspect-[4/5] w-full items-center justify-center bg-navy" role="img" aria-label={`${name}, monogram`}>
      <div className="absolute inset-5 border border-white/15" />
      <span className="font-serif text-7xl tracking-wide text-white/90">{initials}</span>
      <span className="absolute bottom-10 h-px w-10 bg-bronze-soft" />
    </div>
  );
}

/** Verified founder facts only; missing fields appear as draft notes in preview and are omitted in production. */
export function FounderFacts() {
  const o = site.owner;
  const credential = ownerCredential();
  return (
    <div>
      <p className="eyebrow mb-3">{o.role}</p>
      <h3 className="text-3xl">{ownerDisplayName()}</h3>
      {credential ? (
        <p className="mt-2 font-medium text-bronze">{credential}</p>
      ) : (
        <DraftNote>exact designation and current status of &ldquo;{o.credential.value}&rdquo; before it is displayed.</DraftNote>
      )}

      {o.biography ? <p className="mt-6 text-ink-muted">{o.biography}</p> : <DraftNote>short professional biography.</DraftNote>}
      {o.professionalBackground ? <p className="mt-4 text-ink-muted">{o.professionalBackground}</p> : <DraftNote>professional background.</DraftNote>}

      {o.expertise.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-2">
          {o.expertise.map((e) => <li key={e} className="border border-line px-3 py-1 text-sm">{e}</li>)}
        </ul>
      ) : <DraftNote>areas of expertise.</DraftNote>}

      {o.qualifications.length > 0 ? (
        <div className="mt-6">
          <h4 className="mb-2 font-sans text-sm font-semibold uppercase tracking-eyebrow text-ink-muted">Qualifications</h4>
          <ul className="list-disc space-y-1 pl-5">{o.qualifications.map((q) => <li key={q}>{q}</li>)}</ul>
        </div>
      ) : <DraftNote>qualifications, with issuing institutions and dates.</DraftNote>}

      {o.memberships.length > 0 ? (
        <div className="mt-6">
          <h4 className="mb-2 font-sans text-sm font-semibold uppercase tracking-eyebrow text-ink-muted">Memberships</h4>
          <ul className="list-disc space-y-1 pl-5">{o.memberships.map((m) => <li key={m}>{m}</li>)}</ul>
        </div>
      ) : <DraftNote>verified professional memberships or affiliations (if any).</DraftNote>}

      {o.philosophy ? <blockquote className="mt-8 border-l-2 border-bronze-soft pl-5 font-serif text-xl italic text-navy">{o.philosophy}</blockquote> : <DraftNote>professional philosophy, in the owner&rsquo;s own words.</DraftNote>}
    </div>
  );
}
