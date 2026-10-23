import Link from "next/link";

interface CtaLink {
  href: string;
  label: string;
}

export function CtaBand({
  title = "Need clarity on a contract, cost or procurement matter?",
  text,
  primary = { href: "/book", label: "Book a Consultation" },
  secondary = { href: "/contact", label: "Send an Inquiry" },
}: {
  title?: string;
  text?: string;
  primary?: CtaLink;
  secondary?: CtaLink | null;
}) {
  return (
    <section className="on-dark bg-navy text-white" aria-labelledby="cta-heading">
      <div className="container grid items-center gap-8 py-16 md:grid-cols-[1.4fr_1fr] md:py-20">
        <div>
          <span className="rule-accent mb-6" />
          <h2 id="cta-heading" className="text-white">{title}</h2>
          {text && <p className="mt-4 max-w-xl text-white/70">{text}</p>}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
          <Link href={primary.href} className="btn-light">{primary.label}</Link>
          {secondary && <Link href={secondary.href} className="btn-ghost-light">{secondary.label}</Link>}
        </div>
      </div>
    </section>
  );
}
